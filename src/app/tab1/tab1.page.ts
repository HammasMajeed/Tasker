import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { PortalModel } from '../Utilities/PortalModel';
import { Router, ActivatedRoute  } from '@angular/router';
import { Storage } from '@ionic/storage-angular'
import { LoadingController } from '@ionic/angular';
import * as moment from 'moment';
// import { File } from '@awesome-cordova-plugins/file/ngx';
import { Platform } from '@ionic/angular';
// import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import * as $ from "jquery";
import { Geolocation } from '@capacitor/geolocation';
import { App } from '@capacitor/app';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  imgSrc: string = "../../assets/images/logo.png";
  toolBarBgColor: string = "#0f2c6c";
  titleTextColor: string = "#fff";
  titleBarBgColor: string = "#0f2c6c";
  username: string;
  lstManagers = [];
  lstGuards = [];
  contentBgColor: string = "#0f2c6c";
  UserID: any;
  ViewShops:boolean=false; 
  ManageRiders:boolean=false;
  // fileName: string = "btmi.json";
  ViewSelfCheckInOut:boolean = false;
  ViewAllCheckInOut:boolean = false;
  lstBuildingProps: any;
  lblNoticeBoard="Loading...";
  lstNotices=[];
  objPortalModel: any; //private spinnerDialog: SpinnerDialog,
  AmountPaidReceived:string = "Received";
  
//


  constructor(
    private activatedRoute: ActivatedRoute,
    // public geolocation:Geolocation,
    public plt: Platform, private router: Router, public toastController: ToastController,
    public http: HttpClient, private storage: Storage, private loadingController: LoadingController) {
    this.objPortalModel = new PortalModel(this.toastController, this.loadingController, this.http);
    this.plt.ready().then((readySource) => {
      storage.create();
    });

    this.plt.backButton.subscribeWithPriority(10, () => {
      var currentPage = router.url;
      console.log('Current Page:', currentPage);
      if (currentPage == "/tabs/tab1")
        App.minimizeApp();
      else
        this.router.navigateByUrl("/tabs/tab1");
    });
  }
  doRefresh(event) {
    setTimeout(() => {
      this.fnGetNoticeBoard();
      event.target.complete();
    }, 2000);
  }
  fnMoveExpense(){
    this.router.navigateByUrl('expenses');
  }
  fnMoveToLeaves() {
    this.router.navigateByUrl('leaves');
  }

  fnCheckLocation() {

  }


  fnMoveToReports(){
    this.router.navigateByUrl('choose-report');
  }

  ionViewDidEnter() {
   
    this.plt.ready().then(async (readySource) => {
      var options = {
        enableHighAccuracy: true,
        maximumAge: 0, // should be default, just in case
        timeout: 20000
      }
      const coordinates = await Geolocation.getCurrentPosition(options);

      console.log('Current position:', coordinates);
      console.log(coordinates.coords.latitude+","+ coordinates.coords.longitude);


      // this.geolocation.getCurrentPosition().then((resp) => {
      //   console.log(resp.coords.latitude+","+ resp.coords.longitude);
      //   // resp.coords.latitude
      //   // resp.coords.longitude
      //  }).catch((error) => {
      //    console.log('Error getting location', error);
      //  });
    });

    this.storage.get('session').then((UserID) => {
      if (!UserID || UserID == 0) {
        this.router.navigateByUrl('home', {
          replaceUrl: true
        });
      } else {
        this.UserID = UserID;
        //this.fnStartCatchLocation();
        this.fnGetBusinessLogo();
        this.fnGetNoticeBoard();

        this.storage.get('Username').then((username) => {
          this.username = username;
        });
      }
    });

    this.storage.get('rights').then((lstUserRights) => {
      if (lstUserRights.includes("View All Shops") || lstUserRights.includes("View Self Shops")) {
        this.ViewShops = true;
      }
      if (lstUserRights.includes("Manage Riders")) {
        this.ManageRiders = true;
      }
      if (lstUserRights.includes("Create Order")) {
        this.AmountPaidReceived = "Paid";
      } else {
        this.AmountPaidReceived = "Received";
      }
      if (lstUserRights.includes("View All Check In Out")) {
        this.ViewAllCheckInOut = true;
      }
      if (lstUserRights.includes("View Self Check In Out")) {
        this.ViewSelfCheckInOut = true;
      }
    });
  }

  watch:any;
  subscription: any;
 
  // fnStartCatchLocation() {
  //   // this.watch = this.geolocation.watchPosition();
  //   // this.subscription = this.watch.subscribe((data) => {
  //   //   // data can be a set of coordinates, or an error (if an error occurred).
  //   //   // data.coords.latitude
  //   //   // data.coords.longitude
  //   //   var latitude = data.coords.latitude;
  //   //   var longitude = data.coords.longitude;

  //   //   let url = PortalModel.ApiUrl + "/Worker/UpdateCurrentLocation?UserID=" + this.UserID + "&Latitude=" + latitude + "&longitude=" + longitude;
  //   //   this.http.get(url)
  //   //     .subscribe(data => {
  //   //       let response = JSON.parse(JSON.stringify(data));
  //   //       if (response.responseType == 1) {

  //   //       } 
  //   //     }, error => {
  //   //       this.objPortalModel.presentToast("No Internet Connection!");
  //   //     });
  //   // });

  //   const config: BackgroundGeolocationConfig = {
  //     desiredAccuracy: 10,
  //     stationaryRadius: 20,
  //     distanceFilter: 30,
  //     debug: true, //  enable this hear sounds for background-geolocation life-cycle.
  //     stopOnTerminate: false, // enable this to clear background location settings when the app terminates
  //   };

  //   this.backgroundGeolocation.configure(config)
  //     .then(() => {

  //       this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {
  //         console.log(location);
            
  //         // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
  //         // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
  //         // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
  //         this.backgroundGeolocation.finish(); // FOR IOS ONLY
  //       });

  //     });

  //   // start recording location
  //   this.backgroundGeolocation.start();
  // }

  fnStopCatchLocation(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }


  fnMoveToPatrol() {
    this.router.navigateByUrl('dashboard-patrol')
  }
  fnGetBusinessLogo() {
    $("#divLoaderNotice").html('<ion-spinner name="dots"></ion-spinner>');
    $("#divLoaderNotice").show();
    let url = PortalModel.ApiUrl + "/Business/GetBusinessProps?userID=" + this.UserID;
    this.http.get(url)
      .subscribe(data => {
        let response = JSON.parse(JSON.stringify(data));
        if (response.responseType == 1) {
          this.imgSrc = response.Data.Logo;
        }
      }, error => {
        $("#divLoaderNotice").hide();
        this.lstNotices=[];
        console.log(error);
        this.objPortalModel.presentToast("No Internet Connection!");
      });
  }
  
  fnGetNoticeBoard() {
     $("#divLoaderNotice").html('<ion-spinner name="dots"></ion-spinner>');
    $("#divLoaderNotice").show();
    let url = PortalModel.ApiUrl + "/NoticeBoard/GetNoticeBoard?userID=" + this.UserID;
    this.http.get(url)
      .subscribe(data => {
        let response = JSON.parse(JSON.stringify(data));
        if (response.responseType == 1) {
          $("#divLoaderNotice").hide();
          this.lstNotices=response.Data;
          this.lstNotices.reverse();
        }else{
          $("#divLoaderNotice").html("No new notices");
          this.lstNotices=[];
        }
      }, error => {
        $("#divLoaderNotice").hide();
        this.lstNotices=[];
        console.log(error);
        this.objPortalModel.presentToast("No Internet Connection!");
      });
  }
  fnMoveToAttendance() {
    this.router.navigateByUrl('check-in-out')
  }
  fnMoveToTasks() {
    this.router.navigateByUrl('tasks')
  }
  

}
