import { Component, OnInit, Input } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})

export class ExploreContainerComponent implements OnInit {
  @Input() name: string;
  height: number = 180.0;

  constructor(private bluetoothSerial: BluetoothSerial) {
    bluetoothSerial = new BluetoothSerial();
  }

  //Bluetooth module address: 00:0C:BF:19:A2:59
  ngOnInit() {
    //initialize bluetooth connection...
    this.bluetoothSerial.connect("00:0C:BF:19:A2:59").toPromise().then((device) => {
      console.log('Success!!!');
    });
  }

  ngOnClick() {
    console.log(`The calculated distance is: ${this.height/2}`);
  }
}
