import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { AuthService } from '../../services/auth.service';
import { CommentService } from '../../services/comment.service';
import { EventService } from '../../services/event.service';
import { ParticipantService } from '../../services/participant.service';

import { EventFormPage } from '../event-form/event-form';

import { Event } from '../../entities/event';
import { User } from '../../entities/user';
import { Comment } from '../../entities/comment';

import { UploadService } from '../../services/upload.service';
import { Upload } from '../../entities/upload';
import * as _ from "lodash";

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-event-detail',
  templateUrl: 'event-detail.html',
})
export class EventDetailPage {

  firebaseObservableParticipate: any;
  firebaseObservableEvent: any;
  eventId = this.navParams.data.id;
  event: Event = new Event();
  participate: boolean = false;
  participants: User[] = [];
  userId: string;
  comments: Comment[] = [];
  newComment: string = "";
  eventTab='participants';
  eventAvatarUrl: string = "";
  selectedFiles: FileList;
  currentUpload: Upload;
  fileUploaded: Upload;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public alertCtrl: AlertController,
    private auth: AuthService, 
    private eventService: EventService, 
    private participantService: ParticipantService, 
    private commentService: CommentService,
    private uploadService: UploadService) { }

  ionViewDidLoad() {

    this.userId = this.auth.user.uid;
    this.getEvent();
    this.getParticipants();
    this.getComments();
    this.firebaseObservableParticipate = this.participantService.isUserParticipating(this.userId, this.eventId).subscribe( participant => {
      if(participant != null) {
        this.participate = true;
      }
    });
    this.uploadService.getUploadsWithMetaInfo('events', this.eventId).map( arr => arr[0]).subscribe((upload) => {
      this.fileUploaded = upload;
    });
  }

  ionViewWillUnload() {
    this.firebaseObservableParticipate.unsubscribe();
    this.firebaseObservableEvent.unsubscribe();
  }

  showAlert(title: string, msg: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  getEvent(): void {
    this.firebaseObservableEvent = this.eventService.getEvent(this.eventId).valueChanges().subscribe( (event) => {
      this.event = event;
      this.eventAvatarUrl = "./assets/imgs/" + this.event.discipline + ".png";
    });
  }

  getParticipants() {
    this.participantService.getParticipants(this.eventId).then( (participants) => {
      this.participants = participants;
    })
  }

  getComments() {
    this.commentService.getComments(this.eventId).then( (comments) => {
      this.comments = comments;
    });
  }

  setParticipation(): void {
    if(this.participate) {
      this.participantService.createParticipant(this.userId, this.eventId);
    } else {
      this.participantService.deleteParticipant(this.userId, this.eventId);
    }
    this.getParticipants();
  }

  editEvent() {
    this.navCtrl.push(EventFormPage, {
      event: this.event,
      eventId: this.eventId
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
      this.uploadService.pushUpload(this.currentUpload, 'events', this.eventId).then( (imageURL) => {
        this.eventService.getEventPromise(this.eventId).then( (event) => {
          event.imageURL = imageURL;
          this.eventService.updateEvent(this.eventId, event);
        });
      });
    }
  }

  pressFileUploaded(upload: Upload) {
    if(this.event.owner!=this.userId) {
      return
    }
    let confirm = this.alertCtrl.create({
      title: 'Delete image',
      message: 'If you confirm this dialog, the image attached to the event will permanently be deleted.',
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
            this.uploadService.deleteUpload(upload, 'events', this.eventId);
            this.eventService.getEventPromise(this.eventId).then( (event) => {
              event.imageURL = "";
              this.eventService.updateEvent(this.eventId, event);
            });
          }
        }
      ]
    });
    confirm.present();
  }

  createComment() {
    this.commentService.createComment(this.eventId,this.userId,this.newComment).then( () => {
      this.newComment = "";
      this.getComments();
    });
  }

  pressComment(comment: Comment) {
    if(comment.userId!=this.userId) {
      return
    }

    let confirm = this.alertCtrl.create({
      title: 'Delete comment',
      message: 'Do you want to delete this comment?',
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
            this.commentService.deleteComment(this.eventId, comment.id).then( () => {
              this.getComments();
            });
          }
        }
      ]
    });
    confirm.present();
  }

}