import { Injectable } from "@angular/core";
import { AlertController, ToastController, LoadingController } from "ionic-angular";
import { Base64ToGallery } from "@ionic-native/base64-to-gallery";
import * as ssap from 'save-svg-as-png';
import QRious from 'qrious';
import JsBarcode from 'jsbarcode';
import { AndroidPermissions } from "@ionic-native/android-permissions";
import { Storage } from '@ionic/storage';
import { Http, RequestOptions, Headers } from "@angular/http";
import 'rxjs/add/operator/map';

@Injectable()
export class ProductService {

  constructor(public alertCtrl: AlertController, public toastCtrl: ToastController, public base64: Base64ToGallery, public androidPermissions: AndroidPermissions, public http: Http, public loadingCtrl: LoadingController, public storage: Storage) {

  }

  public departments = ['Computer Engg.', 'Information Technology Engg.', 'Mechanical Engg.', 'Electrical Engg.', 'Electronics Engg.', 'EXTC Engg.', 'Instrumentation Engg.', 'MMS', 'MCA'];

  public products = ['Monitor', 'Computer Mouse', 'Keyboard', 'Computer C. P. U.', 'Computer System', 'Printer', 'Scanner', 'Projector', 'Switching Hub', 'Router', 'Cable Modem', 'U. P. S.', 'Computer Antivirus', 'Digital Multimeter', 'Pulse Generator', 'Digital Frequency Meter', 'C. R. O.',  'Tubelight', 'Fan', 'Chair', 'Computer Desk', 'Bench'];

  public errorMessages = {
    firstName: [{
      type: 'required', message: 'First Name is required.'
    }, {
      type: 'minlength', message: 'Minimum length of first name should be 2.'
    }, {
      type: 'maxlength', message: 'Maximum length of first name should be 20.'
    }, {
      type: 'pattern', message: 'Enter valid first name.'
    }],

    lastName: [{
      type: 'required', message: 'Last Name is required.'
    }, {
      type: 'minlength', message: 'Minimum length of last name should be 3.'
    }, {
      type: 'maxlength', message: 'Maximum length of last name should be 30.'
    }, {
      type: 'pattern', message: 'Enter valid last name.'
    }],

    username: [{
      type: 'required', message: 'Username is required.'
    }, {
      type: 'minlength', message: 'Minimum length of username should be 5.'
    }],

    email: [{
      type: 'required', message: 'Email is required.'
    }, {
      type: 'pattern', message: 'Enter a valid email ID.'
    }],

    password: [{
      type: 'required', message: 'Password is required.'
    }, {
      type: 'minlength', message: 'Minimum length of password should be 5.'
    }],

    shareId: [{
      type: 'required', message: 'Sharing ID is required.'
    }, {
      type: 'minlength', message: 'Minimum length of Sharing ID should be 2.'
    }, {
      type: 'maxlength', message: 'Maximum length of Sharing ID should be 7.'
    }],

    department: [{
      type: 'required', message: 'Department is required.'
    }],

    dateOfPurchase: [{
      type: 'required', message: 'Date of Purchase is required.'
    }],

    productType: [{
      type: 'required', message: 'Product Type is required.'
    }],
    
    serialNo: [{
      type: 'required', message: 'Serial Number is required.'
    }, {
      type: 'pattern', message: 'Enter a valid Serial Number.'
    }, {
      type: 'minlength', message: 'Minimum length of Serial Number should be 5.'
    }, {
      type: 'maxlength', message: 'Maximum length of Serial Number should be 25.'
    }],

    referenceNo: [{
      type: 'required', message: 'Reference Number is required.'
    }, {
      type: 'pattern', message: 'Enter a valid Reference Number.'
    }, {
      type: 'minlength', message: 'Minimum length of Reference Number should be 1.'
    }, {
      type: 'maxlength', message: 'Maximum length of Reference Number should be 25.'
    }],

    productCost: [{
      type: 'required', message: 'Product Cost is required.'
    }, {
      type: 'pattern', message: 'Enter a valid Product Cost.'
    }, {
      type: 'minlength', message: 'Minimum length of Product Cost should be 2.'
    }, {
      type: 'maxlength', message: 'Maximum length of Product Cost should be 15.'
    }],
  };
  
  private gridList = [{
      text: 'User Account',
      image: 'assets/svgIcons/account.svg'
  },
  {
      text: 'Stored Records',
      image: 'assets/svgIcons/get-data.svg'
  },
  {
      text: 'Scan QR Code',
      image: 'assets/svgIcons/scan-qr-code.svg'
  },
  {
      text: 'Scan Barcode',
      image: 'assets/svgIcons/scan-barcode.svg'
  },
  {
      text: 'Generate QR Code',
      image: 'assets/svgIcons/generate-qr-code.svg'
  },
  {
      text: 'Generate Barcode',
      image: 'assets/svgIcons/generate-barcode.svg'
  }];

  getGridList() {
      return [...this.gridList];
  }

  getSpecificGridText(index) {
      return this.gridList[index].text
  }

  showAlert(header, middle, content) {
      let alert = this.alertCtrl.create({
          title: header,
          subTitle: middle,
          message: content,
          buttons: ['OK'],
          cssClass: 'fontChange fontSize'
      });
      alert.present();
  }

  showToast(content, side) {
      let toast = this.toastCtrl.create({
          message: content,
          duration: 1800,
          position: side,
          cssClass: 'fontChange'
      });
      toast.present();
  }

  saveBarcode(element) {
    ssap.svgAsPngUri(element, {
      scale: '1',
      backgroundColor: 'white'
    }).then(uri => {
        uri = String(uri);
        var splitted = uri.split(",", uri.length);
        this.base64.base64ToGallery(splitted[1], {
        prefix: 'IMG_',
        mediaScanner: false
      }).then(res => this.showToast('Image saved at: ' + res, 'bottom'),
        err => this.showToast(err, 'bottom')
      );
    });
  }

  saveQrCode(element) {
    var base64 = element.toDataURL('image/png');
    var splitted = base64.split(",", base64.length);
    this.base64.base64ToGallery(splitted[1], {
      prefix: 'IMG_',
      mediaScanner: false
    }).then(res => this.showToast('Image saved at: ' + res, 'bottom'),
      err => this.showToast(err, 'bottom')
    );
  }

  displayQrCode(domElement, codeValue) {
    var qr = new QRious({
      background: 'white',
      foreground: 'black',
      level: 'H',
      padding: 15,
      size: 280,
      element: domElement,
      value: codeValue
    });
  }

  displayBarcode(element, value) {
    JsBarcode(element, value, {
      format: 'code128',
      displayValue: true,
      lineColor: '#000',
    });
  }

  getStoragePermissions() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
      result => console.log('Has permission? => ', result.hasPermission),
      error => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
    );
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE]);
  }

  deleteRecord(userId, shareId, idOfScanner, serialNo) {
    if (userId == idOfScanner) {
      var headers = new Headers();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({
        headers: headers
      });

      let loader = this.loadingCtrl.create({
        content: "Deleting the stored record, please wait...",
        cssClass: 'fontChange fontSize'
      });

      let data = {
        mode: "deleteCodeRecord",
        serial_number: serialNo,
        share_id: shareId,
        id_of_scanner: idOfScanner
      }

      loader.present().then(() => {
        this.http.post('http://sidsk99.heliohost.org/dsr/delete_data.php', data, options)
          .map(res => res.json())
          .subscribe((res) => {
            loader.dismiss();
            if (res == 'Deleted successfully') {
              this.showAlert('Record deleted', '', 'The selected stored record has been deleted successfully.');
            } else {
              this.showAlert('Error', '', res);
            }
          },
          err => console.log(err)
        );
      });
    } else {
      this.showAlert('Record cannot be deleted', '', 'The details of the selected code record were not stored using your account and therefore it cannot be deleted using your account.');
    }
  }

  deleteUserAccount(userId) {
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({
      headers: headers
    });

    let loader = this.loadingCtrl.create({
      content: "Deleting your account, please wait...",
      cssClass: 'fontChange fontSize'
    });

    let data = {
      mode: "deleteUserAccount",
      id: userId
    }

    loader.present().then(() => {
      this.http.post('http://sidsk99.heliohost.org/dsr/delete_data.php', data, options)
        .map(res => res.json())
        .subscribe((res) => {
          loader.dismiss();
          if (res == 'Deleted successfully') {
            this.showAlert('Account Deleted', '', 'Your account and all the stored records associated with it have been deleted successfully.');
            this.storage.clear();
          } else {
            this.showAlert('Error', '', res);
          }
        },
        err => console.log(err)
      );
    });
  }
}