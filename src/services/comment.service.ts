import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { EventService } from './event.service';

import { Comment } from '../entities/comment';
import { User } from '../entities/user';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CommentService {

  constructor(private afs: AngularFirestore, private eventService: EventService) { }

  getComments(eventId: string) {
    return new Promise<Comment[]>((resolve,reject) => {
      this.afs.collection<Comment>(`events/${eventId}/comments`, (ref) => ref.orderBy('createdAt', 'desc')).snapshotChanges().map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data() as Comment;
          return { 
            id: a.payload.doc.id, 
            text: data.text, 
            userId: data.userId,
            user: data.user,
            createdAt: data.createdAt 
          };
        });
      }).subscribe( (comments) => {
        for(let comment of comments) {
          this.afs.doc<User>(`users/${comment.userId}`).valueChanges().subscribe( (user) => {
            comment.user = user;
          });
        }
        resolve(comments);
      });
    });
  }

  createComment(eventId: string, userId: string, newComment: string) {
    const comment = {
      userId: userId,
      text: newComment,
      createdAt: new Date()
    }

    return this.afs.collection<Comment>(`events/${eventId}/comments`).add(comment).then( () => {
      this.eventService.getEventPromise(eventId).then( (event) => {
        event.numberOfComments++;
        this.eventService.updateEvent(eventId, event);
      });
    });
  }

  deleteComment(eventId: string, commentId: string) {
    return this.afs.doc<Comment>(`events/${eventId}/comments/${commentId}`).delete().then( () => {
      this.eventService.getEventPromise(eventId).then( (event) => {
        event.numberOfComments--;
        this.eventService.updateEvent(eventId, event);
      });
    });
  }

  deleteComments(eventId: string) {
    return this.afs.collection<Comment>(`events/${eventId}/comments`)
      .snapshotChanges().forEach(actions => {
        for (let action of actions) {
          const commentId = action.payload.doc.id;
          return this.afs.doc<Comment>(`events/${eventId}/comments/${commentId}`).delete();
        }
      });
  }

}
