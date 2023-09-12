import { Component } from '@angular/core';
declare var sdk: any
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'websdk-package';
  isDeviceConnect: boolean = false;
  public deviceManager = new sdk.DeviceManager();
  async deviceConnect() {
    let checkDevice = await this.deviceManager.connect();
    if (checkDevice) {
      let partnumber = await this.deviceManager.getPartNumber();
      let inputData = document.getElementById('vendor') as HTMLInputElement;
      inputData.value = partnumber;
      this.isDeviceConnect = true;
      alert(`Device Connected!`);
    }
  }

  async disconnect() {
    await this.deviceManager.disconnect();
    let inputData = document.getElementById('vendor') as HTMLInputElement;
    inputData.value = '';
    this.isDeviceConnect = false;
    let clearGetIdData = document.getElementById('databytes') as HTMLInputElement;
    clearGetIdData.value = "";
    alert('Device Disconnected!');
  }

  async getActiveID() {
    if (this.isDeviceConnect) {
      let DataBytes = await this.deviceManager.getDataBytes();
      if (DataBytes === 0) {
        let inputData = document.getElementById('databytes') as HTMLInputElement;
        inputData.value = "No Card on Reader";
        return;
      }
      let activeID = await this.deviceManager.getActiveID();
      let cardByte = 'ID:' + DataBytes + " Bits" + '\n' + activeID;
      let inputData = document.getElementById('databytes') as HTMLInputElement;
      inputData.value = cardByte;
    } else {
      alert("No Device Connected");
    }
  }

  async getActiveID32() {
    if (this.isDeviceConnect) {
      let DataBytes = await this.deviceManager.getDataBytes();
      if (DataBytes === 0) {
        let inputData = document.getElementById('databytes') as HTMLInputElement;
        inputData.value = "No Card on Reader";
        return;
      }
      let getActiveID = await this.deviceManager.getActiveID32();
      let getActiveIDdata = getActiveID.split('');
      let data1 = getActiveIDdata.splice(0, 23).join('');
      let data2 = getActiveIDdata.splice(1, 23).join('');
      let data3 = getActiveIDdata.splice(2, 23).join('');
      let data4 = getActiveIDdata.splice(3, 23).join('');
      let dataBytes = "ID: " + DataBytes + " Bits" + `\n` + data1 + `\n` + data2 + `\n` + data3 + `\n` + data4;
      let inputData = document.getElementById('databytes') as HTMLInputElement;
      inputData.value = dataBytes;
    } else {
      alert("No Device Connected");
    }
  }
}


