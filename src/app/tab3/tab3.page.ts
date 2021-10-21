import { Component, OnInit } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { interval } from 'rxjs';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{
  debugText: string = '';
  private queue: Array<string> = [];
  //front: 2, back: 1, side: 3
  constructor(private bluetoothSerial: BluetoothSerial, private nativeAudio: NativeAudio) {

  }

  ngOnInit() {
    this.nativeAudio.preloadComplex('left', 'assets/audio/Left.m4a', 1, 1, 0).then(() => {
      this.nativeAudio.preloadComplex('right', 'assets/audio/Right.m4a', 1, 1, 0).then(() => {
        this.nativeAudio.preloadComplex('forward', 'assets/audio/Forward.m4a', 1, 1, 0).then(() => {
          this.nativeAudio.preloadComplex('backwards', 'assets/audio/Backwards.m4a', 1, 1, 0).then(() => {
            this.debugText = "all files preloaded...";
          });
        });
      });
    });

    let audioPlaying = false;

    let int = interval(100).subscribe((d) => {
      // if (!audioPlaying){
      //   audioPlaying = true;
      //   this.nativeAudio.play('forward', () => {audioPlaying = false;});
      // }

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

                    //play the audio file according to which is the most occurring value in the queue
                    switch (winner){
                      case 'S1':
                        if (!audioPlaying){
                          audioPlaying = true;
                          this.nativeAudio.play('forward', () => {audioPlaying = false;});
                        }

                        break;
                      case 'R1':
                        if (!audioPlaying){
                          audioPlaying = true;
                          this.nativeAudio.play('forward', () => {audioPlaying = false;});
                        }

                        break;
                      case 'S2':
                        if (!audioPlaying){
                          audioPlaying = true;
                          this.nativeAudio.play('backwards', () => {audioPlaying = false;});
                        }

                        break;
                      case 'R2':
                        if (!audioPlaying){
                          audioPlaying = true;
                          this.nativeAudio.play('backwards', () => {audioPlaying = false;});
                        }

                        break;
                      case 'S3':
                        if (!audioPlaying){
                          audioPlaying = true;
                          this.nativeAudio.play('right', () => {audioPlaying = false;});
                        }

                        break;
                      case 'R3':
                        if (!audioPlaying){
                          audioPlaying = true;
                          this.nativeAudio.play('left', () => {audioPlaying = false;});
                        }

                        break;
                    }
                  }
                },
                rej => {
                  // this.debugText = 'Read failure...';
                });
              },
              rej => {
                // this.debugText = 'Device is not connected!';
              });
            }, rej => {
              // this.debugText = 'Bluetooth is not available!';
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
