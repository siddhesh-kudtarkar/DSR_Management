import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ModalController, LoadingController } from 'ionic-angular';
import { ProductService } from '../../app/services/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CodeDisplayPage } from '../code-display/code-display';
import { Storage } from '@ionic/storage';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { NoInternetPage } from '../no-internet/no-internet';

@IonicPage()
@Component({
  selector: 'page-generate-code',
  templateUrl: 'generate-code.html',
})
export class GenerateCodePage {

  public codeType;
  public functionType;
  public userId;
  public shareId;

  public generateCodeForm: FormGroup;

  @ViewChild('barcode') barcode: ElementRef;

  constructor(public navCtrl: NavController, public navParams: NavParams, public productService: ProductService, public fb: FormBuilder, public actionSheetController: ActionSheetController, public modalCtrl: ModalController, public http: Http, public loadingCtrl: LoadingController, public storage: Storage) {

    this.codeType = this.navParams.get('type');
    this.functionType = this.navParams.get('functionType');

    this.storage.get('userId').then(
      res => this.userId = res,
      err => this.productService.showAlert('Error', '', err)
    );

    this.storage.get('userShareId').then(
      res => this.shareId = res,
      err => this.productService.showAlert('Error', '', err)
    );

    this.generateCodeForm = this.fb.group({
      'serialNo': ['', Validators.compose([Validators.minLength(5), Validators.maxLength(25), Validators.pattern('^[a-zA-Z0-9]+$'), Validators.required])],

      'department': ['', Validators.required],

      'referenceNo': ['', Validators.compose([Validators.minLength(1), Validators.maxLength(25), Validators.pattern('^[a-zA-Z0-9/_-].*?$'), Validators.required])],

      'productType': ['', Validators.required],

      'dateOfPurchase': ['', Validators.required],

      'productCost': ['', Validators.compose([Validators.minLength(2), Validators.maxLength(15), Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$'), Validators.required])]
    });

    this.checkInternet();
  }

  ngOnInit() {
    if (this.checkInternet() != false) {
      if (this.functionType == 'storeBarcode') {
        this.generateCodeForm.patchValue({
          'serialNo': this.navParams.get('codeSerial')
        });
      }
    }
  }

  generateCode() {
    if (this.codeType == 'barcode') {
      let headers = new Headers();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });

      let data = {
        mode: "checkBarcodeAndQrCodeSerial",
        serial_number: this.generateCodeForm.value.serialNo.trim(),
        share_id: this.shareId
      };

      let loader = this.loadingCtrl.create({
        content: 'Checking whether details of barcode are already saved in the storage...',
        cssClass: 'fontChange fontSize'
      });

      loader.present().then(() => {
        this.http.post('http://your.server-url.com/check_data.php', data, options).map(res => res.json()).subscribe((res) => {
            loader.dismiss();
            if (res == "Not present") {
              headers.append("Accept", 'application/json');
              headers.append('Content-Type', 'application/json');
              let options = new RequestOptions({ headers: headers });

              let form = this.generateCodeForm.value;

              let data = {
                mode: "addBarcodeAndQrCode",
                serial_number: form.serialNo.trim(),
                department: form.department,
                reference_number: form.referenceNo.trim(),
                product_type: form.productType,
                date_of_purchase: form.dateOfPurchase,
                product_cost: form.productCost,
                code_format: 'CODE_128',
                id_of_scanner: this.userId,
                share_id: this.shareId
              };

              let loader = this.loadingCtrl.create({
                content: 'Storing barcode details...',
                cssClass: 'fontChange fontSize'
              });

              loader.present().then(() => {
                this.http.post('http://your.server-url.com/add_data.php', data, options).map(res => res.json())
                  .subscribe(res => {
                    loader.dismiss();
                    if (res == "Added successfully") {
                      this.productService.showToast('Barcode details saved successfully.', 'bottom');
                    } 
                    else {
                      this.productService.showAlert('Failed to save the barcode details', '', res);
                    }
                    this.generateCodeForm.patchValue({
                      'serialNo': '',
                      'department': '',
                      'referenceNo': '',
                      'productType': '',
                      'productCost': '',
                      'dateOfPurchase': ''
                    });
                  });
              });
              let modal = this.modalCtrl.create(CodeDisplayPage, {'codeType': 'barcode', 'value': this.generateCodeForm.value.serialNo});
              modal.present();
            } else {
              this.productService.showAlert('Already' + res, '', 'Details of barcode generated are already present in the storage.');
          }
        },
        err => this.productService.showAlert('Error', '', err)
        );
      });
    } else {
      const actSheet = this.actionSheetController.create({
        title: 'Choose an option',
        buttons: [{
          text: 'Just generate QR code',
          icon: 'md-qr-scanner',
          cssClass: 'fontChange fontSize',
          handler: () => {
            let modal = this.modalCtrl.create(CodeDisplayPage, {'codeType': 'qrCode', 'value': JSON.stringify(this.generateCodeForm.value)});
            modal.present();
          }
        }, {
          text: 'Generate QR code and store it in the storage',
          icon: 'md-cloud-upload',
          cssClass: 'fontChange fontSize',
          handler: () => {
            let headers = new Headers();
            headers.append("Accept", 'application/json');
            headers.append('Content-Type', 'application/json');
            let options = new RequestOptions({ headers: headers });

            let data = {
              mode: "checkBarcodeAndQrCodeSerial",
              serial_number: this.generateCodeForm.value.serialNo,
              share_id: this.shareId
            };

            let loader = this.loadingCtrl.create({
              content: 'Checking whether details of QR code are already saved in the storage...',
              cssClass: 'fontChange fontSize'
            });

            loader.present().then(() => {
              this.http.post('http://your.server-url.com/check_data.php', data, options).map(res => res.json()).subscribe((res) => {
                  loader.dismiss();
                  if (res == "Not present") {
                    headers.append("Accept", 'application/json');
                    headers.append('Content-Type', 'application/json');
                    let options = new RequestOptions({ headers: headers });

                    let form = this.generateCodeForm.value;
                    let data = {
                      mode: "addBarcodeAndQrCode",
                      serial_number: form.serialNo,
                      department: form.department,
                      reference_number: form.referenceNo,
                      product_type: form.productType,
                      date_of_purchase: form.dateOfPurchase,
                      product_cost: form.productCost,
                      code_format: 'QR_CODE',
                      id_of_scanner: this.userId,
                      share_id: this.shareId
                    };

                    let loader = this.loadingCtrl.create({
                      content: 'Storing QR code details...',
                      cssClass: 'fontChange fontSize'
                    });

                    loader.present().then(() => {
                      this.http.post('http://your.server-url.com/add_data.php', data, options).map(res => res.json())
                        .subscribe(res => {
                          loader.dismiss();
                          if (res == "Added successfully") {
                            this.productService.showToast('QR code details saved successfully.', 'bottom');
                          } 
                          else {
                            this.productService.showAlert('Failed to save the QR code details', '', res);
                          }
                          this.generateCodeForm.patchValue({
                            'serialNo': '',
                            'department': '',
                            'referenceNo': '',
                            'productType': '',
                            'productCost': '',
                            'dateOfPurchase': ''
                          });
                        });
                    });
                    let modal = this.modalCtrl.create(CodeDisplayPage, {'codeType': 'qrCode', 'value': JSON.stringify(this.generateCodeForm.value)});
                    modal.present();
                  } else {
                    this.productService.showAlert('Already' + res, '', 'Details of QR code generated are already present in the storage.');
                    }
                  },
                  err => this.productService.showAlert('Error', '', err)
                  );
                });
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'fontChange fontSize'
        }],
        cssClass: 'fontChange fontSize'
      });
      actSheet.present();
    }
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