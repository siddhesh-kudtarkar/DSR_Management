import { Component } from '@angular/core';
import { NavController, ToastController, ActionSheetController, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { ProductService } from '../../app/services/product.service';
import { UserAccountPage } from '../user-account/user-account';
import { GetDataPage } from '../get-data/get-data';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
import { GenerateCodePage } from '../generate-code/generate-code';
import { ModalPage } from '../modal/modal';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Http, RequestOptions, Headers } from '@angular/http';
import { CodeDetailsPage } from '../code-details/code-details';
import { NoInternetPage } from '../no-internet/no-internet';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  gridList = [];
  index: number;
  pageText;
  public userId;
  public shareId;

  constructor(public navCtrl: NavController, public productService: ProductService, private storage: Storage, public toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController, public modalCtrl: ModalController, public barcodeScanner: BarcodeScanner, public http: Http, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    this.storage.get('userId').then(
      res => this.userId = res,
      err => this.productService.showAlert('Error', '', err) 
    );
    
    this.storage.get('userShareId').then(
      res => this.shareId = res,
      err => this.productService.showAlert('Error', '', err) 
    );

  }

  ngOnInit() {
    this.gridList = this.productService.getGridList();
    this.checkInternet();
  }

  getPageTitle(index) {
    this.pageText = this.productService.getSpecificGridText(index);
    if (this.pageText === "User Account") {
      this.storage.get('userType').then(
        (res) => {
          if (res == "Guest") {
            this.productService.showAlert('Feature unavailable', '', 'Register your account to enable other features.');
          } else {
            this.navCtrl.push(UserAccountPage);
          }
        },
        err => this.productService.showAlert('Error', '', err)
      );
    }
    else if (this.pageText === "Stored Records") {
      this.storage.get('userType').then(
        (res) => {
          if (res == "Guest") {
            this.productService.showAlert('Feature unavailable', '', 'Register your account to enable other features.');
          } else {
            this.navCtrl.push(GetDataPage);
          }
        },
        err => this.productService.showAlert('Error', '', err)
      );
    }
    else if (this.pageText === "Scan QR Code") {
      this.storage.get('userType').then(
        (res) => {
          this.scanQrCode(res);
        },
        (err) => {
          console.log(err);
        }
      );
    }
    else if (this.pageText === "Scan Barcode") {
      this.storage.get('userType').then(
        (res) => {
          this.scanBarcode(res);
        },
        (err) => {
          console.log(err);
        }
      );
    }
    else if (this.pageText === "Generate QR Code") {
      this.storage.get('userType').then(
        (res) => {
          if (res == 'Guest') {
            this.productService.showAlert('Feature unavailable', '', 'Generation of QR code is not available for guest users.');
          } else {
            this.navCtrl.push(GenerateCodePage);
          }
        },
        (err) => {
          this.productService.showToast(err, 'bottom');
        }
      );
    }
    else if (this.pageText === "Generate Barcode") {
      this.storage.get('userType').then(
        (res) => {
          if (res == 'Guest') {
            this.productService.showAlert('Feature unavailable', '', 'Generation of Barcode is not available for guest users.');
          } else {
            const actSheet = this.actionSheetCtrl.create({
              title: 'Choose an option',
              buttons: [{
                text: 'Just generate Barcode',
                handler: () => {
                  let modal = this.modalCtrl.create(ModalPage);
                  modal.present();
                },
                icon: 'md-barcode',
                cssClass: 'fontChange fontSize'
              }, {
                text: 'Generate Barcode and store it in the storage along with its details',
                handler: () => {
                  this.navCtrl.push(GenerateCodePage, {'type': 'barcode'});
                },
                icon: 'md-cloud-upload',
                cssClass: 'fontChange fontSize'
              }, {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'fontChange fontSize'
              }],
              cssClass: 'fontChange fontSize'
            });
            actSheet.present();
          }       
        },
        (err) => {
          this.productService.showToast(err, 'bottom');
        }
      );
    }
  }

  logout() {
    this.storage.clear().then(
      (res) => console.log(res),
      err => console.log(err)
    );
    this.navCtrl.setRoot(LoginPage);
    this.productService.showToast('Logged out successfully', 'bottom');
  }

  scanBarcode(userType) {
    if (userType == 'Guest') {
      this.barcodeScanner.scan({
        showTorchButton: true,
        prompt: 'Place a barcode inside the scan area.',
        resultDisplayDuration: 500,
        formats: 'UPC_A,UPC_E,EAN_8,EAN_13,RSS14,CODE_39,CODE_93,CODE_128,ITF,CODABAR,MSI,RSS_EXPANDED'
      }).then((res) => {
        if (res.cancelled == false) {
          if (res.format == ('QR_CODE' || 'DATA_MATRIX' || 'PDF_417' || 'AZTEC')) {
            this.productService.showAlert('Invalid barcode format', '', 'Please scan a valid barcode to proceed.');
          } else {
            this.productService.showAlert('Barcode details:', '', 'Text: ' + res.text + '\n' + 'Format: ' + res.format); 
          }
        } else {
          this.productService.showAlert("Error", '', "Don't cancel the scanning process in between");
        }
      }).catch(err => {
        this.productService.showAlert('Error', '', err);
      });
    } else {
      this.barcodeScanner.scan({
        showTorchButton: true,
        prompt: 'Place a barcode inside the scan area.',
        resultDisplayDuration: 500,
        formats: 'UPC_A,UPC_E,EAN_8,EAN_13,RSS14,CODE_39,CODE_93,CODE_128,ITF,CODABAR,MSI,RSS_EXPANDED'
      }).then((res) => {
          if (res.cancelled == false) {
            if (res.format == ('QR_CODE' || 'DATA_MATRIX' || 'PDF_417' || 'AZTEC')) {
              this.productService.showAlert('Invalid barcode format', '', 'Please scan a valid barcode to proceed.');
            } else {
              let headers = new Headers();
              headers.append("Accept", 'application/json');
              headers.append('Content-Type', 'application/json');
              let options = new RequestOptions({ headers: headers });

              let data = {
                mode: "checkBarcodeAndQrCodeSerial",
                serial_number: res.text,
                share_id: this.shareId
              };

              let code = res;

              let loader = this.loadingCtrl.create({
                content: 'Checking whether details of barcode are already saved in the storage...',
                cssClass: 'fontChange fontSize'
              });

              loader.present().then(() => {
                this.http.post('http://sidsk99.heliohost.org/dsr/check_data.php', data, options).map((res) => res.json()).subscribe((res) => {
                    loader.dismiss();
                    if (res == "Not present") {
                      this.navCtrl.push(GenerateCodePage, {
                        'type': 'barcode',
                        'functionType': 'storeBarcode',
                        'codeSerial': code.text,
                        'codeFormat': code.format
                      }).then(
                        () => {
                          this.productService.showToast('Fill the rest of the details', 'bottom');
                      },
                      err => this.productService.showAlert('Error', '', err)
                      );
                    } else {
                      this.navCtrl.push(CodeDetailsPage, {
                        'codeSerial': code.text
                      }).then(
                        () => {
                          this.productService.showToast('Details of barcode are already present in the storage', 'bottom');
                        },
                        err => console.log(err) 
                      );
                  }
                });
              });
            }
          } else {
            this.productService.showToast('Scanning process cancelled', 'bottom');
        }
      },
      err => this.productService.showAlert('Error', '', err)
    );
    }
  }

  scanQrCode(userType) {
    if (userType == 'Guest') {
      this.barcodeScanner.scan({
        showFlipCameraButton: true,
        showTorchButton: true,
        prompt: 'Place a QR code inside the scan area.',
        formats: 'QR_CODE,DATA_MATRIX,PDF_417,AZTEC'
      }).then((res) => {
        if (res.cancelled == false) {
          if (res.format == ('QR_CODE' || 'DATA_MATRIX' || 'PDF_417' || 'AZTEC')) {
            this.productService.showAlert('QR Code details:', '', 'Text: ' + res.text + '\n' + 'Format: ' + res.format);
          } else {
            this.productService.showAlert('Invalid QR code format', '', 'Please scan a valid QR code to proceed.');
          }
        } else {
          this.productService.showToast('Scanning process cancelled', 'bottom');
        }
      },
      err => this.productService.showAlert('Error', '', err)
      );
    } else {
      this.barcodeScanner.scan({
        showFlipCameraButton: true,
        showTorchButton: true,
        prompt: 'Place a QR code inside the scan area.',
        formats: 'QR_CODE,DATA_MATRIX,PDF_417,AZTEC'
      }).then((res) => {
          if (res.cancelled == false) {
            if (res.format == ('QR_CODE' || 'DATA_MATRIX' || 'PDF_417' || 'AZTEC')) {
              let headers = new Headers();
              headers.append("Accept", 'application/json');
              headers.append('Content-Type', 'application/json');
              let options = new RequestOptions({ headers: headers });

              let data = {
                mode: "checkBarcodeAndQrCodeSerial",
                serial_number: JSON.parse(res.text).serialNo,
                share_id: this.shareId
              };

              let code = JSON.parse(res.text);
              let codeFormat = res.format;

              let loader = this.loadingCtrl.create({
                content: 'Checking whether details of QR code are already saved in the storage...',
                cssClass: 'fontChange fontSize'
              });

              loader.present().then(() => {
                this.http.post('http://sidsk99.heliohost.org/dsr/check_data.php', data, options).map((res) => res.json()).subscribe((res) => {
                    loader.dismiss();
                    if (res == "Not present") {
                      const alert = this.alertCtrl.create({
                        title: 'Store details?',
                        message: 'Details of the scanned QR code are not present in the storage. Would you like to store the details of this QR code in the storage?',
                        buttons: [{
                          text: 'No',
                          role: 'cancel',
                          cssClass: 'fontChange fontSize'
                        }, {
                          text: 'Yes',
                          handler: () => {
                            headers.append("Accept", 'application/json');
                            headers.append('Content-Type', 'application/json');
                            let options = new RequestOptions({ headers: headers });
                            
                            let data = {
                              mode: "addBarcodeAndQrCode",
                              serial_number: code.serialNo,
                              department: code.department,
                              reference_number: code.referenceNo,
                              product_type: code.productType,
                              date_of_purchase: code.dateOfPurchase,
                              product_cost: code.productCost,
                              code_format: codeFormat,
                              id_of_scanner: this.userId,
                              share_id: this.shareId
                            };

                            let loader = this.loadingCtrl.create({
                              content: 'Storing QR code details...',
                              cssClass: 'fontChange fontSize'
                            });

                            loader.present().then(() => {
                              this.http.post('http://sidsk99.heliohost.org/dsr/add_data.php', data, options).map(res => res.json())
                                .subscribe(res => {
                                  loader.dismiss();
                                  if (res == "Added successfully") {
                                    this.productService.showToast('QR code details saved successfully.', 'bottom');
                                  } 
                                  else {
                                    this.productService.showAlert('Failed to save the QR code details', '', res);
                                  }
                                });
                            });
                          },
                          cssClass: 'fontChange fontSize'
                        }],
                        cssClass: 'fontChange fontSize'
                      });
                      alert.present();
                    } else {
                      this.navCtrl.push(CodeDetailsPage, {
                        'codeSerial': code.serialNo
                      }).then(
                        () => {
                          this.productService.showToast('Details of QR code are already present in the storage', 'bottom');
                        },
                        err => console.log(err) 
                      );
                  }
                });
              });
            } else {
              this.productService.showAlert('Invalid QR code format', '', 'Please scan a valid QR code to proceed.');
            }
          } else {
            this.productService.showToast('Scanning process cancelled', 'bottom');
          }
        },
        err => this.productService.showAlert('Error', '', err)
        );
    }
  }

  checkInternet() {
    if (navigator.onLine == false) {
      this.navCtrl.setRoot(NoInternetPage);
      return false;
    }
    else {
      return true;
    }
  }
}