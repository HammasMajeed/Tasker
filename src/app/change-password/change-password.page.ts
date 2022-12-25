import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { PortalModel } from '../Utilities/PortalModel';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular'
import { LoadingController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import * as $ from "jquery";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  objPortalModel: any;
  txtCurrentPassword = "";
  txtNewPassword = "";
  txtConfirmPassword = "";
  UserID: any;
  constructor(public plt: Platform,
    private router: Router,
    public toastController: ToastController,
    public http: HttpClient,
    private storage: Storage,
    private loadingController: LoadingController) {
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
      });
    });
  }

  fnChangePassword() {
    var isError = false;

    if (this.txtNewPassword && this.txtConfirmPassword && this.txtCurrentPassword) {
    } else {
      isError = true;
      this.objPortalModel.presentToast("Please fill up the fields");
    }

    if (this.txtNewPassword == this.txtConfirmPassword) { }
    else {
      isError = true;
      this.objPortalModel.presentToast("Password does not match");
    }

    if (!isError) {
      this.loadingController
        .create({ keyboardClose: true, message: 'Please wait...' })
        .then(loadingEl => {
          loadingEl.present();
          let url = PortalModel.ApiUrl + "/Home/ChangePasswordConfirm?userID=" + this.UserID + "&oldPassword=" + this.txtCurrentPassword + "&newPassword=" + this.txtNewPassword;
          this.http.get(url)
            .subscribe(data => {
              loadingEl.dismiss();
              let response = JSON.parse(JSON.stringify(data));
              if (response.responseType == 1) {
                  this.objPortalModel.presentToast("Successfully Updated!");
                  this.router.navigateByUrl('tabs/tab1')
              } else {
                this.objPortalModel.presentToast(response.Msg);
              }
            }, error => {
              loadingEl.dismiss();
              console.log(error);
              this.objPortalModel.presentToast("No Internet Connection!");
            });
        });
    }

  }
}
