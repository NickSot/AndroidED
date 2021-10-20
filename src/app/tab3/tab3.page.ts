import { Component, NgZone, OnInit } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { interval } from 'rxjs';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{
  debugText: string = '';
  private zone: NgZone;

  constructor(private bluetoothSerial: BluetoothSerial) {

  }

  ngOnInit() {
    this.debugText = "bye";

    let int = interval(200).subscribe((d) => {
      this.bluetoothSerial.available().then(res => {
            this.bluetoothSerial.isConnected().then(
              res => {
                this.bluetoothSerial.read().then(res => {
                  this.debugText = res;
                },
                rej => {
                  this.debugText = 'Read failure...';
                });
              },
              rej => {
                this.debugText = 'Device is not connected!'
              });
            }, rej => {
              this.debugText = 'Bluetooth is not available!';
          });
    });
  }

  private onDataRead() {
    //handle the data from the module
    //cancerous bit...

  }

}
