import { Component, OnInit,ViewChild  } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { PortalModel} from '../Utilities/PortalModel';
import { IonDatetime } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular'
import { LoadingController } from '@ionic/angular';
import * as moment from 'moment';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Platform } from '@ionic/angular';
import * as $ from "jquery";

@Component({
  selector: 'app-unit-file',
  templateUrl: './unit-file.page.html',
  styleUrls: ['./unit-file.page.scss'],
})
export class UnitFilePage implements OnInit {
  imgSrc: string = "../../assets/images/logo.png";
  buildingInfo: string = "Building Tech Management"
  toolBarBgColor: string = "#0f2c6c";
  titleTextColor: string = "#fff";
  titleBarBgColor: string = "#0f2c6c";
  username: string;
  userReceivers = [];
  APIUrl = PortalModel.ApiUrl;
  contentBgColor: string = "#0f2c6c";
  lstUsers: any;
  lstBuildingProps: any;
  objPortalModel: any;
  lstUnits = [];
  lstUserRights = [];
  ddlUnitID: any;

  lstResidents = [];
  lblDetails: string;
  lblType:string;
  lblLeaseStartDate:string;
  lblLeaseEndDate:string;
  lstEmergencyContacts=[];
  lstEmergencyRequireAssistance=[];
  lstPets = [];
  lstKeyAccess = [];
  lstNoCallPeople = [];
  lstParkingSpot = [];
  lstVehicles = [];
  lstBicycles = [];
  lstLockers=[];
  lstAccessFobsCards=[];
  lstGarageRemotes=[];
  lblCommonAreaKeys:string;
  lblMailBoxKeys:string;
  lblDoorLockKeys:string;
  constructor(private iab: InAppBrowser, public plt: Platform, private router: Router, public toastController: ToastController,
    public http: HttpClient, private storage: Storage, private loadingController: LoadingController) {
    this.objPortalModel = new PortalModel(this.toastController, this.loadingController, this.http);
    this.plt.ready().then((readySource) => {
      this.fnMakeAllHidden();
      $("#divSegments").hide();
      storage.create();
    });
  }

  fnGetUnits(){
      this.loadingController
      .create({ keyboardClose: true, message: 'Please wait...' })
      .then(loadingEl => {
        loadingEl.present();
        let url = PortalModel.ApiUrl + "/Units/GetAllUnits?lstUsersFromMobile=" + this.lstUsers;
        this.http.get(url)
          .subscribe(data => {
            loadingEl.dismiss();
            let response = JSON.parse(JSON.stringify(data));
            this.lstUnits = response;
          }, error => {
            loadingEl.dismiss();
            this.objPortalModel.presentToast("No Internet Connection!");
          });
      });
  }


  fnChangedUnitTab(event) {
    this.fnMakeAllHidden();
    if (event.detail.value == "ResidentInfo") {
      $("#ResidentInfo").show();
    } else if (event.detail.value == "UnitType") {
      $("#UnitType").show();
    } else if (event.detail.value == "EmergencyContacts") {
      $("#EmergencyContacts").show();
    } else if(event.detail.value=="EmergencyRequireAssistance"){
      $("#EmergencyRequireAssistance").show();
    }else if(event.detail.value=="Pets"){
      $("#Pets").show();
    }else if(event.detail.value=="KeyAccess"){
      $("#KeyAccess").show();
    }else if(event.detail.value=="NoCallPeople"){
      $("#NoCallPeople").show();
    }else if(event.detail.value=="ParkingSpot"){
      $("#ParkingSpot").show();
    }else if(event.detail.value=="Vehicles"){
      $("#Vehicles").show();
    }else if(event.detail.value=="AccessEssentialTools"){
      $("#AccessEssentialTools").show();
    }else if(event.detail.value=="Lockers"){
      $("#Lockers").show();
    }
  }

  fnMakeAllHidden() {
    $("#UnitType").hide();
    $("#ResidentInfo").hide();
    $("#EmergencyContacts").hide();
    $("#EmergencyRequireAssistance").hide();
    $("#Pets").hide();
    $("#KeyAccess").hide();
    $("#NoCallPeople").hide();
    $("#ParkingSpot").hide(); 
    $("#Vehicles").hide(); $("#AccessEssentialTools").hide(); 
     $("#Lockers").hide();
  }

  fnSearchUnit(unitID) {
    var _unitID = "";
    if (unitID != "0") {
      _unitID = unitID;
    } else {
      _unitID = this.ddlUnitID.UnitID;
    }
    $("#divSegments").hide();
    this.loadingController
      .create({ keyboardClose: true, message: 'Please wait...' })
      .then(loadingEl => {
        loadingEl.present();
        let url = PortalModel.ApiUrl + "/Units/GetUnitById?lstUsersFromMobile=" + this.lstUsers + "&unitId=" + _unitID;
        this.http.get(url)
          .subscribe(res => {
            $("#divSegments").show();
            $("#ResidentInfo").show();
            loadingEl.dismiss();
            let data = JSON.parse(JSON.stringify(res));
            var result = data[0];
            this.lblDetails = result.Details;
            this.lstResidents = result.Residents;
            this.lstEmergencyContacts = result.EmergencyContact;
            this.lblType = result.Type;
            this.lstEmergencyRequireAssistance = result.EmergencyRequireAssistance;
            
            if (result.Type == "Lease") {
              this.lblType = "on Leased";
              this.lblLeaseEndDate = moment(result.LeaseEndDate).format('MM/DD/YYYY')
              this.lblLeaseStartDate = moment(result.LeaseStartDate).format('MM/DD/YYYY')
            }
            console.log(result.Pets)
            for (var i = 0; i < result.Pets.length; i++) {
              if (result.Pets[i].PetsPicture) {
                result.Pets[i].PetsPicture = PortalModel.ApiUrl + result.Pets[i].PetsPicture.replace("~", "");
              } else {
                result.Pets[i].PetsPicture = "../../assets/images/default.jpg";
              }
            }
            this.lstPets = result.Pets;

            for (var i = 0; i < result.KeyCheckOutPeople.length; i++) {
              if (result.KeyCheckOutPeople[i].KeyCheckOutIsSpecficDateTime) {
                result.KeyCheckOutPeople[i].KeyCheckOutFromSpecifcDateTime = moment(result.KeyCheckOutPeople[i].KeyCheckOutFromSpecifcDateTime).format("MM/DD/YYYY hh:mm A");
                result.KeyCheckOutPeople[i].KeyCheckOutToSpecifcDateTime = moment(result.KeyCheckOutPeople[i].KeyCheckOutToSpecifcDateTime).format("MM/DD/YYYY hh:mm A");
              }
            }
            this.lstKeyAccess = result.KeyCheckOutPeople; 

            for (var i = 0; i < result.NoCallPeople.length; i++) {
              if (result.NoCallPeople[i].NoCallIsSpecficDateTime) {
                result.NoCallPeople[i].NoCallStartDateTime = moment(result.KeyCheckOutPeople[i].NoCallStartDateTime).format("MM/DD/YYYY hh:mm A");
                result.NoCallPeople[i].NoCallEndDateTime = moment(result.KeyCheckOutPeople[i].NoCallEndDateTime).format("MM/DD/YYYY hh:mm A");
              }
            }

            for (var i = 0; i < result.ParkingSpot.length; i++) {
              if (result.ParkingSpot[i].ParkingRentedToExpiresOn) {
                result.ParkingSpot[i].ParkingRentedToExpiresOn = moment(result.ParkingSpot[i].ParkingRentedToExpiresOn).format("MM/DD/YYYY hh:mm A");
              }
              if (result.ParkingSpot[i].ParkingRentedByExpiresOn) {
                result.ParkingSpot[i].ParkingRentedByExpiresOn = moment(result.ParkingSpot[i].ParkingRentedByExpiresOn).format("MM/DD/YYYY hh:mm A");
              }
            }
            for (var i = 0; i < result.Lockers.length; i++) {
              if (result.Lockers[i].LockerRentedToExpiresOn) {
                result.Lockers[i].LockerRentedToExpiresOn = moment(result.Lockers[i].LockerRentedToExpiresOn).format("MM/DD/YYYY hh:mm A");
              }
              if (result.Lockers[i].LockerRentedByExpiresOn) {
                result.Lockers[i].LockerRentedByExpiresOn = moment(result.Lockers[i].LockerRentedByExpiresOn).format("MM/DD/YYYY hh:mm A");
              }
            }

            this.lstNoCallPeople = result.NoCallPeople;
            this.lstParkingSpot = result.ParkingSpot;
            this.lstLockers = result.Lockers;
            this.lstVehicles = result.Vehicles;
            this.lstBicycles = result.Bicycles;
            this.lstGarageRemotes = result.GarageRemotes;
            this.lstAccessFobsCards = result.AccessFobsCards;

            this.lblCommonAreaKeys = result.CommonAreaKeys;
            this.lblDoorLockKeys = result.DoorLockKeys;
            this.lblMailBoxKeys = result.MailBoxKeys;
          }, error => {
            loadingEl.dismiss();
            this.objPortalModel.presentToast("No Internet Connection!");
          });
      });

  }
  ngOnInit() {
    this.plt.ready().then((readySource) => {
      $("#divSearchUnit").hide();
      this.storage.get('session').then((lstUsers) => {
        this.lstUsers = lstUsers;
        this.username = lstUsers[1];
        this.fnGetBuildingProps(lstUsers[4]);
        this.fnGetUnits();

        this.storage.get('rights').then((lstUserRights) => {
          this.lstUserRights = lstUserRights;
          if (lstUserRights.includes("View Self Unit")) {
            $("#divSearchUnit").hide();
            this.fnSearchUnit(lstUsers[2]);
          }else{
            $("#divSearchUnit").show();
          }
        });
      });

    });
  }
  fnGetBuildingProps(buildingID) {
    let url = PortalModel.ApiUrl + "/Buildings/GetBuildingsProps?buildingID=" + buildingID;
    this.http.get(url)
      .subscribe(data => {
        let response = JSON.parse(JSON.stringify(data));
        let props = response;
        this.buildingInfo = props.BuildingName + " (" + props.BuildingNo + ")";
        this.imgSrc = props.Logo;
        $("#imgLogo").css("height", props.logoHeight);
        $("#imgLogo").css("width", props.logoWidth);
        this.titleBarBgColor = props.SideBarColor;
        this.contentBgColor = props.SideBarColor;
        this.toolBarBgColor = props.SideBarColor;
        this.titleTextColor = props.SideBarFontColor;
        this.storage.set("buildingProps", props);
      }, error => {
        this.objPortalModel.presentToast("No Internet Connection!");
      });
  }
}
