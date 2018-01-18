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
      let comments: Comment[] = [];
      return this.afs.collection<Comment>(`events/${eventId}/comments`, (ref) => ref.orderBy('createdAt', 'asc')).snapshotChanges().switchMap((actions) => {
        let newComments: Comment[] = actions.map((a) => {
          const data = a.payload.doc.data() as Comment;
          return { 
            id: a.payload.doc.id, 
            text: data.text, 
            userId: data.userId,
            user: data.user,
            createdAt: data.createdAt 
          };
        });
        
        for(let newComment of newComments) {
          let isNewCommentInComments = false;
          for (let comment of comments) {
            if(comment.id === newComment.id) {
              isNewCommentInComments = true;
            }
          }
          if(!isNewCommentInComments) {
            this.afs.doc<User>(`users/${newComment.userId}`).valueChanges().take(1).toPromise().then( (user) => {
              newComment.user = user;
              comments.push(newComment);
            });
          }
        }

        comments.forEach( (comment, i) => {
          let isCommentInNewComments = false;
          for(let newComment of newComments) {
            if(newComment.id === comment.id){
              isCommentInNewComments = true;
            }
          }
          if(!isCommentInNewComments) {
            comments.splice(i,1);
          }
        });
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
