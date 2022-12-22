import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { PortalModel } from '../Utilities/PortalModel';
import { IonDatetime } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular'
import { LoadingController } from '@ionic/angular';
import * as moment from 'moment';
import { ActionSheetController } from '@ionic/angular';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Platform } from '@ionic/angular';
import * as $ from "jquery";
// import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-task-activities',
  templateUrl: './task-activities.page.html',
  styleUrls: ['./task-activities.page.scss'],
})
export class TaskActivitiesPage implements OnInit {

  TaskName:string="Task";
  APIUrl = PortalModel.ApiUrl;
  objPortalModel: any;
  AddOrder: boolean = false;
  UserID: any;
  Username: any;
  TaskID:any;

  NoAttachments=false;
  lstTaskActivity=[];
  lstAttachements=[];
  isActivityModalOpen = false;
  StartsOn="";
  ActivityTitle="";
  ActivityDetails = "";
  ManagerRemarks="";
  WorkerRemarks="";
  CheckInDateTime="";
  CheckOutDateTime="";
  ActiveActivityID : any;
  btnStatus = "";
  ActivityLocation="";
  watch:any;

  constructor(
    // public geolocation:Geolocation,
    public actionSheetController: ActionSheetController, private iab: InAppBrowser, public plt: Platform, private router: Router, public toastController: ToastController,
    public http: HttpClient, private storage: Storage, private loadingController: LoadingController) {
    this.objPortalModel = new PortalModel(this.toastController, this.loadingController, this.http);
    this.plt.ready().then((readySource) => {
      storage.create();
    });
  }

  ngOnInit() {
  }

  
  ionViewDidEnter() {
    this.plt.ready().then((readySource) => {
      this.storage.get('session').then((UserID) => {
        this.UserID = UserID;
        this.storage.get('TaskID').then((TaskID) => {
          this.TaskID = TaskID;
          this.fnGetTaskActivity();
        });
      }); 
      this.storage.get('Username').then((Username) => {
        this.Username = Username;
      });
      this.storage.get('TaskName').then((TaskName) => {
        this.TaskName = TaskName;
      });
   
    });
  }

  fnGetTaskActivity() {
    this.loadingController
      .create({ keyboardClose: true, message: 'Please wait...' })
      .then(loadingEl => {
        loadingEl.present();
        let url = PortalModel.ApiUrl + "/Tasks/GetTaskActivity?userID=" + this.UserID + "&username=" + this.Username+"&taskID="+this.TaskID;
        this.http.get(url)
          .subscribe(data => {
            $("#lblNoTasks").hide();
            loadingEl.dismiss();
            this.lstTaskActivity = [];
            let response = JSON.parse(JSON.stringify(data));
            if (response.responseType == 1) {
              this.lstTaskActivity = response.Data;
            } else {
              $("#lblNoTasks").show();
            }
          }, error => {
            loadingEl.dismiss();
            this.objPortalModel.presentToast("No Internet Connection!");
          });
      });
  }

  closeActivityModal() {
    this.isActivityModalOpen = false;
  }

  fnOpenAddRemarks() {
    var remarks = prompt("Enter your remarks/comments",this.WorkerRemarks);
    if(remarks){
      this.loadingController
      .create({ keyboardClose: true, message: 'Please wait...' })
        .then(loadingEl => {
          loadingEl.present();
          let url = PortalModel.ApiUrl + "/Tasks/AddRemarks?userID=" + this.UserID + "&username=" + this.Username + "&TaskActivityID=" + this.ActiveActivityID+"&remarks="+remarks+"&from=Worker";
          this.http.get(url)
            .subscribe(data => {
              loadingEl.dismiss();
              let response = JSON.parse(JSON.stringify(data));
              if (response.responseType == 1) {
                this.objPortalModel.presentToast(response.Msg);
                this.WorkerRemarks = remarks;
              } else {
                this.objPortalModel.presentToast("Error: " + response.Msg);
              }
            }, error => {
            loadingEl.dismiss();
            this.objPortalModel.presentToast("No Internet Connection!");
          });
      });
    }
  }

 
  fnGetTaskActivityByID(taskActivtityID) {
    this.loadingController
      .create({ keyboardClose: true, message: 'Please wait...' })
      .then(loadingEl => {
        loadingEl.present();
        let url = PortalModel.ApiUrl + "/Tasks/GetTaskActivityByID?userID=" + this.UserID + "&username=" + this.Username + "&TaskActivityID=" + taskActivtityID;
        this.http.get(url)
          .subscribe(data => {
            loadingEl.dismiss();
            let response = JSON.parse(JSON.stringify(data));
            if (response.responseType == 1) {
              this.ActiveActivityID = taskActivtityID;
              var item = response.Data;
              this.CheckInDateTime = item.StrCheckInDateTime;
              this.CheckOutDateTime = item.StrCheckOutDateTime

              if (!this.CheckOutDateTime)
              this.btnStatus = "CheckOut";
          
              if (!this.CheckInDateTime)
                this.btnStatus = "CheckIn";

              if (this.CheckOutDateTime && this.CheckInDateTime)
                this.btnStatus = "Closed";

              this.ActivityLocation = item.ActivityLocation;
              this.StartsOn = item.StrStartDateTime;
              this.ActivityDetails = item.Details;
              this.ActivityTitle = item.Title;
              this.ManagerRemarks = item.ManagerRemarks;
              if (!this.ManagerRemarks)
                this.ManagerRemarks = "N/A";
              this.WorkerRemarks = item.WorkerRemarks;
              if (!this.WorkerRemarks)
                this.WorkerRemarks = "N/A";
              this.lstAttachements = item.Documents;
              if (this.lstAttachements.length == 0)
                this.NoAttachments = true;
              this.isActivityModalOpen = true;
            } else {
              this.objPortalModel.presentToast("Something went wrong!");
            }
          }, error => {
            loadingEl.dismiss();
            this.objPortalModel.presentToast("No Internet Connection!");
          });
      });
  }

  subscription: any;


  async fnActivtyInOut(type) {
    // this.geolocation.getCurrentPosition()
      await Geolocation.getCurrentPosition()
      .then((resp) => {
      let latitude = "" + resp.coords.latitude;
      let longitude = "" + resp.coords.longitude;


      let IsError = false;
      if (this.ActivityLocation) {
        var lat1 = this.ActivityLocation.split(',')[0];
        var long1 = this.ActivityLocation.split(',')[1];

        var lat2 = latitude;
        var long2 = longitude;

        var distanceInMeters = this.objPortalModel.fnCalculateDistance(lat1, lat2, long1, long2);
        if (distanceInMeters > 50) {
          IsError = true;
          var dd = parseFloat(distanceInMeters).toFixed(0);
          alert("You are " + dd + " meters away from attendance location! The distance should be less than 50 meters.");
        }
      }

      if (!IsError) {
        this.loadingController
          .create({ keyboardClose: true, message: 'Please wait...' })
          .then(loadingEl => {
            loadingEl.present();
            let url = PortalModel.ApiUrl + "/Tasks/ActivtyInOut?userID=" + this.UserID + "&username=" + this.Username + "&type=" + type + "&CheckInLocation=" + latitude + "," + longitude + "&CheckOutLocation=" + latitude + "," + longitude + "&TaskActivityID=" + this.ActiveActivityID;
            this.http.get(url)
              .subscribe(data => {
                loadingEl.dismiss();
                let response = JSON.parse(JSON.stringify(data));
                if (response.responseType == 1) {
                  this.fnGetTaskActivityByID(this.ActiveActivityID);
                  this.objPortalModel.presentToast(response.Msg);
                  // if (type == 'CheckIn') {
                  //   this.fnStartCatchLocation();
                  // } else {
                  //   this.fnStopCatchLocation();
                  // }
                } else {
                  alert(response.Msg)
                }

              }, error => {
                loadingEl.dismiss();
                this.objPortalModel.presentToast("No Internet Connection!");
              });
          });
      }

    }).catch((error) => {
      alert("There is a problem in accessing your location. Please make sure you have turned on your location, allowed app to access location and have active internet connection. " + error)
      console.log('Error getting location', error);
    });
  }

  fnSendFile() {
    $("#btnSubmitFile").html('<ion-spinner name="bubbles"></ion-spinner> Please wait...')
    $("#btnSubmitFile").attr("disabled", "disabled");
    const formData = new FormData();
    let url = PortalModel.ApiUrl + "/Tasks/SaveTempDocument?username=" + this.Username+"&UserID="+this.UserID;
    var file = $("#adImg")[0].files;
    if (file.length > 0) {
      formData.append("doc", file[0]);
      this.http.post(url, formData)
        .subscribe(response => {
          let data = JSON.parse(JSON.stringify(response));
          if (data.responseType == 1) {
            $("#btnSubmitFile").html('Upload');
            $("#btnSubmitFile").removeAttr("disabled");
            var docId = data.Result.split(':::')[1];
            var fileName = data.Result.split(':::')[2];
            var fullPath = data.Result.split(':::')[0];
            var obj = {
              docId, fileName, fullPath
            }
            this.lstAttachements.push(obj);
          } else {
            $("#btnSubmitFile").html('Upload');
            $("#btnSubmitFile").removeAttr("disabled");
            this.objPortalModel.presentToast(data.Msg);
          }
        }, error => {
          $("#btnSubmitFile").html('Upload');
          $("#btnSubmitFile").removeAttr("disabled");
          this.objPortalModel.presentToast("Server not responding... File cannot be uploaded!");
        });
    } else {
      $("#btnSubmitFile").html('Upload')
      $("#btnSubmitFile").removeAttr("disabled");
      this.objPortalModel.presentToast("Please choose a file");
    }
  }
  fnOpenDocument(url) {
    this.iab.create(PortalModel.ApiUrl + url)
  }
  fnRemoveDocument(docId){
    if(confirm("Are you sure to remove this attachement?")){
      let item = this.lstAttachements.find(x=>x.docId === docId);
      const index = this.lstAttachements.indexOf(item);
        if (index > -1) {
          this.lstAttachements.splice(index, 1); // 2nd parameter means remove one item only
        }
    }
  }


  doRefresh(event) {
    this.fnGetTaskActivity();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

}
