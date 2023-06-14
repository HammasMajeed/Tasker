import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { PortalModel } from '../../Utilities/PortalModel';
import { IonDatetime } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular'
import { LoadingController } from '@ionic/angular';
import * as moment from 'moment';
import { Platform } from '@ionic/angular';
import * as $ from "jquery";

@Component({
  selector: 'app-unpublished-reports',
  templateUrl: './unpublished-reports.page.html',
  styleUrls: ['./unpublished-reports.page.scss'],
})
export class UnpublishedReportsPage implements OnInit {

  UserID:any;
lstReports=[];
  objPortalModel:any;
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
        this.fnGetUnPublishedReports();
      });
    });
  }

  fnOpenReport(ReportType,ReportID){
this.storage.set("UnPublishedReportID",ReportID).then((res) => {
  if(ReportType == "IncidentReport"){
    this.router.navigateByUrl('incident-report');
  }
});

  }

  fnGetUnPublishedReports() {
    this.loadingController
      .create({ keyboardClose: true, message: 'Please wait...' })
      .then(loadingEl => {
        loadingEl.present();
        let url = PortalModel.ApiUrl + "/GuardsPatrol/GetUnPublishedReports?UserID=" + this.UserID;
        console.log(url);
        this.http.get(url)
          .subscribe(data => {
            loadingEl.dismiss();
            let response = JSON.parse(JSON.stringify(data));
            if (response.responseType == 1) {
          this.lstReports = response.Data;
            }
            else{
              this.objPortalModel.presentToast("No data found!");
            }
          }, error => {
            loadingEl.dismiss();
            console.log(JSON.stringify(error));
            this.objPortalModel.presentToast("No Internet Connection!");
          });
      });

  }

}
