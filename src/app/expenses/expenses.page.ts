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
import * as $ from "jquery"

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.page.html',
  styleUrls: ['./expenses.page.scss'],
})
export class ExpensesPage implements OnInit {
  APIUrl = PortalModel.ApiUrl;
  objPortalModel: any;
  UserID: any;
  Username: any;
  lstExpenses = [];

  lstExpenseHeads=[];

  fromDateValueExpense = '';
  toDateValueExpense = '';
  fromDateValueApplyExpense = '';
  toDateValueApplyExpense = '';
  lblFromDateExpense: string = "";
  lblToDateExpense: string = "";
  isApplyExpenseModalOpen = false;

  txtReason:string;
  ddlExpenseType:any;
  txtAmount:string="";
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
        this.lblFromDateExpense = moment(Date.now()).format('DD-MMM-YYYY');
        this.lblToDateExpense = moment(Date.now()).format('DD-MMM-YYYY');
        this.storage.get('Username').then((Username) => {
          this.Username = Username;
          this.fnGetExpenseHeads();
          this.fnGetExpenses();
        });

      });
    });
  }
  doRefresh(){
    this.fnGetExpenses();
  }
  fnOpenExpenseForm(){
    this.fnClearFields();
    this.isApplyExpenseModalOpen = true;
  }
  closeApplyExpenseModal(){
    if(confirm("Any changes you have done in this form will be removed. Are you sure to close this window?")){
      this.isApplyExpenseModalOpen = false;
    }
  }
  GetFromDateExpense() {
    this.lblFromDateExpense = moment(this.fromDateValueExpense).format('DD-MMM-YYYY');
  }
  GetToDateExpense() {
    this.lblToDateExpense = moment(this.toDateValueExpense).format('DD-MMM-YYYY');
  }

 

fnClearFields(){
  
  this.txtAmount="";
  this.ddlExpenseType="";
  this.txtReason="";
}
 
  fnAddExpense(){
    var IsError = false;
    if(this.txtAmount){}
    else{
      IsError=true;
      this.objPortalModel.presentToast("Amount is required!");
    }
   if(this.ddlExpenseType){}
    else {
      IsError = true;
      this.objPortalModel.presentToast("Expense type is required!");
    }
    if (!IsError) {

      if (confirm("Once the expense is applied. It cannot be modified or deleted. Please make sure you have entered all correct information. Are you sure you want to proceed?")) {
        this.loadingController
          .create({ keyboardClose: true, message: 'Please wait...' })
          .then(loadingEl => {
            loadingEl.present();
            let url = PortalModel.ApiUrl + "/Expenses/AddExpense?userID=" + this.UserID + "&username=" + this.Username + "&Amount=" + this.txtAmount + "&Reason=" + this.txtReason + "&ExpneseHeadID=" + this.ddlExpenseType;
            this.http.get(url)
              .subscribe(data => {
                loadingEl.dismiss();
                let response = JSON.parse(JSON.stringify(data));
                this.objPortalModel.presentToast(response.Msg);
                if (response.responseType == 1) {
                  this.fnGetExpenses();
             
                  this.fnClearFields();
                  this.isApplyExpenseModalOpen = false;
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
  fnGetExpenseHeads() {
    this.loadingController
      .create({ keyboardClose: true, message: 'Please wait...' })
      .then(loadingEl => {
        loadingEl.present();
     
        let url = PortalModel.ApiUrl + "/Expenses/GetExpenseHead?userID=" + this.UserID + "&username=" + this.Username;
        this.http.get(url)
          .subscribe(data => {
            this.lstExpenseHeads = [];
            loadingEl.dismiss();
            let response = JSON.parse(JSON.stringify(data));
            if (response.responseType == 1) {
              this.lstExpenseHeads = response.Data;
            }
          }, error => {
            loadingEl.dismiss();
            console.log(error);
            this.objPortalModel.presentToast("No Internet Connection!");
          });
      });
  }
  fnGetExpenses() {
    this.loadingController
      .create({ keyboardClose: true, message: 'Please wait...' })
      .then(loadingEl => {
        loadingEl.present();
        let url = PortalModel.ApiUrl + "/Expenses/GetExpense?userID=" + this.UserID + "&username=" + this.Username + "&fromDate=" + this.lblFromDateExpense + "&toDate=" + this.lblToDateExpense;
        this.http.get(url)
          .subscribe(data => {
            this.lstExpenses = [];
            loadingEl.dismiss();
            let response = JSON.parse(JSON.stringify(data));
            if (response.responseType == 1) {
              this.lstExpenses = response.Data;
            }
          }, error => {
            loadingEl.dismiss();
            console.log(error);
            this.objPortalModel.presentToast("No Internet Connection!");
          });
      });
  }
}
