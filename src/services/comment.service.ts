import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { Comment } from '../entities/comment';
import { User } from '../entities/user';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CommentService {

  constructor(private afs: AngularFirestore) { }

  getComments(eventId: string) {
    return new Promise<Comment[]>((resolve,reject) => {
      this.afs.collection<Comment>(`events/${eventId}/comments`, (ref) => ref.orderBy('createdAt', 'desc')).valueChanges().subscribe( (comments) => {
        for(let comment of comments) {
          this.afs.doc<User>(`users/${comment.userId}`).valueChanges().subscribe( (user) => {
            comment.user = user;
          });
        }
        resolve(comments);
      });
    });
  }

  getNumberOfComments(eventId: string) {
    return new Promise<number>((resolve,reject) => {
      this.afs.collection<Comment>(`events/${eventId}/comments`).valueChanges().subscribe( comments => {
        resolve(comments.length);
      });
    });
  }

  createComment(eventId: string, userId: string, newComment: string) {
    const comment = {
      userId: userId,
      text: newComment,
      createdAt: new Date()
    }
    return this.afs.collection<Comment>(`events/${eventId}/comments`).add(comment);
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
