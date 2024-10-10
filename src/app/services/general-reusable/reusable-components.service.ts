import { Injectable } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { PortalModel } from '../../Utilities/PortalModel';
import { IonDatetime } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular'
import { LoadingController, AlertController } from '@ionic/angular';
import * as moment from 'moment';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Platform } from '@ionic/angular';
import * as $ from "jquery";
import { ActionSheetController } from '@ionic/angular';
import { Device } from '@capacitor/device';


@Injectable({
  providedIn: 'root'
})
export class ReusableComponentsService {

  objPortalModel: any;
  constructor(
    public actionSheetController: ActionSheetController,
    private iab: InAppBrowser,
    public plt: Platform,
    private router: Router,
    public toastController: ToastController,
    public http: HttpClient,
    private storage: Storage,
    private loadingController: LoadingController,
    private alertController:AlertController,
  ) {
    this.objPortalModel = new PortalModel(this.toastController, this.loadingController, this.http);
  }




 

}
