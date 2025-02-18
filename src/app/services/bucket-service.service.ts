import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BucketServiceService {

  private urlBucket = 'http://localhost:3000/buckets';
  private urlLocation = 'http://localhost:3000/locations';
  
  constructor(private http: HttpClient) { }

  getBuckets(): Observable<any[]> {
    return this.http.get<any[]>(this.urlBucket);
  }

  getLocations(): Observable<{ id: string; name: string }[]> {
    return this.http.get<{ id: string; name: string }[]>(this.urlLocation);
  }

  pushBucket(bucket: { name: string; location: string }): Observable<any> {
    return this.http.post<any>(this.urlBucket, bucket);  
  }

  getBucketById(bucketId: string): Observable<any> {
    return this.http.get<any>(`${this.urlBucket}/${bucketId}`);
  }
  
  getFilesById(bucketId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlBucket}/${bucketId}`);
  }

  pushFile(bucketId: string, newFile: any): Observable<any> {
    return this.getBucketById(bucketId).pipe(
      map(bucket => {
        const updatedFiles = [...bucket.files, newFile];
        return this.http.patch(`${this.urlBucket}/${bucketId}`, { files: updatedFiles }).subscribe();
      })
    );
  }

  deleteFile(bucketId: string, fileName: string): Observable<any> {
    return this.getBucketById(bucketId).pipe(
      map(bucket => {
        const updatedFiles = bucket.files.filter((file: any) => file.name !== fileName);
        return this.http.patch(`${this.urlBucket}/${bucketId}`, { files: updatedFiles }).subscribe();
      })
    );
  }
}
