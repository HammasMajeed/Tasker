import { Injectable } from '@angular/core';
import { Component, OnInit, NgZone } from '@angular/core';
import { ToastController, LoadingController, Platform, AlertController} from '@ionic/angular';
import { PortalModel } from '../../Utilities/PortalModel';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular'
import { HttpClient } from '@angular/common/http';
import { BackgroundGeolocationPlugin, Location } from "@capacitor-community/background-geolocation";
import { registerPlugin } from "@capacitor/core";
import Echo from 'src/app/Utilities/AndroidPlugin';
import { Geolocation } from '@capacitor/geolocation';
import { NativeSettings, AndroidSettings, IOSSettings } from 'capacitor-native-settings';
@Injectable({
  providedIn: 'root'
})
export class WorkerTrackingService {

  UserID: any;
  Username: any;
  objPortalModel: any;

  watcherId: any;
  backgroundLocationInterval: any;

  constructor(private alertController: AlertController, private http: HttpClient, private plt: Platform, private storage: Storage, private toastController: ToastController, private loadingController: LoadingController) {
    this.objPortalModel = new PortalModel(this.toastController, this.loadingController, this.http);
    this.plt.ready().then((readySource) => {
      storage.create();
    });

  }


  //#region Background tracking

  lastLatitude="";
  lastLongitude="";

  BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>("BackgroundGeolocation");
  fnUpdateLocation() {
    // Function to add a watcher for continuous location updates

    if (!this.watcherId) {
      const addLocationWatcher = (): Promise<string> => {
        return new Promise((resolve, reject) => {
          this.BackgroundGeolocation.addWatcher(
            {
              backgroundMessage: "Tasker is tracking your location for monitoring.",
              backgroundTitle: "Tasker is tracking your location.",
              requestPermissions: true,
              stale: false,
              distanceFilter: 50
            },
            (location, error) => {
              if (error) {
                if (error.code === "NOT_AUTHORIZED") {
                  if (window.confirm(
                    "This app needs your location, " +
                    "but does not have permission.\n\n" +
                    "Open settings now?"
                  )) {
                    this.BackgroundGeolocation.openSettings();
                  }
                }
                reject(error);
              } else {
                console.log("Received location update", location);
                resolve("Watcher added successfully.");
              }
            }
          ).then(id => {
            this.watcherId = id; // Save the watcher ID
          }).catch(error => {
            console.error("Error adding watcher", error);
            reject(error);
          });
        });
      };

      // Function to guess the user's location
      const guessLocation = (callback: (location: Location | undefined) => void, timeout: number) => {
        let lastLocation: Location | undefined;
        this.BackgroundGeolocation.addWatcher(
          {
            requestPermissions: false,
            stale: true
          },
          (location) => {
            lastLocation = location || undefined;
          }
        ).then(() => {
          this.backgroundLocationInterval = setInterval(() => {
            callback(lastLocation);
          }, timeout);
        }).catch(error => {
          console.error("Error adding watcher", error);
        });
      };

      // Usage examples
      addLocationWatcher().then(message => {
        console.log("This is send by watchter: " + message);
      }).catch(error => {
        console.error("Failed to add location watcher", error);
      });

      guessLocation((location) => {
        // var distanceInMeters = this.objPortalModel.fnCalculateDistance(location.latitude, location.longitude, this.lastLatitude, this.lastLongitude);
        // if (distanceInMeters > 50) {
          this.storage.get('session').then((UserID) => {
            if (UserID && UserID != 0) {
              let url = PortalModel.ApiUrl + "/Attendance/WorkerTracking?userID=" + UserID + "&latitude=" + location.latitude + "&longitude=" + location.longitude;
              console.log("Sending location updates to server for tracking.")
              console.log(url);
              if (this.plt.is('android')) {
                //For android, we will send request by native
                Echo.sendRequestToUpdateWorkerLocationForTracking({ userId: UserID + "" });
              } else {
                this.http.get(url)
                  .subscribe(data => {
                    console.log("Successfully Sent Data");
                    let response = JSON.parse(JSON.stringify(data));
                    if (response.responseType == 2) {
                      //Signals from server to stop watch.
                      this.fnStopTracking();
                    }
                  }, error => {
                    console.log("Cannot Send Data");
                  });
              }
            }
          });
        // }
        // this.lastLatitude = location.latitude + "";
        // this.lastLongitude = location.longitude + "";
      }, 3000); // 10000 milliseconds timeout
    }
  }

  fnStopTracking() {
    this.fnRemoveWatcher();
   // this.objPortalModel.presentToast("Please close your app from tasks.");
  }


  // Function to start tracking and update status
  fnStartTracking() {
    this.getCurrentLocation().then((resp) => {
      this.fnUpdateLocation();
      this.objPortalModel.presentToast("Please keep the app open in background.");
    });
  }
  // Function to remove the watcher
  fnRemoveWatcher() {
    if (this.watcherId) {
      this.BackgroundGeolocation.removeWatcher({ id: this.watcherId }).then(() => {
        console.log("Watcher removed successfully.");
        try {
          if (this.backgroundLocationInterval)
            clearInterval(this.backgroundLocationInterval);
        } catch (err) { }

        this.watcherId = undefined; // Clear the watcher ID after removal
      }).catch(error => {
        console.error("Error removing watcher", error);
      });
    } else {
      console.warn("No active watcher to remove.");
    }
  }


  //#endregion

  getCurrentLocation(): Promise<any> {
    return new Promise((resolve, reject) => {
      const options = {
        enableHighAccuracy: true,
        maximumAge: 0, // should be default, just in case
        timeout: 30000
      };

      Geolocation.getCurrentPosition(options)
        .then((resp) => {
          // Resolve with the position data
          resolve(resp);
        })
        .catch((error) => {
          // Handle the error case
          if (this.plt.is('android')) {
            const errorMsg = error + "";
            if (errorMsg.includes("location disabled")) {
              this.fnOpenSettingsPageApp("Location", "android", false);
              return reject(error); // Reject the promise
            }
          }
          // Handle permission request for non-Android devices
          if (this.plt.is('android')) {
            this.fnOpenSettingsPageApp("Location");
          } else {
            this.fnOpenSettingsPageApp("Location", "ios");
          }
          // Reject with the error
          reject(error);
        });
    });
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
