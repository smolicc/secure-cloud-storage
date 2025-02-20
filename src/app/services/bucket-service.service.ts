import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Bucket } from '../models/bucket.model';
import { FileModel } from '../models/file.model';
import { Location } from '../models/location.model';

@Injectable({
  providedIn: 'root'
})
export class BucketServiceService {

  private urlBucket = 'http://localhost:3000/buckets';
  private urlLocation = 'http://localhost:3000/locations';
  
  constructor(private http: HttpClient) { }

  getBuckets(): Observable<Bucket[]> {
    return this.http.get<Bucket[]>(this.urlBucket);
  }

  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(this.urlLocation);
  }

  pushBucket(bucket: Bucket): Observable<Bucket> {
    return this.http.post<any>(this.urlBucket, bucket);  
  }

  getBucketById(bucketId: string): Observable<Bucket> {
    return this.http.get<any>(`${this.urlBucket}/${bucketId}`);
  }
  
  pushFile(bucketId: string, newFile: FileModel): Observable<any> {
    return this.getBucketById(bucketId).pipe(
      map(bucket => {
        const updatedFiles = [...bucket.files, newFile];
        return this.http.patch(`${this.urlBucket}/${bucketId}`, { files: updatedFiles }).subscribe();
      })
    );
  }

  deleteFile(bucketId: string, fileId: string): Observable<any> {
    return this.getBucketById(bucketId).pipe(
      map(bucket => {
        const updatedFiles = bucket.files.filter((file: FileModel) => file.id !== fileId);
        return this.http.patch(`${this.urlBucket}/${bucketId}`, { files: updatedFiles }).subscribe();
      })
    );
  }

  deleteBucket(bucketId: string): Observable<any> {
    return this.http.delete(`${this.urlBucket}/${bucketId}`);
  }
}
