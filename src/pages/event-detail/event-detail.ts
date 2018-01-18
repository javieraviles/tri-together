import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ViewController } from 'ionic-angular';

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
  firebaseObservableParticipants: any;
  firebaseObservableComments: any;
  firebaseObservableParticipate: any;
  firebaseObservableEvent: any;
  firebaseObservableUploads: any;
  eventId = this.navParams.data.id;
  event: Event = new Event();
  participate: boolean = false;
  participants: User[];
  userId: string;
  comments: Comment[];
  newComment: string = "";
  eventTab = this.navParams.data.tab;
  eventAvatarUrl: string = "";
  selectedFiles: FileList;
  currentUpload: Upload;
  fileUploaded: Upload;
  enableCommentInput: boolean = false;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtrl: ViewController,
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
    this.getUploads();
    this.getParticipation();

  }

  ionViewWillUnload() {
    this.firebaseObservableParticipate.unsubscribe();
    this.firebaseObservableEvent.unsubscribe();
    this.firebaseObservableUploads.unsubscribe();
    this.firebaseObservableParticipants.unsubscribe();
    this.firebaseObservableComments.unsubscribe();
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
      if(Boolean(event)){
        this.event = event;
        this.eventAvatarUrl = "./assets/imgs/" + this.event.discipline + ".png";
      } else {
        this.showAlert("Event deleted", "The event you had opened has been deleted");
        this.viewCtrl.dismiss();
      }
    });
  }

  editEvent() {
    this.navCtrl.push(EventFormPage, {
      event: this.event,
      eventId: this.eventId
    });
  }

  getParticipants() {
    this.firebaseObservableParticipants = this.participantService.getParticipants(this.eventId).subscribe((participants) => {
      this.participants = participants;
    });
  }

  getParticipation() {
    this.firebaseObservableParticipate = this.participantService.isUserParticipating(this.userId, this.eventId).subscribe( (participant) => {
      this.participate = Boolean(participant);
    });
  }

  setParticipation(): void {
    if(this.participate) {
      this.participantService.createParticipant(this.userId, this.eventId);
    } else {
      this.participantService.deleteParticipant(this.userId, this.eventId);
    }
  }

  getComments() {
    this.firebaseObservableComments = this.commentService.getComments(this.eventId).subscribe( (comments) => {
      this.comments = comments;
    });
  }

  createComment() {
    this.enableCommentInput = false;
    this.commentService.createComment(this.eventId,this.userId,this.newComment).then( () => {
      this.newComment = "";
    });
  }

  deleteComment(commentId: string) {
    this.commentService.deleteComment(this.eventId, commentId);
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
            this.deleteComment(comment.id);
          }
        }
      ]
    });
    confirm.present();
  }

  getUploads() {
    this.firebaseObservableUploads = this.uploadService.getUploadsWithMetaInfo('events', this.eventId).map( arr => arr[0]).subscribe((upload) => {
      this.fileUploaded = upload;
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
        this.currentUpload = null;
        this.eventService.getEvent(this.eventId).valueChanges().subscribe( (event) => {
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
            this.eventService.getEvent(this.eventId).valueChanges().subscribe( (event) => {
              event.imageURL = "";
              this.eventService.updateEvent(this.eventId, event);
            });
          }
        }
      ]
    });
    confirm.present();
  }
}