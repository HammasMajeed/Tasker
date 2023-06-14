import { Component, OnInit, NgZone } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { PortalModel } from '../Utilities/PortalModel';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular'
import { LoadingController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { BarcodeScanner,SupportedFormat  } from '@capacitor-community/barcode-scanner';
// import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import * as $ from "jquery";
import { SpinnerDialog } from '@awesome-cordova-plugins/spinner-dialog/ngx';
// import { File } from '@awesome-cordova-plugins/file/ngx';
import { FTP } from '@awesome-cordova-plugins/ftp/ngx';
// import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { Camera, CameraOptions, CameraResultType, CameraSource } from '@capacitor/camera';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@awesome-cordova-plugins/media-capture/ngx';
import { Geolocation } from '@capacitor/geolocation';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
//import { Subscription } from 'rxjs';
import * as moment from 'moment';
@Component({
  selector: 'app-patrol',
  templateUrl: './patrol.page.html',
  styleUrls: ['./patrol.page.scss'],
})
export class PatrolPage implements OnInit {
  imgSrc: string = "../../assets/images/logo.png";
  buildingInfo: string = "Building Tech Management"
  toolBarBgColor: string = "#0f2c6c";
  titleTextColor: string = "#fff";
  titleBarBgColor: string = "#0f2c6c";
  username: string;
  contentBgColor: string = "#0f2c6c";
  currentQRCodeID: string;
  currentQRLocation:string;
  i: number = 0;
  currentDisplayOrder: number;
  lastDisplayOrder: number;
  patrolLocationID: number;
  locationName: string = "N/A";
  description: string = "N/A";
  patrolLocations: any;
  patrolID: number;
  patrolType: string = "Full Patrol";
  lstUsers: any;
  txtRemarks: string;
  lstBuildingProps: any;
  lblUploading: string = 'Uploading Video';
  objPortalModel: any;
  fileToUpload: string;
  picsToSend = [];
  scannedSpots = [];
  IsPrevious: boolean = false;
  lblUploadingText: string = "";
  IsNext: boolean = false;
  displayMedia = [];
  progressPercentage: number = 0;
  fileName: string = "patrollingApp.txt";
  lblMediaNo: string = "0/0";
  IsUploadingFile: boolean = false;
  locallySavedPatrols = [];
  UserID:any;
  IsOpenOfflineOnlineQuestion: boolean = true;
  img: string = "data:image/jpeg;base64,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";
  private win: any = window;

  skippedLocationID=[];

  //private preventBack: Subscription,
  constructor(
    // private geolocation:Geolocation, 
    private ngZone: NgZone, private mediaCapture: MediaCapture, private fTP: FTP,  private spinnerDialog: SpinnerDialog, 
    // private barcodeScanner: BarcodeScanner, 
    public plt: Platform, private router: Router, public toastController: ToastController,
    public http: HttpClient, private storage: Storage, private loadingController: LoadingController) {
    this.objPortalModel = new PortalModel(this.toastController, this.loadingController,this.http);
    this.plt.ready().then((readySource) => {
      storage.create();
    });
  }

  ngOnInit() {
    // this.fnConnectToFtp();
   

    // console.log("Current Location: " + this.i);
    // console.log("Scanned Locations: " + JSON.stringify(this.scannedSpots));
    //this.fnGetUnfinishedPatrols();
    // this.plt.ready().then((readySource) => {
    //   this.storage.get('buildingProps').then((props) => {
    //     this.buildingInfo = props.BuildingName + " (" + props.BuildingNo + ")";
    //     this.imgSrc = props.Logo;
    //     $("#imgLogo").css("height", props.logoHeight);
    //     $("#imgLogo").css("width", props.logoWidth);
    //     this.titleBarBgColor = props.SideBarColor;
    //     this.contentBgColor = props.SideBarColor;
    //     this.toolBarBgColor = props.SideBarColor;
    //     this.titleTextColor = props.SideBarFontColor;
    //   });
    // });
  }
  // fnGetUnfinishedPatrols() {
  //   this.file.readAsText(this.file.dataDirectory, this.fileName).then(res => {
  //     
  //     var obj = JSON.parse(res);
  //     this.locallySavedPatrols.push(obj);
  //   }, error => {
  //     //this.objPortalModel.presentToastWithDuration("Could'nt get the data.", 2000)
  //     console.log("Error Reading  " + error)
  //   });
  // }
  fnRemoveImageFromArray(item) {
    if (confirm("Are you sure you want to delete this?")) {
      // const index = this.displayMedia.indexOf(item);
      // if (index > -1) {
      //   this.displayMedia.splice(index, 1); // 2nd parameter means remove one item only
      // }
      //

      // const index1 = this.picsToSend.indexOf(item);
      // if (index1 > -1) {
      //   this.picsToSend.splice(index1, 1); // 2nd parameter means remove one item only
      // }

      var obj = this.displayMedia.find(x => x.Id == item);
      if (obj) {
        this.displayMedia = this.fnArrayRemove(this.displayMedia, obj);
        $("#img-" + item).remove();
      }

      var objPics = this.picsToSend.find(x => x.Id == item);
      if (objPics) {
        this.picsToSend = this.fnArrayRemove(this.picsToSend, objPics);
      }
    }
  }
  // fnConnectToFtp() {
  //   this.fTP.connect('107.180.38.220', 'ph15096739631', '_0b3nk5M')
  //     .then((res: any) => {
  //       console.log('Login successful', res);
  //     })
  //     .catch((error: any) => console.error("FTP Error : "+error));
  // }

  ionViewDidEnter() {
    this.plt.ready().then((readySource) => {
      this.plt.backButton.subscribeWithPriority(140, () => {
        if($('#hideThisPart').css("display").toLowerCase() == "none"){
          console.log("Stopping.");
          BarcodeScanner.showBackground();
          BarcodeScanner.stopScan();
          $('#hideThisPart').css('display', 'block');
          $('#hideHeader').css('display', 'block');
        }
      });


      this.storage.get('session').then((UserID) => {
        this.UserID = UserID;
        this.storage.get('PatrolType').then((patrolType) => {
          if (patrolType.includes("Quick")) {
            let quickPatrolID = patrolType.split('-')[1];
            this.fnGetLocationData(quickPatrolID);
            let titleOfPatrol = patrolType.split(' ')[0];
            this.patrolType = "Quick Patrol " + titleOfPatrol;
          } else {
            this.fnGetLocationData(0);
            this.patrolType = "Full Patrol";
          }
          this.fnStartPatrol();
        });
      });
    });
  }

  fnAddVideo() {
    this.progressPercentage = 0;
    let options: CaptureVideoOptions = {
      limit: 1,
      duration: 15
    }
    this.mediaCapture.captureVideo(options).then((res: MediaFile[]) => {
      let capturedFile = res[0];
      var IdForDiv = Math.floor(Math.random() * 10000000000);
      let f = this.win.Ionic.WebView.convertFileSrc(capturedFile.fullPath);
      // let remoteFile = '/www.buildingtechmanagement.com/Content/Attachements/PatrolDocs/' + IdForDiv + ".mp4";
      var obj = {
        "Id": IdForDiv,
        "src": f,
        "Type": 1,
        "orignalSrc": capturedFile.fullPath
      }

      // this.loadingController
      //   .create({ keyboardClose: true, message: 'Please wait...' })
      //   .then(loadingEl => {
      //     loadingEl.present();
      //     this.IsUploadingFile = true;
      //     this.fTP.upload(capturedFile.fullPath, remoteFile).subscribe((result) => {
      //       this.ngZone.run(() => {
      //         let  _result = result;
      //         this.lblUploadingText = "Processing Video (" + (_result * 100).toFixed(0) + " %)";
      //         this.progressPercentage = result;
      //         if (result >= 1) {
      //           loadingEl.dismiss();
      //           this.IsUploadingFile = false;
      //           this.picsToSend.push(IdForDiv);
      //           this.displayMedia.push(obj);
      //         }
      //       });
      //     }, (error) => {
      //     loadingEl.dismiss();
      //     this.picsToSend.push(IdForDiv);
      //     this.displayMedia.push(obj);
      //     this.IsUploadingFile = false;
      //   });

      // });

      this.picsToSend.push(IdForDiv);
      this.displayMedia.push(obj);
    },
      (err: CaptureError) => console.error(err));
  }

  async fnAddPhotoToGallery() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source:CameraSource.Camera,
    });
    console.log(image.path+"::"+this.win.Ionic.WebView.convertFileSrc(image.path));
    let webImage = this.win.Ionic.WebView.convertFileSrc(image.path);
    let fileImage = image.path;
    // console.log("File Image: "+fileImage);
    console.log("Data URL: "+image.path);
      var Id = Math.floor(Math.random() * 1000000000000);
      let f = this.win.Ionic.WebView.convertFileSrc(webImage);
      console.log(f);
      var obj = {
        "Id": Id,
        "src": f,
        "Type": 2,
        "orignalSrc": fileImage
      }
      this.displayMedia.push(obj);
      this.picsToSend.push(Id);
  }

  fnGetLocationData(quickPatrolID) {
    this.spinnerDialog.show();
    let url = PortalModel.ApiUrl + "/GuardsPatrol/GetPatrolLocationsDetailForApp?quickPatrolID=" + quickPatrolID + "&UserID=" + this.UserID;
    this.http.get(url)
      .subscribe(data => {
        let response = JSON.parse(JSON.stringify(data));
        this.spinnerDialog.hide();
        if (response.responseType == 1) {
          console.log("Getting Patrol Locations: "+JSON.stringify(response.Data));
          this.patrolLocations = response.Data;
          this.fnUpdateLocationToQR(this.i)
        } else {
          this.router.navigateByUrl("dashboard")
          this.objPortalModel.presentToast("There are no active locations to patrol!");
        }
      }, error => {
        this.spinnerDialog.hide();
        this.router.navigateByUrl("dashboard")
        this.objPortalModel.presentToast("No Internet Connection!");
      });
  }
fnSkipLocation(){
  if(confirm("Are you sure you want to skip this location?")){
    if(!this.skippedLocationID.includes(this.patrolLocationID)){
      this.skippedLocationID.push(this.patrolLocationID);
    }
    this.fnUploadPatrolProgress(this.patrolLocationID, this.i, "New");
    if (this.i >= this.patrolLocations.length - 1) {
    } else {
      this.i++;
    }
  }
}
  fnUploadPatrolProgress(locationID, i, comingFrom) {
    //this.spinnerDialog.show();
    let IsLast = 0;
    if (i >= this.patrolLocations.length - 1) {
      IsLast = 1;
    }
    let remarks = this.txtRemarks;
    if (!remarks) {
      remarks = "";
    }
    let _displayMedia = this.displayMedia;
    let _picsToSend = this.picsToSend;
    // let url = PortalModel.ApiUrl + "/GuardsPatrol/InsertPatrolProgress?patrolID=" + this.patrolID + "&buildingID=" + this.lstUsers[4] + "&locationID=" + locationID + "&userID=" + this.lstUsers[0] + "&IsLast=" + IsLast + "&patrolDocs=" + _picsToSend + "&Remarks=" +remarks;
    // this.http.get(url)
    //   .subscribe(data => {
    //     this.spinnerDialog.hide();
    //     let response = JSON.parse(JSON.stringify(data));
    //     let responseType = response.responseType;
    //     if (responseType == 1) {
    //       
    //       this.IsPrevious = true;
    //       this.IsNext = true;

    //       var obj = {
    //         "locationNo": i,
    //         "PatrolledID": response.Result
    //       }

    //       //If in case any local saved data. Uploads to server. Remove the data from local. To avoid duplication

    //       var objCheck = this.locallySavedPatrols.find(x => x.locationID == locationID && x.patrolID == this.patrolID);

    //       if (objCheck) {

    //         for (var o = 0; o < objCheck.patrolDocs.length; o++) {
    //           let _item = objCheck.patrolDocs[o];
    //           // First upload the media to server
    //           let remoteFile = '/www.buildingtechmanagement.com/Content/Attachements/PatrolDocs/' + _item.Id + ".jpg";
    //           this.fTP.upload(_item.src, remoteFile).subscribe((result) => {
    //           }, (error) => {
    //             console.log("FTP Reuploading Error: "+error);
    //           });
    //         }

    //         //Remove  object from local because it uploaded to server.
    //         console.log("Found that this object already was in local like this : " + JSON.stringify(objCheck));
    //         this.locallySavedPatrols = this.fnArrayRemove(this.locallySavedPatrols, objCheck);
    //         console.log("Look we remove this from locallySavedPatrols : " + JSON.stringify(this.locallySavedPatrols));
    //         var objScannedSpotsLocal = this.scannedSpots.find(x => x.PatrolledID == objCheck.PatrolledID);
    //         console.log("objScannedSpotsLocal: " + JSON.stringify(objScannedSpotsLocal));
    //         if (objScannedSpotsLocal) {
    //           console.log("We also found in scanned objects and remove : " + JSON.stringify(objScannedSpotsLocal));
    //           this.scannedSpots = this.fnArrayRemove(this.scannedSpots, objScannedSpotsLocal);
    //         }
    //       }

    //       var objScannedSpots = this.scannedSpots.find(x => x.PatrolledID == response.Result);
    //       if (!objScannedSpots){
    //         this.scannedSpots.push(obj);
    //       }

    //       console.log("Scanned Objects : "+JSON.stringify(this.scannedSpots));


    //       this.objPortalModel.presentToast(response.Msg);
    //       this.displayMedia = [];
    //       this.picsToSend = [];
    //       this.txtRemarks = "";
    //       if (IsLast == 1) {
    //         this.router.navigateByUrl("patrol-completed");
    //       } else {
    //         this.fnUpdateLocationToQR(i + 1);
    //       }

    //     } else {
    //       console.log(response);
    //       this.objPortalModel.presentToast("Some error occured. Progress cannot be updated at this moment!");
    //     }
    //   }, error => {
    //     this.spinnerDialog.hide();

    //     this.fnSaveDataToFile(locationID, IsLast, _displayMedia, remarks, i)
    //     this.objPortalModel.presentToast("No Internet Connection!");
    //   });

    this.fnSaveDataToFile(locationID, IsLast, _displayMedia, remarks, i, comingFrom);
  }
  fnArrayRemove(arr, value) {

    return arr.filter(function (ele) {
      return ele != value;
    });
  }
  fnSaveDataToFile(locationID, IsLast, displayMedia, remarks, i, comingFrom) {
    //For Local . Insert temp-RandomNos for patrolled ID
    var patrolledIDRandom = Math.floor(Math.random() * 10000000000);
   
    for(var s = 0;s<this.skippedLocationID.length;s++){
      if(locationID == this.skippedLocationID[i]){
        if(!remarks.includes("Skipped. ")){
          remarks = "Skipped. "+remarks;
        }
      }
    }
    var obj = {
      "patrolID": this.patrolID,
      "buildingID": "1",
      "locationID": locationID,
      "userID": this.UserID,
      "IsLast": IsLast,
      "patrolDocs": displayMedia,
      "Remarks": remarks,
      "PatrolledID": patrolledIDRandom,
      "PatrolLocations": this.patrolLocations,
      "DateTime": moment(new Date()).format("MM/DD/YYYY hh:mm A"),
      "patrolType": this.patrolType
    }
    
    var objCheck = this.locallySavedPatrols.find(x => x.locationID == locationID && x.patrolID == this.patrolID);
    if (objCheck) {
      obj.PatrolledID = objCheck.PatrolledID;
      obj.locationID = objCheck.locationID;
    }

    if (objCheck) {
      //Remove the old object
      this.locallySavedPatrols = this.fnArrayRemove(this.locallySavedPatrols, objCheck);
    }
    this.locallySavedPatrols.push(obj);
    var data_ = JSON.stringify(this.locallySavedPatrols);
    this.fnWriteSecretFile(data_, i, obj, patrolledIDRandom, IsLast, comingFrom);
  }

  fnWriteSecretFile(data_, i, obj, patrolledIDRandom, IsLast, comingFrom) {
    console.log("Writing...")
    const a = Filesystem.writeFile({
      path: this.fileName,
      data: data_,
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    }).then(result => {
      console.log(JSON.stringify(result));
      // alert(JSON.stringify(result));
      // if(JSON.stringify(result).includes("problem")){
       
      // }
      this.IsPrevious = true;
      this.IsNext = true;
      var obj1 = {
        "locationNo": i,
        "PatrolledID": obj.PatrolledID
      }
      var objScannedSpots = this.scannedSpots.find(x => x.PatrolledID == patrolledIDRandom);
      if (!objScannedSpots) {
        this.scannedSpots.push(obj1);
      }

      console.log("Scanned Objects " + JSON.stringify(this.scannedSpots))
      this.objPortalModel.presentToastWithDuration("Successfully saved progress!", 500);
      var FinishCancel = false;
      if (IsLast == 1) {
        //this.router.navigateByUrl("patrol-completed");
        if (confirm("Are you sure to finish this patrol?")) {
          let url = PortalModel.ApiUrl + "/GuardsPatrol/CheckInternetConnection";
          console.log("Checking Internet: " + url)
          this.http.get(url)
            .subscribe(data => {
              this.fnFinishPatrol();
            }, error => {
              this.objPortalModel.presentToast("No Internet Connection.!");
            });
        } else {
          FinishCancel = true;
        }
      } else {
        this.fnUpdateLocationToQR(i + 1);
      }
      if (comingFrom != "Next" && FinishCancel == false && IsLast != 1) {
        this.displayMedia = [];
        this.picsToSend = [];
        this.txtRemarks = "";
      }
    }, error => {
      alert("There is problem while access your phone storage " + JSON.stringify(error))
      console.log('Error getting location', JSON.stringify(error));
    });
  }


  async fnReadFile(PatrolledID, comingFrom) {
    // Commented 15 Dec 2022
    const contents = await Filesystem.readFile({
      path: this.fileName,
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });

    console.log('Read file data:', contents.data);
    var obj = JSON.parse(contents.data);
    var details = obj.find(x => x.PatrolledID == PatrolledID);
    if (details) {
      //console.log("Locally Saved Data: " + JSON.stringify(obj));
      this.txtRemarks = "";
      this.displayMedia = [];
      this.picsToSend = [];

      this.txtRemarks = details.Remarks;

      for (var i = 0; i < details.patrolDocs.length; i++) {
        var item = details.patrolDocs[i];

        obj = {
          "Id": item.Id,
          "src": item.src,
          "Type": item.Type,
          "orignalSrc": item.orignalSrc
        }
        this.displayMedia.push(obj);
        this.picsToSend.push(item.Id);
      }
      //Coming from Previous ... Please go back after successfully reading. 
      // So if data could not be read successfully, do not go back.
      if (comingFrom == "Previous") {
        this.i--;
        this.patrolLocationID = this.patrolLocations[this.i].PatrolLocationID;
        this.currentQRCodeID = this.patrolLocations[this.i].EncryptedID;
        this.currentQRLocation = this.patrolLocations[this.i].Coordinates;
        this.description = this.patrolLocations[this.i].Description;
        this.locationName = this.patrolLocations[this.i].LocationName;
      }
    } else {
      this.objPortalModel.presentToastWithDuration(this.patrolLocations[this.i - 1].LocationName + " data not found!.", 3000)
    }


    // this.file.readAsText(this.file.dataDirectory, this.fileName).then(res => {
    //   var obj = JSON.parse(res);
    //   
    //   var details = obj.find(x => x.PatrolledID == PatrolledID);
    //   if (details) {
    //     //console.log("Locally Saved Data: " + JSON.stringify(obj));
    //     this.txtRemarks = "";
    //     this.displayMedia = [];
    //     this.picsToSend = [];

    //     this.txtRemarks = details.Remarks;

    //     for (var i = 0; i < details.patrolDocs.length; i++) {
    //       var item = details.patrolDocs[i];

    //       obj = {
    //         "Id": item.Id,
    //         "src": item.src,
    //         "Type": item.Type,
    //         "orignalSrc": item.orignalSrc
    //       }
    //       this.displayMedia.push(obj);
    //       this.picsToSend.push(item.Id);
    //     }
    //     //Coming from Previous ... Please go back after successfully reading. 
    //     // So if data could not be read successfully, do not go back.
    //     if (comingFrom == "Previous") {
    //       this.i--;
    //       this.patrolLocationID = this.patrolLocations[this.i].PatrolLocationID;
    //       this.currentQRCodeID = this.patrolLocations[this.i].EncryptedID;
    //       this.currentQRLocation = this.patrolLocations[this.i].Coordinates;
    //       this.description = this.patrolLocations[this.i].Description;
    //       this.locationName = this.patrolLocations[this.i].LocationName;
    //     }
    //   } else {
    //     this.objPortalModel.presentToastWithDuration(this.patrolLocations[this.i - 1].LocationName + " data not found!.", 3000)
    //   }

    // }, error => {
    //   this.objPortalModel.presentToastWithDuration("Could'nt get the data.", 2000)
    //   console.log("Error Reading  " + error)
    // });
  }
  fnPreviousScreen() {
    let tempI = this.i - 1;
    console.log("Finding Previous Location: " + tempI);
    var objScannedSpots = this.scannedSpots.find(x => x.locationNo == tempI);
    if (objScannedSpots) {
      // If previous spot was found. We can get the data by using Patrolled ID
      // this.loadingController
      //   .create({ keyboardClose: true, message: 'Please wait...' })
      //   .then(loadingEl => {
      //     loadingEl.present();
      //     let url = PortalModel.ApiUrl + "/GuardsPatrol/GetMediaAndRemarksByPatrolledID?buildingID=" + this.lstUsers[4] + "&patrolledID=" + objScannedSpots.PatrolledID;
      //     this.http.get(url)
      //       .subscribe(data => {
      //         loadingEl.dismiss();
      //         let response = JSON.parse(JSON.stringify(data));
      //         if (response.responseType == 1) {
      //           this.i--;
      //           this.patrolLocationID = this.patrolLocations[this.i].PatrolLocationID;
      //           this.currentQRCodeID = this.patrolLocations[this.i].EncryptedID;
      //           this.description = this.patrolLocations[this.i].Description;
      //           this.locationName = this.patrolLocations[this.i].LocationName;
      //           var obj = {};
      //           this.txtRemarks = response.Data.Remarks;
      //           this.displayMedia = [];
      //           this.picsToSend = [];
      //           for (var i = 0; i < response.Data.Media.length; i++) {
      //             var item = response.Data.Media[i];
      //             var Id = item.DocPath.split('PatrolDocs/')[1].split('.')[0];
      //             var f = PortalModel.ApiUrl + item.DocPath;
      //             if (item.DocPath.split('PatrolDocs/')[1].split('.')[1] == "mp4") {
      //               obj = {
      //                 "Id": Id,
      //                 "src": f,
      //                 "Type": 1
      //               }
      //             } else {
      //               obj = {
      //                 "Id": Id,
      //                 "src": f,
      //                 "Type": 2
      //               }
      //             }

      //             this.displayMedia.push(obj);
      //             this.picsToSend.push(Id);
      //           }
      //         } else {
      //           // may be on local server
      //           //this.objPortalModel.presentToast(response.Msg);
      //           this.fnReadFile(objScannedSpots.PatrolledID, "Previous");
      //         }
      //       }, error => {
      //         loadingEl.dismiss();
      //         console.log("Cannot get the previous data");
      //         this.fnReadFile(objScannedSpots.PatrolledID, "Previous");
      //         //this.objPortalModel.presentToast("No Internet Connection!");
      //       });
      //   });
      this.fnReadFile(objScannedSpots.PatrolledID, "Previous");
    } else {
      this.objPortalModel.presentToast("No previous data found!");
    }
  }
  fnNextScreen() {
    var DidYouScanCurrent = this.scannedSpots.find(x => x.locationNo == this.i);
    if (DidYouScanCurrent) {
      this.fnUploadPatrolProgress(this.patrolLocations[this.i].PatrolLocationID, this.i, "Next");

      var IsItLast = false;
      if (this.i >= this.patrolLocations.length - 1) {
        IsItLast = true;
      }

      if (!IsItLast) {
        this.txtRemarks = "";
        this.displayMedia = [];
        this.picsToSend = [];
        this.i++;
        this.patrolLocationID = this.patrolLocations[this.i].PatrolLocationID;
        this.currentQRCodeID = this.patrolLocations[this.i].EncryptedID;
        this.currentQRLocation = this.patrolLocations[this.i].Coordinates;
        this.description = this.patrolLocations[this.i].Description;
        this.locationName = this.patrolLocations[this.i].LocationName;

        // if i = patrolLocations.length 
        // Open the finish button modal.

        var objScannedSpots = this.scannedSpots.find(x => x.locationNo == this.i);
        if (objScannedSpots) {

          //If location is found in scanned spots, that means we already scanned it and we can go forward

          //Here we have the patrolled ID because the spot has been scanned
          //and we can update the media etc.

          this.txtRemarks = "";
          this.displayMedia = [];
          this.picsToSend = [];
          // So If we already scanned it. we must retreive the data.

          // this.loadingController
          //   .create({ keyboardClose: true, message: 'Please wait...' })
          //   .then(loadingEl => {
          //     loadingEl.present();
          //     let url = PortalModel.ApiUrl + "/GuardsPatrol/GetMediaAndRemarksByPatrolledID?buildingID=" + this.lstUsers[4] + "&patrolledID=" + objScannedSpots.PatrolledID;
          //     this.http.get(url)
          //       .subscribe(data => {
          //         loadingEl.dismiss();
          //         let response = JSON.parse(JSON.stringify(data));
          //         if (response.responseType == 1) {
          //           var obj = {};
          //           this.txtRemarks = response.Data.Remarks;

          //           this.displayMedia = [];
          //           this.picsToSend = [];
          //           for (var i = 0; i < response.Data.Media.length; i++) {
          //             var item = response.Data.Media[i];
          //             var Id = item.DocPath.split('PatrolDocs/')[1].split('.')[0];
          //             var f = PortalModel.ApiUrl + item.DocPath;
          //             if (item.DocPath.split('PatrolDocs/')[1].split('.')[1] == "mp4") {
          //               obj = {
          //                 "Id": Id,
          //                 "src": f,
          //                 "Type": 1
          //               }
          //             } else {
          //               obj = {
          //                 "Id": Id,
          //                 "src": f,
          //                 "Type": 2
          //               }
          //             }
          //             this.displayMedia.push(obj);
          //             this.picsToSend.push(Id);
          //           }
          //         } else {
          //           this.fnReadFile(objScannedSpots.PatrolledID,"Next");
          //           this.objPortalModel.presentToast(response.Msg);
          //         }
          //       }, error => {
          //         loadingEl.dismiss();
          //         this.fnReadFile(objScannedSpots.PatrolledID,"Next");
          //         // this.objPortalModel.presentToast("No Internet Connection!");
          //       });
          //   });
          this.fnReadFile(objScannedSpots.PatrolledID, "Next");
        }
      } else {
        // if (confirm("Are you sure to finish this patrol?")) {
        //   let url = PortalModel.ApiUrl+"/GuardsPatrol/CheckInternetConnection";
        //   this.http.get(url)
        //     .subscribe(data => {
        //       this.fnFinishPatrol();
        //     }, error => {
        //       this.objPortalModel.presentToast("No Internet Connection.!");
        //     });
        // }else{
        // }
      }
    } else {
      // Current location is not scanned yet. We should scan it to move forward.
      this.objPortalModel.presentToast("Please scan the current spot!");
    }
  }
  fnUpdateLocationToQR(i) {
    console.log(JSON.stringify(this.patrolLocations[i]));
    this.patrolLocationID = this.patrolLocations[i].PatrolLocationID;
    this.currentQRCodeID = this.patrolLocations[i].EncryptedID;
    this.currentQRLocation = this.patrolLocations[this.i].Coordinates;
    this.description = this.patrolLocations[i].Description;
    this.locationName = this.patrolLocations[i].LocationName;
  }
  async fnFinishPatrol() {
    let runningMedia = 1;
    let totalMedia = 0;
    // Commented 15 Dec 2022

    const contents = await Filesystem.readFile({
      path: this.fileName,
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });

    console.log('Read file data:', contents.data);

    var response = JSON.parse(contents.data);

    var obj = response.filter(x => x.patrolID == this.patrolID);
    this.IsUploadingFile = true;
    this.loadingController
      .create({ keyboardClose: true, message: 'Connecting to server...' })
      .then(loadingElServer => {
        loadingElServer.present();
        this.fTP.connect('208.91.199.17', 'PatrolDocs', '!patroldocs1995')
          .then((res: any) => {
            console.log('Login successful', res);
            loadingElServer.dismiss();
            //totalMedia
            for (var i = 0; i < obj.length; i++) {
              let displayMedia = obj[i].patrolDocs;
              for (var j = 0; j < displayMedia.length; j++) {
                totalMedia++;
              }
            }
            for (var i = 0; i < obj.length; i++) {
              let locationID = obj[i].locationID;
              let IsLast = obj[i].IsLast;
              let remarks = obj[i].Remarks;
              let displayMedia = obj[i].patrolDocs;
              let _picsToSend = [];
              let DateTime = obj[i].DateTime;
              for (var p = 0; p < displayMedia.length; p++) {
                _picsToSend.push(displayMedia[p].Id);
              }

              var locationName = this.patrolLocations.find(x => x.PatrolLocationID == locationID).LocationName;
              this.loadingController
                .create({ keyboardClose: true, message: 'Uploading Data... ' + locationName })
                .then(loadingEl => {
                  loadingEl.present();
                  let url = PortalModel.ApiUrl + "/GuardsPatrol/InsertPatrolProgress?patrolID=" + this.patrolID + "&locationID=" + locationID + "&userID=" + this.UserID + "&IsLast=" + IsLast + "&patrolDocs=" + _picsToSend + "&Remarks=" + remarks + "&DateTime=" + DateTime;
                  this.http.get(url)
                    .subscribe(data => {
                      loadingEl.dismiss();
                      let response = JSON.parse(JSON.stringify(data));
                      let responseType = response.responseType;
                      //  console.log(i + " == " + (obj.length-1));

                      // if (i >= obj.length - 1) {
                      if (totalMedia == 0) {
                        console.log("Patrol Completed");
                        this.router.navigateByUrl('patrol-completed');
                      }
                      //}
                    }, error => {
                      loadingEl.dismiss();
                      this.objPortalModel.presentToast("No Internet Connection!");
                    });
                });

              for (var j = 0; j < displayMedia.length; j++) {
                console.log("at obj: " + i + " display Media total: " + displayMedia.length + " and currently at: " + j)

                let ext = "mp4";
                if (displayMedia[j].Type == 2) {
                  ext = "jpg";
                }
                if (displayMedia[j] && displayMedia[j].orignalSrc) {

                  let _orignalSrc = displayMedia[j].orignalSrc;
                  let remoteFile =  "/"+displayMedia[j].Id + "." + ext;

                  this.fTP.upload(_orignalSrc, remoteFile).subscribe((result) => {
                    this.lblMediaNo = runningMedia + "/" + totalMedia;
                    this.ngZone.run(() => {
                      // console.log(result);
                      this.lblUploadingText = (result * 100).toFixed(0) + "%";
                      if (result >= 1) {

                        console.log("totalMedia=" + totalMedia + "   and Runnung Media=" + runningMedia);
                        if (totalMedia == runningMedia) {
                          this.router.navigateByUrl('patrol-completed');
                          console.log("Patrol Completed!");
                        }
                        console.log("Successfully Uploaded!");
                        runningMedia++;
                      }
                    });
                  }, (error) => {
                    alert("Media cannot be uploaded!")
                    console.log("Error Uploading File Again: " + error);
                  });
                } else {
                  console.log("displayMedia[j] && displayMedia[j].orignalSrc error");
                }
              }
            }
          })
          .catch((error: any) => { this.IsUploadingFile = false; console.error("FTP Error : " + error); alert("Could'nt connect to server!"); loadingElServer.dismiss(); });

      });
  }
  fnDelay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  fnStartPatrol() {
    this.spinnerDialog.show();
    let url = PortalModel.ApiUrl + "/GuardsPatrol/StartPatrol?patrolType=" + this.patrolType + "&userID=" + this.UserID;
    this.http.get(url)
      .subscribe(data => {
        this.spinnerDialog.hide();
        let response = JSON.parse(JSON.stringify(data));
        let responseType = response.responseType;
        if (responseType == 1) {
          this.patrolID = response.Result;
          //  this.fnUploadPatrolProgress(this.patrolLocationID, this.i);
          //  this.i++;
        } else {
          this.objPortalModel.presentToast("Some error occured. Your patrol progress did not start");
        }
      }, error => {
        this.spinnerDialog.hide();
        this.objPortalModel.presentToast("No Internet Connection!");
      });
  }

  async checkPermission() {
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        resolve(true);
      } else if (status.denied) {
        BarcodeScanner.openAppSettings();
        resolve(false);
      }
    });
  }

  async scan() {
    var objScannedSpots = this.scannedSpots.find(x => x.locationNo == this.i);
    if (!objScannedSpots) {
      const allowed = await this.checkPermission();
      if (allowed) {
        BarcodeScanner.hideBackground(); // make background of WebView transparent
       // document.querySelector('body').classList.add('scanner-active');

        $('#hideThisPart').css('display', 'none');
        $('#hideHeader').css('display', 'none');

        const result__ = await BarcodeScanner.startScan({ targetedFormats: [SupportedFormat.QR_CODE] }); // start scanning and wait for a result

      
        // if the result has content
        if (result__.hasContent) {
          console.log(result__.content); // log the raw scanned content
          BarcodeScanner.showBackground();
          BarcodeScanner.stopScan();
          $('#hideThisPart').css('display', 'block');
          $('#hideHeader').css('display', 'block');
          document.querySelector('body').classList.remove('scanner-active');

          let result = result__.content;
          if (result == this.currentQRCodeID) {

            this.objPortalModel.presentToastWithDuration("Please wait...", 4000);
            var options = {
              enableHighAccuracy: true,
              maximumAge: 0, // should be default, just in case
              timeout: 6000
            }
            Geolocation.getCurrentPosition(options).then((resp) => {
              let latitude = "" + resp.coords.latitude;
              let longitude = "" + resp.coords.longitude;
              debugger;
              console.log(this.currentQRLocation);
              let IsError = false;
              if (this.currentQRLocation) {
               
               
                var lat1 = this.currentQRLocation.split(',')[0];
                var long1 = this.currentQRLocation.split(',')[1];

                var lat2 = latitude;
                var long2 = longitude;

                var distanceInMeters = this.objPortalModel.fnCalculateDistance(lat1, lat2, long1, long2);
                if (distanceInMeters > 50) {
                  IsError = true;
                  var dd = parseFloat(distanceInMeters).toFixed(0);
                  alert("You are " + dd + " meters away from patrol location! The distance should be less than 10 meters.");
                }
                if (!IsError) {
                  this.fnUploadPatrolProgress(this.patrolLocationID, this.i, "New");
                  if (this.i >= this.patrolLocations.length - 1) {
                  } else {
                    this.i++;
                  }
                }
              }else{
                this.fnUploadPatrolProgress(this.patrolLocationID, this.i, "New");
                if (this.i >= this.patrolLocations.length - 1) {
                } else {
                  this.i++;
                }
              }
            }, error => {
              alert("There is a problem in accessing your location. Please make sure you have turned on your location, allowed app to access location and have active internet connection. " + error)
              console.log('Error getting location', error);
            });
          } else {
            this.objPortalModel.presentToastWithDuration("QR code does not match with the required location!", 6000);
          }
        }else{
          $('#hideThisPart').css('display', 'block');
          $('#hideHeader').css('display', 'block');
        //  document.querySelector('body').classList.remove('scanner-active');
        }
      }
      // this.barcodeScanner.scan().then(barcodeData => {
      //   if (barcodeData.cancelled) {
      //     return;
      //   }

      // }).catch(err => {
      //   console.log('Error', err);
      //   this.objPortalModel.presentToast("Some error occured!");
      // });
    } else {
      this.objPortalModel.presentToast("This location was already scanned in this patrol. Click Next-> icon on top right.");
    }
  }
}
