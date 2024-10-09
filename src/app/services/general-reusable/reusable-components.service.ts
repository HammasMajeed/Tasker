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
import { Geolocation } from '@capacitor/geolocation';
import { NativeSettings, AndroidSettings, IOSSettings } from 'capacitor-native-settings';

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


  fnOpenSettingsPageApp(permissionType, platform = "android", app = true) {
    //First you open the dialog telling user what to do.
    //Then by clicking on "Open Settings" navigate to Application Settings
    var alertButtons = [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Alert canceled');
        },
      },
      {
        text: permissionType == "Location" && app == false ? "Turn on location services" : "Open Settings",
        role: 'confirm',
        handler: () => {

          if(platform == "android"){
            NativeSettings.openAndroid({
              option: app ? AndroidSettings.ApplicationDetails : AndroidSettings.Location,
            });
          }else{
            NativeSettings.openIOS({
              option: IOSSettings.App,
            });
          }
        },
      },
    ];

    if (permissionType == "Location" && app == false)
      this.presentAlert("Location Services", "Please turn on your phone location services.", alertButtons, null);
    else {
      //You can change the title or message here according to permission type
      if (permissionType == "Notifications")
        this.presentAlert(permissionType + " permission Required", "Please enable '" + permissionType + "' from settings.", alertButtons, null);
      else
        this.presentAlert(permissionType + " permission Required", "Allow app to access '" + permissionType + "' from settings.", alertButtons, null);
    }

  }

  async presentAlert(alertHeader, alertMessage, alertButtons, alertInputs) {
    const alert = await this.alertController.create({
      header: alertHeader,
      message: alertMessage,
      buttons: alertButtons,
      // inputs: alertInputs
    });
    await alert.present();
  }
}
