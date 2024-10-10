import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicStorageModule, Storage  } from '@ionic/storage-angular';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { IonicSelectableModule } from 'ionic-selectable';
// import { File } from '@awesome-cordova-plugins/file/ngx';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
// import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
// import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
// import { Uid } from '@ionic-native/uid/ngx';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@awesome-cordova-plugins/media-capture/ngx';
//import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
// import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { WebView } from '@awesome-cordova-plugins/ionic-webview/ngx';
import { FTP } from '@awesome-cordova-plugins/ftp/ngx';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,HttpClientModule, IonicModule.forRoot(), AppRoutingModule,IonicSelectableModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },InAppBrowser,
    Storage,
    FileOpener,
    // Geolocation,
    // UniqueDeviceID,
    // Uid,
    // BarcodeScanner,
    MediaCapture,
    WebView,
    FTP,
    ImagePicker
    ],
  bootstrap: [AppComponent],
})
export class AppModule {}
