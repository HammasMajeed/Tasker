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
  selector: 'app-shops',
  templateUrl: './shops.page.html',
  styleUrls: ['./shops.page.scss'],
})
export class ShopsPage implements OnInit {
  APIUrl = PortalModel.ApiUrl;
  objPortalModel: any;
  AddOrder: boolean = false;
  UserID: any;
  Username: any;
  lstShops = [];
  AddShop: boolean = false;
  totalShops = 0;
  hdnShopID: string;
  actionButtons = [];
  constructor(public actionSheetController: ActionSheetController, private iab: InAppBrowser, public plt: Platform, private router: Router, public toastController: ToastController,
    public http: HttpClient, private storage: Storage, private loadingController: LoadingController) {
    this.objPortalModel = new PortalModel(this.toastController, this.loadingController, this.http);
    this.plt.ready().then((readySource) => {
      storage.create();
    });
  }

  ngOnInit() {

  }

  async presentActionSheet(ShopID) {

    this.hdnShopID = ShopID;

    const actionSheet = await this.actionSheetController.create({
      header: 'Menu',
      cssClass: 'my-custom-class',
      buttons: this.actionButtons,
      // [
      //   {
      //     text: 'Take Order',
      //     icon: 'cube',
      //     id: 'take-orders',
      //     handler: () => {
      //       if (this.AddOrder == true) {
      //         this.storage.set("ShopOrder",ShopID);
      //         this.router.navigateByUrl('add-edit-order');
      //       } else {
      //         this.objPortalModel.presentToast('This user does not have rights to take orders!');
      //       }
      //     }
      //   },
      //   {
      //     text: 'Edit',
      //     icon: 'pencil',
      //     data: 10,
      //     handler: () => {
      //       if (this.AddShop == true) {
      //         this.fnEditShop(ShopID);
      //       } else {
      //         this.objPortalModel.presentToast('This user does not have rights to manage shops!');
      //       }
      //     }
      //   },
      //   {
      //     text: 'Delete',
      //     icon: 'trash',
      //     data: 10,
      //     handler: () => {
      //       if (this.AddShop == true) {
      //         this.fnDeleteShops(ShopID);
      //       } else {
      //         this.objPortalModel.presentToast('This user does not have rights to manage shops!');
      //       }
      //     }
      //   },
      // {
      //   text: 'Cancel',
      //   icon: 'close',
      //   role: 'cancel',
      //   handler: () => {
      //     console.log('Cancel clicked');
      //   }
      // }
      //]
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role and data', role, data);
  }

  ionViewDidEnter() {
    this.plt.ready().then((readySource) => {
      this.storage.get('session').then((UserID) => {
        this.UserID = UserID;
        this.fnGetShops();
      }); this.storage.get('Username').then((Username) => {
        this.Username = Username;
      });
      this.storage.get('rights').then((lstUserRights) => {

        this.actionButtons = [];
        if (lstUserRights.includes("AddEdit Shops")) {
          this.AddShop = true;

          let buttonDelete = {
            text: "Delete",
            icon: "trash",
            handler: () => {
              this.fnDeleteShops(this.hdnShopID);
            }
          }
          let buttonEdit = {
            text: "Edit",
            icon: "pencil",
            handler: () => {
              this.fnEditShop(this.hdnShopID);
            }
          }


          this.actionButtons.push(buttonEdit)
          this.actionButtons.push(buttonDelete);

        }
        if (lstUserRights.includes("Create Order")) {
          this.AddOrder = true;
          let buttonOrders = {
            text: "Take Order",
            icon: "cube",
            handler: () => {
              this.storage.set("OrderID", 0);
              this.storage.set("ShopOrder", this.hdnShopID);
              this.router.navigateByUrl('add-edit-order');
            }
          }
          this.actionButtons.push(buttonOrders)
        }

        let buttonSkipOrders = {
          text: "Skip Order",
          icon: "cut",
          handler: () => {
            var r = prompt("Enter Remakrs...");
            if (r === null) {
            } else {
              this.loadingController
                .create({ keyboardClose: true, message: 'Please wait...' })
                .then(loadingEl => {
                  loadingEl.present();
                  let url = PortalModel.ApiUrl + "/Orders/SkipOrder?userID=" + this.UserID + "&username=" + this.Username + "&ShopID=" + this.hdnShopID + "&Remarks=" + r;
                  this.http.get(url)
                    .subscribe(data => {
                      loadingEl.dismiss();
                      let response = JSON.parse(JSON.stringify(data));
                      if (response.responseType == 1) {
                        this.objPortalModel.presentToast(response.Msg);
                        this.fnGetShops();
                      } else {
                        this.objPortalModel.presentToast(response.Msg);
                      }
                    }, error => {
                      loadingEl.dismiss();
                      this.objPortalModel.presentToast("No Internet Connection!");
                    });
                });
            }
          }
        }
        this.actionButtons.push(buttonSkipOrders)

        let buttonCancel = {
          text: "Close",
          icon: "close",
          role: 'cancel',
          handler: () => {
          }
        }


        this.actionButtons.push(buttonCancel)
      });
    });
  }
  fnEditShop(ShopID) {
    this.storage.set("ShopID", ShopID + "-Edit");
    this.router.navigateByUrl('add-edit-view-shops');
  }
  fnViewShop(ShopID) {
    this.storage.set("ShopID", ShopID + "-View");
    this.router.navigateByUrl('add-edit-view-shops');
  }
  fnOpenShopForm() {
    this.storage.set("ShopID", 0);
    this.router.navigateByUrl('add-edit-view-shops');
  }
  doRefresh(event) {
    this.fnGetShops();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }
  fnDeleteShops(ShopID) {
    if (confirm("Are you sure you want to delete this shop?")) {
      this.fnDeleteShopsConfirm(ShopID);
    }
  }
  fnDeleteShopsConfirm(ShopID) {
    this.loadingController
      .create({ keyboardClose: true, message: 'Please wait...' })
      .then(loadingEl => {
        loadingEl.present();
        let url = PortalModel.ApiUrl + "/Shops/DeleteShop?userID=" + this.UserID + "&username=" + this.Username + "&ShopID=" + ShopID;
        this.http.get(url)
          .subscribe(data => {
            loadingEl.dismiss();
            let response = JSON.parse(JSON.stringify(data));
            if (response.responseType == 1) {
              this.objPortalModel.presentToast(response.Msg);
              this.fnGetShops();
            } else {
              this.objPortalModel.presentToast("No data found!");
            }
          }, error => {
            loadingEl.dismiss();
            this.objPortalModel.presentToast("No Internet Connection!");
          });
      });
  }

  fnGetShops() {
    this.loadingController
      .create({ keyboardClose: true, message: 'Please wait...' })
      .then(loadingEl => {
        loadingEl.present();
        let url = PortalModel.ApiUrl + "/Shops/GetShopsForRider?userID=" + this.UserID + "&username=" + this.Username;
        this.http.get(url)
          .subscribe(data => {
            loadingEl.dismiss();
            this.lstShops = [];
            let response = JSON.parse(JSON.stringify(data));
            if (response.responseType == 1) {
              //  this.totalShops = response.Data.length;
              this.lstShops = response.Data;
            } else {
              this.objPortalModel.presentToast("No data found!");
            }
          }, error => {
            loadingEl.dismiss();
            this.objPortalModel.presentToast("No Internet Connection!");
          });
      });
  }
}
