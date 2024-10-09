import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { PortalModel } from '../Utilities/PortalModel';
import { IonDatetime } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular'
import { LoadingController } from '@ionic/angular';
import * as moment from 'moment';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Platform } from '@ionic/angular';
import * as $ from "jquery";
import { ActionSheetController } from '@ionic/angular';
import { Device } from '@capacitor/device';
import { Geolocation } from '@capacitor/geolocation';
import { WorkerTrackingService } from '../services/worker-tracking/worker-tracking.service'
import { ReusableComponentsService } from '../services/general-reusable/reusable-components.service'
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
  lblDeviceID: string = "";
  workerAttendanceLocation = "";
  workerMobileImei = "";
  thisMobileImei = "";
  StrShiftStartsAt = "";
  StrShiftEndsAt = "";
  constructor(
    public actionSheetController: ActionSheetController,
    private iab: InAppBrowser,
    public plt: Platform,
    private router: Router,
    public toastController: ToastController,
    public http: HttpClient,
    private storage: Storage,
    private loadingController: LoadingController,
    private workerTrackingService: WorkerTrackingService,
    private reusableComponentsService: ReusableComponentsService,
  ) {
    this.objPortalModel = new PortalModel(this.toastController, this.loadingController, this.http);
    this.plt.ready().then((readySource) => {
      storage.create();
    });
  }

  async getUniqueDeviceID() {
    const info1 = await Device.getId();
    this.lblDeviceID = info1.identifier;
    this.thisMobileImei = info1.identifier;
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
    if (this.thisMobileImei) {
      if (confirm("Please make sure this is your regular device. Are you sure you want to register this device?")) {
        this.loadingController
          .create({ keyboardClose: true, message: 'Please wait...' })
          .then(loadingEl => {
            loadingEl.present();
            let url = PortalModel.ApiUrl + "/Worker/OneTimeDeviceRegistration?userID=" + this.UserID + "&ImeiNumber=" + this.thisMobileImei;
            this.http.get(url)
              .subscribe(data => {
                loadingEl.dismiss();
                let response = JSON.parse(JSON.stringify(data));

                if (response.responseType == 1) {
                  this.objPortalModel.presentToast("Successfully Registered");
                  this.router.navigateByUrl("tabs/tab1");
                } else {
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
    if (this.workerMobileImei && this.thisMobileImei) {
      this.objPortalModel.presentToastWithDuration("Please wait...", 4000);
      var options = {
        enableHighAccuracy: true,
        maximumAge: 0, // should be default, just in case
        timeout: 30000
      }

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
                      this.objPortalModel.presentToast("The app is attempting to start monitoring.");
                      this.workerTrackingService.fnStartTracking();
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
          if (this.plt.is('android')) {
            var errorMsg = error + "";
            if (errorMsg.includes("location disabled")) {
              this.reusableComponentsService.fnOpenSettingsPageApp("Location", "android", false);
              return;
            }
          }

          if (type == 1) {
            //Write the code inside. If you do not want to ask permissions on load everytime.
            if (this.plt.is('android')) {
              this.reusableComponentsService.fnOpenSettingsPageApp("Location");
            } else {
              this.reusableComponentsService.fnOpenSettingsPageApp("Location", "ios");
            }
          }
        });
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
            } else {
              if (response.Result = "No shift is assigned today!") {
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
