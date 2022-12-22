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

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
})
export class TasksPage implements OnInit {

  APIUrl = PortalModel.ApiUrl;
  objPortalModel: any;
  AddOrder: boolean = false;
  UserID: any;
  Username: any;
  lstTasks = [];

  constructor(public actionSheetController: ActionSheetController, private iab: InAppBrowser, public plt: Platform, private router: Router, public toastController: ToastController,
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
        this.fnGetTasks();
      }); this.storage.get('Username').then((Username) => {
        this.Username = Username;
      });
  });
  }

  fnGetTasks() {
    this.loadingController
      .create({ keyboardClose: true, message: 'Please wait...' })
      .then(loadingEl => {
        loadingEl.present();
        let url = PortalModel.ApiUrl + "/Tasks/GetMyTask?userID=" + this.UserID + "&username=" + this.Username;
        this.http.get(url)
          .subscribe(data => {
            $("#lblNoTasks").hide();
            loadingEl.dismiss();
            this.lstTasks = [];
            let response = JSON.parse(JSON.stringify(data));
            if (response.responseType == 1) {
              this.lstTasks = response.Data;
            } else {

              $("#lblNoTasks").show();
            }
          }, error => {
            loadingEl.dismiss();
            this.objPortalModel.presentToast("No Internet Connection!");
          });
      });
  }
  fnOpenTasks(TaskID, TaskName) {
    this.storage.set("TaskName", TaskName)
    this.storage.set("TaskID", TaskID)
    this.router.navigateByUrl('task-activities')
  }
  doRefresh(event) {
    this.fnGetTasks();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }
}
