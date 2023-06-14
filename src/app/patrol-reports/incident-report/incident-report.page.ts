import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { PortalModel } from '../../Utilities/PortalModel';
import { IonDatetime } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular'
import { LoadingController, IonSlides, Config, ToastController, Platform, IonContent } from '@ionic/angular';
import * as moment from 'moment';
import * as $ from "jquery";
import { FTP } from '@awesome-cordova-plugins/ftp/ngx'
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { Geolocation } from '@capacitor/geolocation';
import { of } from 'rxjs';
@Component({
  selector: 'app-incident-report',
  templateUrl: './incident-report.page.html',
  styleUrls: ['./incident-report.page.scss'],
})
export class IncidentReportPage implements OnInit {
  @ViewChild('slideWithNav') slides: IonSlides;
  @ViewChild(IonContent) content: IonContent;
  objPortalModel: any;
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  UserID: any;
  Username: any;
  dateModalHeight = "565px";
  lblIncidentDateTime = "";
  IncidentDateTimeValue = "";
  lstClientSites: any;
  ddlClientSite: any;
  IsPrevBtnShown = false;
  lblNext = "Next";
  lstPersonsInvolved = [];

  txtInvolvedAs = "";
  txtInvolvedName = "";
  txtInvolvedPhone = "";
  txtInvolvedAppearance = "";
  txtInvolvedAge = "";
  ddlInvolvedGender = "";
  txtInvolvedBuild = "";
  txtInvolvedHeight = "";
  txtInvolvedHair = "";
  txtInvolvedFacialHair = "";
  txtInvolvedClothingTop = "";
  txtInvolvedClothingBottom = "";
  txtInvolvedAdditionalDetails = "";

  IncidentReportID = 0;

  txtMasterLicenseNo = "";
  txtLicenseNo = "";
  ddlIncidentType = "";
  txtDetails = "";
  IsAnyBodyInjured: any;
  IsIncidentWithWhs: any;
  IsEmergencyServicesOnSite: any;
  txtEmergencyServicesDetails: any;
  txtProhibitionNoticeGiven: any;
  txtWitnessName: any;
  txtWitnessContact: any;
  txtWitnessInvolvement: any;

  constructor(private ftp: FTP, private ngZone: NgZone, private imagePicker: ImagePicker, private config: Config, public plt: Platform, private router: Router, public toastController: ToastController,
    public http: HttpClient, private storage: Storage, private loadingController: LoadingController) {
    this.objPortalModel = new PortalModel(this.toastController, this.loadingController, this.http);
    this.plt.ready().then((readySource) => {
      storage.create();
    });
  }

  ngOnInit() {
    if (this.config.get("mode") == "ios") {
      this.dateModalHeight = "386px";
    }
  }
  async fnConnectToFtp() {
    await this.ftp.connect('208.91.199.17', 'PatrolDocs', '!patroldocs1995')
      .then((res: any) => {
        console.log('Login successful', res);
      })
      .catch((error: any) => console.error("FTP Error : " + error));
  }
  ionViewDidEnter() {
    this.plt.ready().then((readySource) => {
      this.fnConnectToFtp();
      this.storage.get('session').then((UserID) => {
        this.UserID = UserID;
        this.storage.get('Username').then((Username) => {
          this.Username = Username;
          this.fnGetClientSites();
        });
      });
    });
  }

  GetIncidentDateTime() {
    this.lblIncidentDateTime = moment(this.IncidentDateTimeValue).format('DD-MMM-YYYY hh:mm A');
  }

  fnGetClientSites() {
    this.loadingController
      .create({ keyboardClose: true, message: 'Please wait...' })
      .then(loadingEl => {
        loadingEl.present();
        let url = PortalModel.ApiUrl + "/Clients/GetClientSite?UserID=" + this.UserID + "&username=" + this.Username;
        console.log(url);
        this.http.get(url)
          .subscribe(data => {
            loadingEl.dismiss();
            this.storage.get('UnPublishedReportID').then((IncidentReportID) => {
              this.IncidentReportID = IncidentReportID;
              this.fnGetIncidentReportForEdit();
            });

            let response = JSON.parse(JSON.stringify(data));
            if (response.responseType == 1) {
              this.lstClientSites = response.Data;
            }
          }, error => {
            loadingEl.dismiss();
            console.log(JSON.stringify(error));
            this.objPortalModel.presentToast("No Internet Connection!");
          });
      });

  }

  fnBackSlide() {
    this.slides.slidePrev();
  }

  fnNextSlide() {
    if (this.lblNext == "Submit") {

      this.fnSaveReport(true);


    } else {
      this.slides.slideNext();
    }
  }

  fnSaveIncidentReportOnly() {
    this.fnSaveReport(false);
  }

  fnSaveReport(IsPublished) {

    let isError = false;
    let errMsg = "";

    if (!this.ddlIncidentType) {
      isError = true;
      errMsg = "Please enter incident type.";
    }

    if (!this.lblIncidentDateTime) {
      isError = true;
      errMsg = "Please enter incident date time.";
    }

    if (!isError) {
      this.loadingController
        .create({ keyboardClose: true, message: 'Please wait...' })
        .then(loadingEl => {
          loadingEl.present();
          let url = PortalModel.ApiUrl + "/GuardsPatrol/SaveIncidentReport";

          this.picsToSend.push("48348382.jpg");
          this.picsToSend.push("48348221.jpg");
          this.picsToSend.push("48342213.jpg");
          this.picsToSend.push("55323322.jpg");

          let clientID = "";
          if (this.ddlClientSite) {
            clientID = this.ddlClientSite.ClientSiteID;
          }




          var obj = {
            "IncidentReportID": this.IncidentReportID,
            "LicenseNo": this.txtLicenseNo,
            "MasterLicenseNo": this.txtMasterLicenseNo,
            "ClientSiteID": clientID,
            "IncidentDateTime": this.lblIncidentDateTime,
            "incidentType": this.ddlIncidentType,
            "Details": this.txtDetails,
            "IsAnyBodyInjured": this.IsAnyBodyInjured,
            "WitnessName": this.txtWitnessName,
            "WitnessContact": this.txtWitnessContact,
            "WitnessInvolvement": this.txtWitnessInvolvement,
            "IsEmergencyServicesOnSite": this.IsEmergencyServicesOnSite,
            "EmergencyServicesDetails": this.txtEmergencyServicesDetails,
            "IsIncidentWithWhs": this.IsIncidentWithWhs,
            // "IsCctvFootageCaptured":this.IsCc,
            "ProhibitionNoticeGiven": this.txtProhibitionNoticeGiven,
            "GeoLocation": this.latitude + "," + this.longitude,
            "userID": this.UserID,
            "picsToSend": this.picsToSend,
            "personInvolvedInIncidents": this.lstPersonsInvolved,
            IsPublished
          }


          this.http.post<any>(url, obj)
            .subscribe(data => {
              loadingEl.dismiss();
              let response = JSON.parse(JSON.stringify(data));

              if (response.responseType == 1) {

                this.objPortalModel.presentToast(response.Msg);
                this.router.navigateByUrl("choose-report")
              } else {
                this.objPortalModel.presentToast(response.Msg);
              }
            }, error => {
              loadingEl.dismiss();
              console.log(error);
              this.objPortalModel.presentToast("No Internet Connection!");
            });
        });
    } else {
      this.objPortalModel.presentToast(errMsg);
    }
  }


  fnRemovePersonFromArray_(item) {
    if (confirm("Are you sure you want to delete this?")) {
      var obj = this.lstPersonsInvolved.find(x => x.Id == item);
      if (obj) {
        this.lstPersonsInvolved = this.objPortalModel.fnArrayRemove(this.lstPersonsInvolved, obj);
      }
    }
  }
  fnAddPersonToList() {
    debugger;
    var InvolvedAs = this.txtInvolvedAs;
    var Name = this.txtInvolvedName;
    var Phone = this.txtInvolvedPhone;
    var Appearance = this.txtInvolvedAppearance;
    var Age = this.txtInvolvedAge;
    var Gender = this.ddlInvolvedGender;
    var Build = this.txtInvolvedBuild;
    var Height = this.txtInvolvedHeight;
    var Hair = this.txtInvolvedHair;
    var FacialHair = this.txtInvolvedFacialHair;
    var ClothingTop = this.txtInvolvedClothingTop;
    var ClothingBottom = this.txtInvolvedClothingBottom;
    var AdditionalDescription = this.txtInvolvedAdditionalDetails;
    var Id = Math.floor(Math.random() * 1000000000000);

    var obj = {
      Id,
      InvolvedAs,
      Name,
      Phone,
      Appearance,
      Age,
      Gender,
      Build,
      Height,
      Hair,
      FacialHair,
      ClothingTop,
      ClothingBottom,
      AdditionalDescription
    }

    if (InvolvedAs || Name || Phone || Appearance || Age || Gender || Build || Height || Hair || FacialHair || ClothingTop || ClothingBottom || AdditionalDescription) {
      this.lstPersonsInvolved.push(obj);
      this.txtInvolvedAs = "";
      this.txtInvolvedName = "";
      this.txtInvolvedPhone = "";
      this.txtInvolvedAppearance = "";
      this.txtInvolvedAge = "";
      this.ddlInvolvedGender = "";
      this.txtInvolvedBuild = "";
      this.txtInvolvedHeight = "";
      this.txtInvolvedHair = "";
      this.txtInvolvedFacialHair = "";
      this.txtInvolvedClothingTop = "";
      this.txtInvolvedClothingBottom = "";
      this.txtInvolvedAdditionalDetails = "";
      this.content.scrollToBottom();
    } else {
      this.objPortalModel.presentToast("Please write at least one field to add person.")
    }


  }

  remoteUrl = PortalModel.ApiUrl + "/Content/Attachements/PatrolDocs/";
  lblUploadingText = "";
  filesToUpload = [];
  totalFiles = 0;
  currentIteration = 0;
  IsUploadingFile: any;
  picsToSend = [];
  displayMedia = [];
  progressPercentage: any;
  async fnAddPhotoToGallery_() {
    this.lblUploadingText = "Uploading...";
    let options = {
      quality: 100,
      maximumImagesCount: 100,
    }

    this.totalFiles = 0;
    this.currentIteration = 0;
    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        let image = results[i];
        let fullPath = image;
        var Id = Math.floor(Math.random() * 1000000000000);
        let remoteFile =  + Id + ".jpg";
        let f = this.remoteUrl + remoteFile; //this.win.Ionic.WebView.convertFileSrc(image);
        var obj = {
          "Id": Id,
          "src": f,
          "Type": 2,
          "orignalSrc": fullPath
        }
        this.filesToUpload.push(obj);
        // this.IsUploadingFile = true;
        // console.log("Uploading... to " + remoteFile);

        // this.fnUploadImage(fullPath, remoteFile, results, obj, Id, i);
      }

      this.totalFiles = this.filesToUpload.length;
      this.fnUploadImage();
    }, (err) => {
      console.log("Something went wrong while getting images.");
    });
  }


  fnUploadImage() {
    if (this.filesToUpload.length > 0) {
      this.IsUploadingFile = true;
      const fileObj = this.filesToUpload.shift();
      this.currentIteration++;
      console.log(fileObj);
      this.ftp.upload(fileObj.orignalSrc, fileObj.Id + ".jpg").subscribe((__result) => {

        this.ngZone.run(() => {

          let _result = __result;
          this.progressPercentage = __result;
          this.lblUploadingText = this.currentIteration + "/" + this.totalFiles + " Uploading (" + (_result * 100).toFixed(0) + " %)";
          if (__result >= 1) {

            setTimeout(() => {
              this.displayMedia.push(fileObj);
              this.picsToSend.push(fileObj.Id+".jpg");
              this.fnUploadImage();
            }, 3000);

          }
        });
      }, (error) => {
        this.IsUploadingFile = false;
        console.log("This is our FTP error: " + error);
        this.objPortalModel.presentToast("Something went wrong!");
      });
    } else {
      this.IsUploadingFile = false;
    }

  }

  latitude = "";
  longitude = "";
  fnGetMyLocation() {
    var options = {
      enableHighAccuracy: true,
      maximumAge: 0, // should be default, just in case
      timeout: 6000
    }
    Geolocation.getCurrentPosition(options)
      .then((resp) => {
        let latitude = "" + resp.coords.latitude;
        let longitude = "" + resp.coords.longitude;

        this.latitude = latitude;
        this.longitude = longitude;
      }, error => {
        alert("There is a problem in accessing your location. Please make sure you have turned on your location, allowed app to access location and have active internet connection. " + JSON.stringify(error))
        console.log('Error getting location', error);
      });
  }



  fnEditPerson(Id) {
    debugger;
    var item = this.lstPersonsInvolved.find(x => x.Id == Id);
    if (item) {
      this.lstPersonsInvolved = this.objPortalModel.fnArrayRemove(this.lstPersonsInvolved, item);
      this.txtInvolvedAs = item.InvolvedAs;
      this.txtInvolvedName = item.Name
      this.txtInvolvedPhone = item.Phone
      this.txtInvolvedAppearance = item.Appearance
      this.txtInvolvedAge = item.Age
      this.ddlInvolvedGender = item.Gender
      this.txtInvolvedBuild = item.Build
      this.txtInvolvedHeight = item.Height
      this.txtInvolvedHair = item.Hair
      this.txtInvolvedFacialHair = item.FacialHair
      this.txtInvolvedClothingTop = item.ClothingTop
      this.txtInvolvedClothingBottom = item.ClothingBottom
      this.txtInvolvedAdditionalDetails = item.AdditionalDescription
    }
  }

  slideChanged() {
    this.content.scrollToTop();
    this.slides.getActiveIndex().then(index => {
      if (index > 0) {
        this.IsPrevBtnShown = true;
      } else {
        this.IsPrevBtnShown = false;
      }

      if (index == 4) {
        this.lblNext = "Submit";
      } else {
        this.lblNext = "Next";
      }
    });
  }

  fnGetIncidentReportForEdit() {

if(this.IncidentReportID!=0){
  this.loadingController
  .create({ keyboardClose: true, message: 'Please wait...' })
  .then(loadingEl => {
    loadingEl.present();
    let url = PortalModel.ApiUrl + "/GuardsPatrol/GetIncidentReportByID?IncidentReportID=" + this.IncidentReportID;
    console.log(url);
    this.http.get(url)
      .subscribe(data => {
        loadingEl.dismiss();
        let response = JSON.parse(JSON.stringify(data));
        if (response.Data) {
          let item = response.Data;
          this.txtLicenseNo = item.LicenseNo;
          this.txtMasterLicenseNo = item.MasterLicenseNo;
          this.ddlClientSite = this.lstClientSites.find(x => x.ClientSiteID == item.ClientSiteID);
          this.lblIncidentDateTime = item.StrIncidentDateTime;
          this.ddlIncidentType = item.IncidentType;
          this.txtDetails = item.Details;
          this.IsAnyBodyInjured = item.IsAnyBodyInjured;
          this.txtWitnessName = item.WitnessName;
          this.txtWitnessContact = item.WitnessContact;
          this.txtWitnessInvolvement = item.WitnessInvolvement;
          this.IsEmergencyServicesOnSite = item.IsEmergencyServicesOnSite;
          this.txtEmergencyServicesDetails = item.EmergencyServicesDetails;
          this.IsIncidentWithWhs = item.IsIncidentWithWhs;
          // "IsCctvFootageCaptured":this.IsCc,
          this.txtProhibitionNoticeGiven = item.ProhibitionNoticeGiven;

          for(var i=0;i<response.Data.PersonsInvolved.length;i++){
            let item__ = response.Data.PersonsInvolved[i];

            var InvolvedAs = item__.InvolvedAs;
            var Name = item__.Name;
            var Phone =item__.Phone;
            var Appearance = item__.Appearance;
            var Age = item__.Age;
            var Gender = item__.Gender;
            var Build = item__.Build;
            var Height = item__.Height;
            var Hair = item__.Hair;
            var FacialHair =item__.FacialHair;
            var ClothingTop =item__.ClothingTop;
            var ClothingBottom = item__.ClothingBottom;
            var AdditionalDescription = item__.AdditionalDescription;
            var Id = Math.floor(Math.random() * 1000000000000);
        
            var obj = {
              Id,
              InvolvedAs,
              Name,
              Phone,
              Appearance,
              Age,
              Gender,
              Build,
              Height,
              Hair,
              FacialHair,
              ClothingTop,
              ClothingBottom,
              AdditionalDescription
            }
            this.lstPersonsInvolved.push(obj);
          }

   
          for(var i=0;i<response.Data.Images.length;i++){
            var pic_ = response.Data.Images[i];
            var objImg = {
              "Id": pic_.split("/Content/Attachements/PatrolDocs/")[1].replace(".jpg",""),
              "src": PortalModel.ApiUrl+pic_,
              "Type": 2,
              "orignalSrc": PortalModel.ApiUrl+pic_
            }

            this.displayMedia.push(objImg);
           
            this.picsToSend.push(pic_.split("/Content/Attachements/PatrolDocs/")[1]);

          }

          if (item.GeoLocation) {
            this.latitude = item.GeoLocation.split(",")[0];
            this.longitude = item.GeoLocation.split(",")[1];
          }
        }else{
          if(this.IncidentReportID!=0){
            this.objPortalModel.presentToast("Something went wrong.");
            this.IncidentReportID=0;
          }
        }
      }, error => {
        loadingEl.dismiss();
        console.log(JSON.stringify(error));
        this.objPortalModel.presentToast("No Internet Connection!");
      });
  });
}


  }
}
