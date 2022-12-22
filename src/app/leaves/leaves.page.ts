import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { PortalModel } from '../Utilities/PortalModel';
import { IonDatetime } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular'
import { LoadingController } from '@ionic/angular';
import * as moment from 'moment';
import { Platform } from '@ionic/angular';
import * as $ from "jquery";

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.page.html',
  styleUrls: ['./leaves.page.scss'],
})
export class LeavesPage implements OnInit {


  APIUrl = PortalModel.ApiUrl;
  objPortalModel: any;
  UserID: any;
  Username: any;
  lstLeaves = [];

  fromDateValueLeave = '';
  toDateValueLeave = '';
  fromDateValueApplyLeave = '';
  toDateValueApplyLeave = '';
  lblFromDateLeave: string = "";
  lblToDateLeave: string = "";
  isApplyLeaveModalOpen = false;

  txtReason:string;
  ddlLeaveType:any;
  lblSeeRemaining:string="";
  lblFromDateApplyLeave: string = "";
  lblToDateApplyLeave: string = "";
  constructor(public plt: Platform, private router: Router, public toastController: ToastController,
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
        this.lblFromDateLeave = moment(Date.now()).format('DD-MMM-YYYY');
        this.lblToDateLeave = moment(Date.now()).format('DD-MMM-YYYY');
        this.storage.get('Username').then((Username) => {
          this.Username = Username;
          this.fnGetLeaves();
        });

      });
    });
  }
  doRefresh(){
    this.fnGetLeaves();
  }
  fnOpenLeaveForm(){
    this.fnClearFields();
    this.isApplyLeaveModalOpen = true;
  }
  closeApplyLeaveModal(){
    if(confirm("Any changes you have done in this form will be removed. Are you sure to close this window?")){
      this.isApplyLeaveModalOpen = false;
    }
  }
  GetFromDateLeave() {
    this.lblFromDateLeave = moment(this.fromDateValueLeave).format('DD-MMM-YYYY');
  }
  GetToDateLeave() {
    this.lblToDateLeave = moment(this.toDateValueLeave).format('DD-MMM-YYYY');
  }

  GetFromDateApplyLeave() {
    this.lblFromDateApplyLeave = moment(this.fromDateValueApplyLeave).format('DD-MMM-YYYY');
  }
  GetToDateApplyLeave() {
    this.lblToDateApplyLeave = moment(this.toDateValueApplyLeave).format('DD-MMM-YYYY');
  }

fnClearFields(){
  this.lblToDateApplyLeave="";
  this.lblFromDateApplyLeave="";
  this.lblSeeRemaining="";
  this.txtReason="";
}
  fnGetRemainingLeaves(){
    if(this.ddlLeaveType){
       this.loadingController
      .create({ keyboardClose: true, message: 'Please wait...' })
      .then(loadingEl => {
        loadingEl.present();
        let url = PortalModel.ApiUrl + "/Leaves/GetLeavesConsumption?userID=" + this.UserID + "&username=" + this.Username + "&LeaveType="+this.ddlLeaveType;
        this.http.get(url)
          .subscribe(data => {
            loadingEl.dismiss();
            let response = JSON.parse(JSON.stringify(data));
          
            if (response.responseType == 1) {
             this.lblSeeRemaining=response.Result+" leaves are remaining in this category!";
            }
          }, error => {
            loadingEl.dismiss();
            console.log(error);
            this.objPortalModel.presentToast("No Internet Connection!");
          });
      });
    }else{
      this.objPortalModel.presentToast("Please select leave type!");
    }
   
  }

  fnAddLeave(){
    var IsError = false;
    if(this.lblFromDateApplyLeave && this.lblToDateApplyLeave ){}
    else{
      IsError=true;
      this.objPortalModel.presentToast("Dates are required!");
    }
   if(this.ddlLeaveType){}
    else {
      IsError = true;
      this.objPortalModel.presentToast("Leave type is required!");
    }
    if (!IsError) {

      if (confirm("Once the leave is applied. It cannot be modified or deleted. Please make sure you have entered all correct information. Are you sure you want to proceed?")) {
        this.loadingController
          .create({ keyboardClose: true, message: 'Please wait...' })
          .then(loadingEl => {
            loadingEl.present();
            let url = PortalModel.ApiUrl + "/Leaves/AddLeave?userID=" + this.UserID + "&username=" + this.Username + "&fromDateTime=" + this.lblFromDateApplyLeave + "&toDateTime=" + this.lblToDateApplyLeave + "&Reason=" + this.txtReason + "&LeaveType=" + this.ddlLeaveType;
            this.http.get(url)
              .subscribe(data => {
                loadingEl.dismiss();
                let response = JSON.parse(JSON.stringify(data));
                this.objPortalModel.presentToast(response.Msg);
                if (response.responseType == 1) {
                  this.fnGetLeaves();
                  this.fnClearFields();
                  this.isApplyLeaveModalOpen = false;
                }
              }, error => {
                loadingEl.dismiss();
                console.log(error);
                this.objPortalModel.presentToast("No Internet Connection!");
              });
          });
      }
    }
  }
  fnGetLeaves() {
    this.loadingController
      .create({ keyboardClose: true, message: 'Please wait...' })
      .then(loadingEl => {
        loadingEl.present();
        let url = PortalModel.ApiUrl + "/Leaves/GetLeave?userID=" + this.UserID + "&username=" + this.Username + "&fromDate=" + this.lblFromDateLeave + "&toDate=" + this.lblToDateLeave;
        this.http.get(url)
          .subscribe(data => {
            this.lstLeaves = [];
            loadingEl.dismiss();
            let response = JSON.parse(JSON.stringify(data));
            if (response.responseType == 1) {
              this.lstLeaves = response.Data;
            }
          }, error => {
            loadingEl.dismiss();
            console.log(error);
            this.objPortalModel.presentToast("No Internet Connection!");
          });
      });
  }
}
