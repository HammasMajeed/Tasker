import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { PortalModel } from '../Utilities/PortalModel';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular'
import { LoadingController } from '@ionic/angular';
// import { SpinnerDialog } from '@awesome-cordova-plugins/spinner-dialog/ngx';
import { Platform } from '@ionic/angular';
import * as $ from "jquery";
@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.page.html',
  styleUrls: ['./instructions.page.scss'],
})
export class InstructionsPage implements OnInit {
  imgSrc: string = "../../assets/images/logo.png";
  buildingInfo: string = "Building Tech Management"
  toolBarBgColor: string = "#0f2c6c";
  titleTextColor: string = "#fff";
  titleBarBgColor: string = "#0f2c6c";
  username: string;
  contentBgColor: string = "#0f2c6c";
  lstUsers: any;
  lstBuildingProps: any;
  objPortalModel: any; //private spinnerDialog: SpinnerDialog,
  constructor(public plt: Platform, private router: Router, public toastController: ToastController,
    public http: HttpClient, private storage: Storage, private loadingController: LoadingController) {
    this.objPortalModel = new PortalModel(this.toastController, this.loadingController,this.http);
    this.plt.ready().then((readySource) => {
      storage.create();
    });

  }
  fnReturnToDashboard(){
    this.router.navigateByUrl("dashboard-patrol")
  }

  ngOnInit() {
    this.plt.ready().then((readySource) => {
      this.storage.get('buildingProps').then((props) => {
        this.buildingInfo = props.BuildingName + " (" + props.BuildingNo + ")";
        this.imgSrc = props.Logo;
        $("#imgLogo").css("height", props.logoHeight);
        $("#imgLogo").css("width", props.logoWidth);
        this.titleBarBgColor = props.SideBarColor;
        this.contentBgColor = props.SideBarColor;
        this.toolBarBgColor = props.SideBarColor;
        this.titleTextColor = props.SideBarFontColor;
      });
    });
  }

}
