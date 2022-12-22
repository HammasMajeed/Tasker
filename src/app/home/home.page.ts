import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { LoadingController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import {  MenuController } from '@ionic/angular';
import { PortalModel} from '../Utilities/PortalModel';
// import { File } from '@awesome-cordova-plugins/file/ngx';

import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  divPassword: boolean = true;
  disableBtnUsername: boolean = false;
  divBuildings:boolean=true;
  btnNext:string ="Next";
  lstBuildings:[];
  selectedBuilding:string;
  
  divForgotPassword:boolean=true;
  divUsername:boolean=false;
  disableBtnPassword:boolean=false;
  btnLogin:string="Login";
  buildingChoosed:boolean = false;
  txtUsername: string;
  objPortalModel :any;
  txtPassword:string;
  fileName: string = "btmi.json";
  constructor(public menuCtrl: MenuController,public plt: Platform,private storage: Storage,private router: Router,
    public toastController: ToastController,public http: HttpClient,private loadingController:LoadingController) { 
      this.plt.ready().then((readySource) => {
        storage.create(); 
        this.objPortalModel = new PortalModel(this.toastController,this.loadingController,this.http);
      });
    }
    ionViewWillEnter(){
      this.menuCtrl.enable(false);

      const printCurrentPosition = async () => {
        const coordinates = await Geolocation.getCurrentPosition();

        console.log('Current position in geolocation capacitor :', coordinates);
      };
    }
    ionViewDidLeave(){
      this.menuCtrl.enable(true);
    }
    fnLoginUser(){
    if (this.txtUsername && this.txtPassword) {
      this.disableBtnPassword = true;
      this.btnLogin = "Please wait...";

      let url = PortalModel.ApiUrl + "/Users/LoginUser?username=" + this.txtUsername + "&password=" + this.txtPassword + "&comingFrom=2";
      console.log("Login URL: "+url);
      this.http.get(url)
        .subscribe(data => {
          let response = JSON.parse(JSON.stringify(data));
          let responseType = response.responseType;

          let lstUserRights = response.Records;
          if (responseType == 1) {
            this.btnLogin = "Logging in..."
            this.objPortalModel.presentToast(response.Msg);
            this.disableBtnPassword = false;
            this.btnLogin = "Login"
            this.txtPassword = "";
            this.divUsername = false;
            this.divPassword = true;
            this.txtUsername = "";

            let UserID = response.Result.split(':')[0];
            let Username = response.Result.split(':')[1];

            this.fnSaveSession(lstUserRights, UserID, Username)
          } else {
            this.disableBtnPassword = false;
            this.btnLogin = "Login"
            this.objPortalModel.presentToast(response.Msg);
          }
        }, error => {
        debugger;
        console.log(error+" "+JSON.stringify(error));
          this.objPortalModel.presentToast("No Internet Connection!");
        });
    } else {
      this.objPortalModel.presentToast("Please enter username and password!");
    }
  }
 
  fnSaveSession(lstUserRights, UserID, Username) {
    this.storage.set('rights', lstUserRights).then((res) => {
    });
    this.storage.set('session', UserID).then((res) => {
    });
     this.storage.set('Username', Username).then((res) => {
    });
    this.router.navigateByUrl("tabs/tab1");
  }
}
