import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { HttpClientModule, HttpClient } from '@angular/common/http';

export class PortalModel {
  static ApiUrl: string = "http://localhost:55287";
 // static ApiUrl: string = "http://mbntasker.com";

  
  constructor(private toastController: ToastController,
    private loadingController: LoadingController, public http: HttpClient) {
  }


  fnCalculateDistance(lat1:number,lat2:number,long1:number,long2:number){
    let p = 0.017453292519943295;    // Math.PI / 180
    let c = Math.cos;
    let a = 0.5 - c((lat1-lat2) * p) / 2 + c(lat2 * p) *c((lat1) * p) * (1 - c(((long1- long2) * p))) / 2;
    let dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
    dis = (dis * 0.621371) * 1609.34;
    return dis;
  }

  fnNumberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  fnDelay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  fnArrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value;
    });
  }
  fnRemoveTags(str) {
    if ((str === null) || (str === ''))
      return false;
    else
      str = str.toString();
    return str.replace(/(<([^>]+)>)/ig, '');
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();
  }
  async presentToast(myMessage) {
    const toast = await this.toastController.create({
      message: myMessage,
      duration: 2500,
    });
    toast.present();
  }
  async presentToastWithDuration(myMessage, duration) {
    const toast = await this.toastController.create({
      message: myMessage,
      duration: duration,
    });
    toast.present();
  }
 
}
