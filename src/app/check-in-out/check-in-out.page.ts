import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { PortalModel } from '../Utilities/PortalModel';
import { IonDatetime } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular'
import { LoadingController } from '@ionic/angular';
import * as moment from 'moment';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Platform } from '@ionic/angular';
import * as $ from "jquery";
// import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { ActionSheetController } from '@ionic/angular';
// import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
// import { Uid } from '@ionic-native/uid/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { Device } from '@capacitor/device';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-check-in-out',
  templateUrl: './check-in-out.page.html',
  styleUrls: ['./check-in-out.page.scss'],
})
export class CheckInOutPage implements OnInit {

  APIUrl = PortalModel.ApiUrl;
  objPortalModel: any;
  UserID: any;
  canAssignRiderToShop = false;
  Username: any;
  lstAttendance = [];
  DoCheckInOut: boolean = false;

  fromDateValue = '';
  toDateValue = '';
  lblFromDate: string = "";
  lblToDate: string = "";
  lblDeviceID:string="";
  workerAttendanceLocation = "";
  workerMobileImei = "";
  thisMobileImei="";
  StrShiftStartsAt="";
  StrShiftEndsAt="";
  constructor( 
    // private uid: Uid,
    private androidPermissions: 
    AndroidPermissions,
    // private uniqueDeviceID: UniqueDeviceID,
    // public geolocation: Geolocation, 
    public actionSheetController: ActionSheetController, 
    private iab: InAppBrowser, 
    public plt: Platform, 
    private router: Router, 
    public toastController: ToastController,
    public http: HttpClient, 
    private storage: Storage, 
    private loadingController: LoadingController
    ) {
    this.objPortalModel = new PortalModel(this.toastController, this.loadingController, this.http);
    this.plt.ready().then((readySource) => {
      storage.create();
    });
  }
  
  // getUniqueDeviceID() {
  //   console.log("Getting Device ID");

    


  //   // const logDeviceInfo = async () => {
  //   //   const info = await Device.getId();
  //   //   //this.thisMobileImei = info;
  //   //   console.log('get getUniqueDeviceID = ',info);
  //   // }
  //   // this.uniqueDeviceID.get()
  //   // .then((uuid: any) => {
  //   //   console.log(uuid);
  //   //   this.lblDeviceID = uuid;
  //   //   this.thisMobileImei = uuid;
  //   // })
  //   // .catch((error: any) => {
  //   //   console.log(error);
  //   //   this.thisMobileImei = "Error! ${error}";
  //   // });
  // }

  async getUniqueDeviceID() {
    const info1 = await Device.getId();
    console.log('get getUniqueDeviceID = ', info1);
    this.lblDeviceID = info1.uuid;
    this.thisMobileImei = info1.uuid;
  }
  ngOnInit() {
  }
  GetFromDate() {
    this.lblFromDate = moment(this.fromDateValue).format('DD-MMM-YYYY');
  }
  GetToDate() {
    this.lblToDate = moment(this.toDateValue).format('DD-MMM-YYYY');
  }
  fnOneTimeRegistration() {
    if(this.thisMobileImei){
      if (confirm("Please make sure this is your regular device. Are you sure you want to register this device?")) {
        this.loadingController
        .create({ keyboardClose: true, message: 'Please wait...' })
        .then(loadingEl => {
          loadingEl.present();
          let url = PortalModel.ApiUrl + "/Worker/OneTimeDeviceRegistration?userID=" + this.UserID+"&ImeiNumber="+this.thisMobileImei;
          this.http.get(url)
            .subscribe(data => {
              loadingEl.dismiss();
              let response = JSON.parse(JSON.stringify(data));
              
              if (response.responseType == 1) {
                this.objPortalModel.presentToast("Successfully Registered");
                this.router.navigateByUrl("tabs/tab1");
              }else{
                this.objPortalModel.presentToast(response.Msg);
              }
            }, error => {
              loadingEl.dismiss();
              console.log(error);
              this.objPortalModel.presentToast("No Internet Connection!");
            });
        });
      }
    } else {
      this.objPortalModel.presentToast("Please allow application and reload if required!");
    }
  }
  ionViewDidEnter() {
    this.plt.ready().then((readySource) => {
      this.getUniqueDeviceID();
      this.storage.get('session').then((UserID) => {
        this.UserID = UserID;
        this.lblFromDate = moment(Date.now()).format('DD-MMM-YYYY');
        this.lblToDate = moment(Date.now()).format('DD-MMM-YYYY');
        this.storage.get('Username').then((Username) => {
          this.Username = Username;
          this.fnGetWorkerAttendanceLocation();
          this.fnGetCheckInOuts();
        });

      });

      this.storage.get('rights').then((lstUserRights) => {
        if (lstUserRights.includes("Do Check In Out")) {
          this.DoCheckInOut = true;
        }
      });
    });
  }
  async fnOpenAttendanceForm() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Actions',
      cssClass: 'my-custom-class',
      buttons:
        [
          {
            text: 'Check In',
            icon: 'arrow-down',
            data: 10,
            handler: () => {
              this.fnDoCheckInOut(1);
            }
          },
          {
            text: 'Check Out',
            icon: 'arrow-up',
            data: 10,
            handler: () => {
              this.fnDoCheckInOut(2);
            }
          },
          {
            text: 'Cancel',
            icon: 'close',
            role: 'cancel',
            handler: () => {

            }
          }
        ]
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role and data', role, data);
  }

  fnDoCheckInOut(type) {
            // this.loadingController
            //   .create({ keyboardClose: true, message: 'Please wait...' })
            //   .then(loadingEl => {
            //     loadingEl.present();
            //     let url = PortalModel.ApiUrl + "/Attendance/DoAttendance?userID=" + this.UserID + "&username=" + this.Username + "&type=" + type + "&LatitudeCheckIn=" + 1 + "&LongitudeCheckIn=" + 1 + "&imeiNumber=" + this.thisMobileImei;
            //     this.http.get(url)
            //       .subscribe(data => {
            //         loadingEl.dismiss();
            //         let response = JSON.parse(JSON.stringify(data));
            //         if (response.responseType == 1) {
            //           this.fnGetCheckInOuts();
            //         } else {
            //           this.objPortalModel.presentToast(response.Msg);
            //         }
            //       }, error => {
            //         loadingEl.dismiss();
            //         this.objPortalModel.presentToast("No Internet Connection!");
            //       });
            //   });

    //this.thisMobileImei = "76151";
    if (this.workerMobileImei && this.thisMobileImei && this.workerMobileImei == this.thisMobileImei) {
      this.objPortalModel.presentToastWithDuration("Please wait...", 4000);
      var options = {
        enableHighAccuracy: true,
        maximumAge: 0, // should be default, just in case
        timeout: 6000
      }
      // this.geolocation.getCurrentPosition(options)

      Geolocation.getCurrentPosition(options)
        .then((resp) => {
          let latitude = "" + resp.coords.latitude;
          let longitude = "" + resp.coords.longitude;

          let IsError = false;

          // Get Worker Attendance Location based on user ID

          if (this.workerAttendanceLocation) {
            var lat1 = this.workerAttendanceLocation.split(',')[0];
            var long1 = this.workerAttendanceLocation.split(',')[1];

            var lat2 = latitude;
            var long2 = longitude;

            var distanceInMeters = this.objPortalModel.fnCalculateDistance(lat1, lat2, long1, long2);
            if (distanceInMeters > 100) {
              IsError = true;
              var dd = parseFloat(distanceInMeters).toFixed(0);
              alert("You are " + dd + " meters away from attendance location! The distance should be less than 100 meters.");
            }
          }

          if (!IsError) {
            this.loadingController
              .create({ keyboardClose: true, message: 'Please wait...' })
              .then(loadingEl => {
                loadingEl.present();
                let url = PortalModel.ApiUrl + "/Attendance/DoAttendance?userID=" + this.UserID + "&username=" + this.Username + "&type=" + type + "&LatitudeCheckIn=" + latitude + "&LongitudeCheckIn=" + longitude + "&imeiNumber=" + this.thisMobileImei;
                this.http.get(url)
                  .subscribe(data => {
                    loadingEl.dismiss();
                    let response = JSON.parse(JSON.stringify(data));
                    if (response.responseType == 1) {
                      this.fnGetCheckInOuts();
                    } else {
                      this.objPortalModel.presentToast(response.Msg);
                    }
                  }, error => {
                    loadingEl.dismiss();
                    this.objPortalModel.presentToast("No Internet Connection!");
                  });
              });
          }

        }, error => {
          alert("There is a problem in accessing your location. Please make sure you have turned on your location, allowed app to access location and have active internet connection. " + JSON.stringify(error))
          console.log('Error getting location', error);
        });
    } else {
      this.objPortalModel.presentToast("This device is not registered!");
    }
  }
  fnReloadPage() {
    window.location.reload();
  }

  fnGetWorkerAttendanceLocation() {
    this.loadingController
      .create({ keyboardClose: true, message: 'Please wait...' })
      .then(loadingEl => {
        loadingEl.present();
        let url = PortalModel.ApiUrl + "/Worker/GetWorkerAttendanceLocation?userID=" + this.UserID + "&username=" + this.Username;
        this.http.get(url)
          .subscribe(data => {
            loadingEl.dismiss();
            let response = JSON.parse(JSON.stringify(data));
            if (response.responseType == 1) {
              this.DoCheckInOut = true;
              this.workerAttendanceLocation = response.Data.LatitudeCheckIn;
              this.workerMobileImei = response.Data.MobileUniqueID;
              this.StrShiftStartsAt = response.Data.StrShiftStartsAt;
              this.StrShiftEndsAt = response.Data.StrShiftEndsAt;
              if (this.workerMobileImei == "") {
                $("#divRegister").show();
              } else {
                $("#divRegister").hide();
              }
            }else{
              if(response.Result="No shift is assigned today!"){
                this.DoCheckInOut = false;
              }
            }
          }, error => {
            loadingEl.dismiss();
            console.log(error);
            this.objPortalModel.presentToast("No Internet Connection!");
          });
      });
  }
  fnGetCheckInOuts() {
    this.loadingController
      .create({ keyboardClose: true, message: 'Please wait...' })
      .then(loadingEl => {
        loadingEl.present();
        let url = PortalModel.ApiUrl + "/Attendance/GetAttendance?userID=" + this.UserID + "&username=" + this.Username + "&fromDate=" + this.lblFromDate + "&toDate=" + this.lblToDate;
        this.http.get(url)
          .subscribe(data => {
            loadingEl.dismiss();
            let response = JSON.parse(JSON.stringify(data));
            if (response.responseType == 1) {
              this.lstAttendance = response.Data;
            }
          }, error => {
            loadingEl.dismiss();
            console.log(error);
            this.objPortalModel.presentToast("No Internet Connection!");
          });
      });
  }
}
