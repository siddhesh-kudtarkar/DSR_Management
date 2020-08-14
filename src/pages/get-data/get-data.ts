import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { CodeDisplayPage } from '../code-display/code-display';
import { ProductService } from '../../app/services/product.service';
import { NoInternetPage } from '../no-internet/no-internet';

@IonicPage()
@Component({
  selector: 'page-get-data',
  templateUrl: 'get-data.html',
})
export class GetDataPage {

  public records = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public http: Http, public storage: Storage, public modalCtrl: ModalController, public productService: ProductService) {
  
  }

  ngOnInit() {
    this.checkInternet();
    if (this.checkInternet() != false) {
      this.getStoredRecords();
    }
  }

  getStoredRecords() {
    this.storage.get('userShareId').then(
      (res) => {
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({
          headers: headers
        });

        let loader = this.loadingCtrl.create({
          content: "Fetching the stored records...",
          cssClass: 'fontChange fontSize'
        });

        let data = {
          mode: "fetchStoredRecords",
          share_id: res
        }

        loader.present().then(() => {
          this.http.post('http://your.server-url.com/fetch_data.php', data, options)
            .map(res => res.json())
            .subscribe(res => {
              this.records = res.server_response;
              loader.dismiss();
            },
            err => console.log(err));
        });
      },
      err => console.log(err)
    );
  }

  displayCode(index) {
    let record = this.records[index];
    let codeFormat = record.code_format;
    if (codeFormat == ('QR_CODE' || 'DATA_MATRIX' || 'PDF_417' || 'AZTEC')) {
      let value = {};
      value['serialNo'] = record.serial_number;
      value['referenceNo'] = record.reference_number;
      value['department'] = record.department;
      value['productType'] = record.product_type;
      value['productCost'] = record.product_cost;
      value['dateOfPurchase'] = record.date_of_purchase;
      const modal = this.modalCtrl.create(CodeDisplayPage, {
        'codeType': 'qrCode',
        'value': JSON.stringify(value)
      });
      modal.present();
    } else {
      const modal = this.modalCtrl.create(CodeDisplayPage, {
        'codeType': 'barcode',
        'value': record.serial_number
      });
      modal.present();
    }
  }

  deleteCode(index) {
    this.storage.get('userId').then(
      (res) => {
        this.storage.get('userShareId').then(
          (res1) => {
            this.productService.deleteRecord(res, res1, this.records[index].id_of_scanner, this.records[index].serial_number);
            this.navCtrl.pop();
          },
          err1 => console.log(err1)
        );
      },
      err => console.log(err)
    );
  }

  checkInternet() {
    if (navigator.onLine == false) {
      this.navCtrl.setRoot(NoInternetPage);
      return false;
    } else {
      return true;
    }
  }
}