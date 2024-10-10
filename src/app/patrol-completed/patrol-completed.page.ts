import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { PortalModel} from '../Utilities/PortalModel';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular'
import { LoadingController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
//import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import * as $ from "jquery";

@Component({
  selector: 'app-patrol-completed',
  templateUrl: './patrol-completed.page.html',
  styleUrls: ['./patrol-completed.page.scss'],
})
export class PatrolCompletedPage implements OnInit {
  imgSrc:string="../../assets/images/logo.png";
  buildingInfo:string="Building Tech Management"
  toolBarBgColor:string="#0f2c6c";
  titleTextColor:string ="#fff";
  titleBarBgColor:string="#0f2c6c";
  username:string;
  contentBgColor:string="#0f2c6c";
  constructor(private storage: Storage,public plt: Platform,private router: Router) { }

  ngOnInit() {
  }

  
  fnReturnToDashboard(){
    this.router.navigateByUrl("dashboard-patrol")
  }

}
