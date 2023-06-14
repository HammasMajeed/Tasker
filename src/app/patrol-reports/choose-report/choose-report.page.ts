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
  selector: 'app-choose-report',
  templateUrl: './choose-report.page.html',
  styleUrls: ['./choose-report.page.scss'],
})
export class ChooseReportPage implements OnInit {

  objPortalModel: any;
  constructor(public plt: Platform, private router: Router, public toastController: ToastController,
    public http: HttpClient, private storage: Storage, private loadingController: LoadingController) {
    this.objPortalModel = new PortalModel(this.toastController, this.loadingController, this.http);
    this.plt.ready().then((readySource) => {
      storage.create();
    });
  }

  ngOnInit() {
  }


  fnOpenUnPublishedReports() {
    this.router.navigateByUrl('unpublished-reports');
  }
  fnOpenIncidentReports() {
    this.storage.set("UnPublishedReportID", 0).then((res) => {
      //Always create new report from here
      this.router.navigateByUrl('incident-report');
    });
  }

}
