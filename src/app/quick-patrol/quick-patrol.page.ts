import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { PortalModel} from '../Utilities/PortalModel';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular'
import { LoadingController } from '@ionic/angular';
import { SpinnerDialog } from '@awesome-cordova-plugins/spinner-dialog/ngx';
import { Platform } from '@ionic/angular';
import * as $ from "jquery";
@Component({
  selector: 'app-quick-patrol',
  templateUrl: './quick-patrol.page.html',
  styleUrls: ['./quick-patrol.page.scss'],
})
export class QuickPatrolPage implements OnInit {
  imgSrc:string="../../assets/images/logo.png";
  buildingInfo: string = "Building Tech Management"
  toolBarBgColor: string = "#0f2c6c";
  titleTextColor: string = "#fff";
  titleBarBgColor: string = "#0f2c6c";
  username: string;
  contentBgColor: string = "#0f2c6c";
  lstUsers: any;
  lstBuildingProps: any;
  lstQuickLocations=[];
  objPortalModel: any; 

  UserID:any;
  constructor(private spinnerDialog: SpinnerDialog, public plt: Platform, private router: Router, public toastController: ToastController,
    public http: HttpClient, private storage: Storage, private loadingController: LoadingController) {
    this.objPortalModel = new PortalModel(this.toastController, this.loadingController,this.http);
    this.plt.ready().then((readySource) => {
      storage.create();
    });

  }
  ngOnInit() {
    this.plt.ready().then((readySource) => {
      this.storage.get('session').then((UserID) => {
        this.UserID = UserID;
        this.fnGetQuickPatrols();
      });
    });
  }
 
  fnGetQuickPatrols() {
    this.spinnerDialog.show();
    let url = PortalModel.ApiUrl + "/GuardsPatrol/GetQuickPatrolsForMobileApp?userID=" + this.UserID;
    this.http.get(url)
      .subscribe(data => {
        let response = JSON.parse(JSON.stringify(data));
        this.spinnerDialog.hide();
        if (response.responseType == 1) {
          this.lstQuickLocations = response.Data;
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
  fnOpenQuickPatrolling(quickPatrolID,title) {
    this.storage.set("PatrolType", title+" Quick Patrol-"+quickPatrolID);
    this.router.navigateByUrl('patrol');
  }
}
