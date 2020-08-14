import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ProductService } from '../../app/services/product.service';
import { Storage } from '@ionic/storage';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { NoInternetPage } from '../no-internet/no-internet';

@IonicPage()
@Component({
  selector: 'page-code-details',
  templateUrl: 'code-details.html',
})
export class CodeDetailsPage {

  @ViewChild('code') code: ElementRef;

  public codeDetail = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public productService: ProductService, public loadingCtrl: LoadingController, public storage: Storage, public http: Http) {
    if (this.checkInternet() != false) {
      this.storage.get('userShareId').then(
        (res) => {
          this.getCodeDetails(this.navParams.get('codeSerial'), res);
        },
        err => this.productService.showAlert('Error', '', err)
      );
    }
  }

  getCodeDetails(codeSerial, shareId) {
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({
      headers: headers
    });

    let loader = this.loadingCtrl.create({
      content: "Fetching the details of scanned code...",
      cssClass: 'fontChange fontSize'
    });

    let data = {
      mode: "fetchCodeDetails",
      serial_number: codeSerial,
      share_id: shareId
    }

    loader.present().then(() => {
      this.http.post('http://your.server-url.com/fetch_data.php', data, options)
        .map(res => res.json())
        .subscribe((res) => {
          this.codeDetail = res.server_response[0];
          this.displayCode(res.server_response[0].code_format, this.codeDetail);
          loader.dismiss();
        },
        err => console.log(err)
      );
    });
  }

  displayCode(format, value) {
    if (format == ('QR_CODE' || 'DATA_MATRIX' || 'PDF_417' || 'AZTEC')) {
      this.productService.displayQrCode(this.code.nativeElement, JSON.stringify(value));
    } else {
      this.productService.displayBarcode(this.code.nativeElement, value.serial_number);
    }
  }

  saveCode() {
    this.productService.getStoragePermissions();
    this.productService.saveQrCode(this.code.nativeElement);
  }

  checkInternet() {
    if (navigator.onLine == false) {
      this.navCtrl.setRoot(NoInternetPage);
      return false;
    }
    return true;
  }


}
