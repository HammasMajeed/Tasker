import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { PortalModel} from '../Utilities/PortalModel';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular'
import { LoadingController } from '@ionic/angular';
// import { SpinnerDialog } from '@awesome-cordova-plugins/spinner-dialog/ngx';
import { Platform } from '@ionic/angular';
import * as $ from "jquery";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard-patrol.page.html',
  styleUrls: ['./dashboard-patrol.page.scss'],
})
export class DashboardPatrolPage implements OnInit {

  imgSrc:string="../../assets/images/logo.png";
  buildingInfo:string="Building Tech Management"
  toolBarBgColor:string="#0f2c6c";
  titleTextColor:string ="#fff";
  titleBarBgColor:string="#0f2c6c";
  username:string;
  contentBgColor:string="#0f2c6c";
  lstUsers:any;
  lstBuildingProps :any;
  objPortalModel :any; //private spinnerDialog: SpinnerDialog,
  
  constructor(public plt: Platform,private router: Router,public toastController: ToastController,
    public http: HttpClient,private storage: Storage,private loadingController:LoadingController) { 
      this.objPortalModel = new PortalModel(this.toastController,this.loadingController, this.http);
      this.plt.ready().then((readySource) => {
        storage.create(); 
      });
      
    }

  ngOnInit() {
    this.plt.ready().then((readySource) => {
      this.storage.get('session').then((lstUsers) => {
        this.lstUsers = lstUsers;
        this.username =lstUsers[1];
      });
    });
  }
  fnUnfinishedPatrols(){
    this.router.navigateByUrl('unfinished-patrols')
  }
  fnLogOut(){

  }
  fnOpenQuickPatrolPage(){
    this.router.navigateByUrl('quick-patrol');
  }
  fnOpenInstructionPage(){
    this.router.navigateByUrl("instructions");
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      translucent: true,
    });
    return await loading.present();
  }
  fnGetPersonIsEligbleForPatrolling(){
   // this.presentLoading();
  // this.spinnerDialog.show();
  let url = PortalModel.ApiUrl+"/Users/IsUserEligibleForPatrol?lstUsersFromMobile="+this.lstUsers;
    this.http.get(url)
    .subscribe(data => {
    //  this.loadingController.dismiss();
      let response = JSON.parse(JSON.stringify(data));
    //  this.spinnerDialog.hide();
    if(response.responseType!=1){
      this.router.navigateByUrl("home")
      this.objPortalModel.presentToast("User does not have permission to do patrol!");
  }
    }, error => {
     // this.spinnerDialog.hide();
      this.objPortalModel.presentToast("No Internet Connection!");
    });
  }
  fnOpenPatrolPage(){
    this.storage.set("PatrolType", "Full Patrol");
    this.router.navigateByUrl("patrol")
  }
  fnExitApp(){
    navigator['app'].exitApp();
 }
  fnGetBuildingProps(buildingID){
    let url = PortalModel.ApiUrl+"/Buildings/GetBuildingsProps?buildingID="+buildingID;
    this.http.get(url)
    .subscribe(data => {
      let response = JSON.parse(JSON.stringify(data));
      let props = response;
      this.buildingInfo = props.BuildingName+" ("+ props.BuildingNo+")";
      this.imgSrc = props.Logo;
      $("#imgLogo").css("height",props.logoHeight);
      $("#imgLogo").css("width",props.logoWidth);
      this.titleBarBgColor = props.SideBarColor;
      this.contentBgColor = props.SideBarColor;
      this.toolBarBgColor = props.SideBarColor;
      this.titleTextColor = props.SideBarFontColor;
      this.storage.set("buildingProps",props);
    }, error => {
      this.objPortalModel.presentToast("No Internet Connection!");
    });
  }
}
