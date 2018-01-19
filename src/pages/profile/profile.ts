import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';

import { UploadService } from '../../services/upload.service';
import { Upload } from '../../entities/upload';
import * as _ from "lodash";

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  firebaseObservableUploads: any;
  userId: string;
  selectedFiles: FileList;
  currentUpload: Upload;
  picUploaded: Upload;

  constructor(public navCtrl: NavController, 
    public auth: AuthService,
    public alertCtrl: AlertController,
    private uploadService: UploadService) { }

    ionViewDidLoad() {
      this.userId = this.auth.user.uid;
      this.getUploads();
    }

    ionViewWillUnload() {
      this.firebaseObservableUploads.unsubscribe();
    }

    swipeMainTab(event: any): void {
      if(event.direction === 4) {
        this.navCtrl.parent.select(0);
      }
    }

    showAlert(title: string, msg: string) {
      let alert = this.alertCtrl.create({
        title: title,
        subTitle: msg,
        buttons: ['OK']
      });
      alert.present();
    }

    getUploads() {
      this.firebaseObservableUploads = this.uploadService.getUploadsWithMetaInfo('users', this.userId).map( arr => arr[0]).subscribe((upload) => {
        this.picUploaded = upload;
      });
    }
  
    detectFiles(event) {
      let file = event.target.files.item(0);
      if(file.size > 5242880) {
        this.showAlert('Upload error', 'File size must be smaller than 5mb');
      } else if (!file.type.startsWith('image')) {
        this.showAlert('Upload error', 'File must be an image');
      } else {
        this.currentUpload = new Upload(file);
        this.uploadService.pushUpload(this.currentUpload, 'users', this.userId).then( (photoURL) => {
          this.currentUpload = null;
          this.auth.updateProfilePic(photoURL);
        });
      }
    }
  
    pressProfilePic() {
      let confirm = this.alertCtrl.create({
        title: 'Delete photo',
        message: 'If you confirm this dialog, your profile picture will permanently be deleted.',
        buttons: [
          {
            text: 'No',
            handler: () => {
              console.log('No clicked');
            }
          },
          {
            text: 'Yes',
            handler: () => {
              this.uploadService.deleteUpload(this.picUploaded, 'users', this.userId);
              this.auth.updateProfilePic('');
            }
          }
        ]
      });
      confirm.present();
    }
}
