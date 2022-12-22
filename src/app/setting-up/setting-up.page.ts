import { Component, OnInit } from '@angular/core';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { Storage } from '@ionic/storage';
import {  Platform  } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setting-up',
  templateUrl: './setting-up.page.html',
  styleUrls: ['./setting-up.page.scss'],
})
export class SettingUpPage implements OnInit {

  constructor(public plt: Platform, private router: Router,
    private storage: Storage) {
  }

  ngOnInit() {
  }

}
