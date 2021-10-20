import { Component, OnInit } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { interval } from 'rxjs';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{
  debugText: string = '';
  private queue: Array<string> = [];

  constructor(private bluetoothSerial: BluetoothSerial) {

  }

  ngOnInit() {
    let int = interval(100).subscribe((d) => {
      //
      this.bluetoothSerial.available().then(res => {
            this.bluetoothSerial.isConnected().then(
              res => {
                this.bluetoothSerial.read().then((res: string) => {
                  if (res != '') {
                    for (let i = 0; i < res.length - 1; i++){
                      if (res[i] === 'S' || res[i] === 'R' && (res[i + 1] >= '1' && res[i + 1] <= '3')){
                        this.queue.push(res[i] + res[i + 1]);
                      }
                    }
                  }

                  if (d % 4 == 0){
                    // int.unsubscribe();
                    //this call retrieves the element of that data that occurs the most.
                    let winner = this.onDataRead(this.queue);
                    this.queue = [];
                    this.debugText = winner;
                  }
                },
                rej => {
                  this.debugText = 'Read failure...';
                });
              },
              rej => {
                this.debugText = 'Device is not connected!';
              });
            }, rej => {
              this.debugText = 'Bluetooth is not available!';
          });
    });
  }

  //craete a case distinction for each read value, and generate sound...

  private onDataRead(data: Array<string>) : string{
    //handle the data from the module (the cancerous bit...)
    data.sort((a, b) => parseInt(a[1]) - parseInt(b[1]));

    this.debugText = data.toString();

    let prevCounter = 0;
    let counter = 0;
    let mostOccurrences = data[0];

    for (let i = 1; i < data.length; i++){
      if (data[i] != data[i - 1]) {
        if (counter > prevCounter){
          mostOccurrences = data[i - 1];
          prevCounter = counter;
        }

        counter = 0;
      }

      counter+=1;
    }

    return mostOccurrences;
  }

}
