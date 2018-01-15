import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { Upload } from '../entities/upload';

import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

@Injectable()
export class UploadService {
  constructor(private afs: AngularFirestore) { }
  uploads: AngularFirestoreCollection<Upload[]>;

  pushUpload(upload: Upload, path:string, entityId: string) {
    return new Promise<string>((resolve,reject) => {
      let storageRef = firebase.storage().ref();
      let uploadTask = storageRef.child(`${path}/${entityId}/${upload.file.name}`).put(upload.file);

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) =>  {
          // upload in progress
          upload.progress = (uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100
        },
        (error) => {
          // upload failed
          console.log(error)
        },
        () => {
          // upload success
          upload.url = uploadTask.snapshot.downloadURL;
          upload.name = upload.file.name;
          this.saveFileData(upload, path, entityId);
          resolve(upload.url);
        }
      );
    });
  }
  
  private saveFileData(upload: Partial<Upload>, path:string, entityId: string) {
    const uploadObject = {name: upload.name, url: upload.url, progress: upload.progress, createdAt: upload.createdAt };
    this.afs.collection(`${path}/${entityId}/uploads`).add(uploadObject);
  }

  getUploads(path: string, entityId: string) {
    return this.afs.collection<Upload>(`${path}/${entityId}/uploads`).valueChanges();
  }

  getUploadsWithMetaInfo(path: string, entityId: string): Observable<Upload[]> {
    // ['added', 'modified', 'removed']
    return this.afs.collection<Upload>(`${path}/${entityId}/uploads`).snapshotChanges().map((actions) => {
      return actions.map((a) => {
        const data = a.payload.doc.data() as Upload;
        return { 
          $key: a.payload.doc.id, 
          name: data.name, 
          url: data.url,
          createdAt: data.createdAt,
          file: data.file,
          progress: data.progress
        };
      });
    });
  }

  deleteUpload(upload: Upload, path: string, entityId: string) {
    this.deleteFileData(upload.$key, path, entityId)
    .then( () => {
      this.deleteFileStorage(upload.name, path, entityId)
    })
    .catch(error => console.log(error))
  }
  
  private deleteFileData(key: string, path: string, entityId: string) {
    return this.afs.doc(`${path}/${entityId}/uploads/${key}`).delete();
  }
  // Firebase files must have unique names in their respective storage dir
  // So the name serves as a unique key
  private deleteFileStorage(fileName:string, path:string, entityId: string) {
    let storageRef = firebase.storage().ref();
    storageRef.child(`${path}/${entityId}/${fileName}`).delete()
  }
}