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
      return this.afs.collection<Comment>(`events/${eventId}/comments`, (ref) => ref.orderBy('createdAt', 'desc')).snapshotChanges().switchMap((actions) => {
        let comments = actions.map((a) => {
          const data = a.payload.doc.data() as Comment;
          return { 
            id: a.payload.doc.id, 
            text: data.text, 
            userId: data.userId,
            user: data.user,
            createdAt: data.createdAt 
          };
        });
        for(let comment of comments) {
          this.afs.doc<User>(`users/${comment.userId}`).valueChanges().take(1).subscribe( (user) => {
            comment.user = user;
          });
        }
        return Observable.of(comments);
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
        let modifiedEvent = event.payload.data();
        modifiedEvent.numberOfComments++;
        this.eventService.updateEvent(eventId, modifiedEvent);
      });
    });
  }

  deleteComment(eventId: string, commentId: string) {
    return this.afs.doc<Comment>(`events/${eventId}/comments/${commentId}`).delete().then( () => {
      this.eventService.getEventPromise(eventId).then( (event) => {
        let modifiedEvent = event.payload.data();
        modifiedEvent.numberOfComments--;
        this.eventService.updateEvent(eventId, modifiedEvent);
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
