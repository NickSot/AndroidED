import { Component, OnInit, Input } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})

export class ExploreContainerComponent implements OnInit {
  //Bluetooth module address: 00:0C:BF:19:A2:59

  @Input() name: string;
  @Input() tab: string = 'tab1';
  height: number = 180.0;
  debugText: string = '';
  dataText: string = '';

  constructor(private bluetoothSerial: BluetoothSerial) {

  }

  ngOnInit() {

  }

  ngOnClick() {
    //send the calculated data (height/2) to the shoes
    let calculatedDistance = this.height/2;

    this.bluetoothSerial.isConnected().then(res => {
      this.debugText = `Connected! Sending data: ${calculatedDistance}`
      this.writeToModule(calculatedDistance.toString());
    },
    rej => {
      this.debugText = 'NO!';
    });
  }

  ngConnectClick(){
    //initialize bluetooth connection...
    this.bluetoothSerial.isConnected().then(res => {
      this.bluetoothSerial.disconnect().then(res => {
        this.debugText = 'DISCONNETED';
      });
    }, rej => {
      this.bluetoothSerial.available().then(
        res => {
          this.bluetoothSerial.list().then(res => {
            this.bluetoothSerial.connect("00:0C:BF:19:A2:59").forEach(next => {
              this.debugText = 'CONNECTED!';
            });
          });
        },
        rej => {
          this.debugText = 'Unavailable';
        }
      );
    });
  }

  private writeToModule(data: string) {
    this.bluetoothSerial.write(data).then(res => {
      this.dataText = 'Data sent successfully!';
    }, rej => {
      this.dataText = 'Data could not be sent...';
    });
  }
}
