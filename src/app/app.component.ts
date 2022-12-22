import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular'
import { Platform } from '@ionic/angular';
import { isThisISOWeek } from 'date-fns';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  Pages = [
    {
      title: 'Dashboard',
      url: '/tabs/tab1',
      icon: 'albums'
    },
    {
      title: 'Attendance',
      url: '/check-in-out',
      icon: 'time'
    },
    {
      title: 'Tasks',
      url: '/tasks',
      icon: 'hammer'
    },
    {
      title: 'Leaves',
      url: '/leaves',
      icon: 'calendar'
    },
    {
      title: 'Expenses',
      url: '/expenses',
      icon: 'wallet'
    },
    {
      title: 'Support',
      url: '/tabs/tab3',
      icon: 'headset'
    },
    {
      title: 'Logout',
      url: '/home',
      icon: 'power-sharp'
    },
  ];
  constructor(public plt: Platform, private router: Router,
    public http: HttpClient, private storage: Storage) {
    this.plt.ready().then((readySource) => {
      storage.create();
    });
  }
  ngOnInit() {
    this.plt.ready().then((readySource) => {
      this.storage.get('rights').then((lstUserRights) => {
        console.log(lstUserRights);
        // if (!lstUserRights.includes("AssignRidersToShop")) {
        //   this.Pages = this.Pages.filter(function (el) { return el.title != "Riders to Shops"; });
        // }
      });
    });
  }

  fnClickOnItem(itemName) {
    if (itemName == "Logout") 
    {
      console.log("Setting session to 0");
      this.storage.set('session', "0");
    }
    
    // if (itemName == "Riders to Shops") 
    // {
    //   this.storage.set("AssignRiderID",0);
    //   this.router.navigateByUrl('riders-to-shops');
    // }
  }
}
