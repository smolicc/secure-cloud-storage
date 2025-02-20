import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BucketServiceService } from '../../services/bucket-service.service';
import { v4 as uuidv4 } from 'uuid';
import { Bucket } from '../../models/bucket.model';
import { FileModel } from '../../models/file.model';

@Component({
  selector: 'app-bucket-details',
  imports: [CommonModule],
  templateUrl: './bucket-details.component.html',
  styleUrl: './bucket-details.component.css'
})
export class BucketDetailsComponent implements OnInit{
  bucketID: string | null = '';
  bucketName: string = '';
  selectedBucket: Bucket| null = null;
  files: FileModel[] = [];
  selectedFile: FileModel | null = null;
  activeTab: string = 'files';
  storageSize: number = 0;
  

  @ViewChild('fileInput') fileInput!: ElementRef;
  
  constructor(private route: ActivatedRoute, private router: Router, private bucketService: BucketServiceService) {}

  ngOnInit() {
    this.bucketID = this.route.snapshot.paramMap.get('id');

    if (this.bucketID) {
        this.bucketService.getBucketById(this.bucketID).subscribe((bucket) => {
        this.bucketName = bucket.name;
        });
    }
    this.loadFiles();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.updateStorageSize();
    this.selectedFile = null;
  }

  loadFiles(): void {
    if (this.bucketID) {
        this.bucketService.getBucketById(this.bucketID).subscribe(data => {
        this.selectedBucket = data;
        this.files = this.selectedBucket.files;
      });
    }
  }

  updateStorageSize(): void {
    const totalSize: number = this.files.reduce((sum: number, file: { size: number }) => 
      sum + file.size, 0
    );
    this.storageSize = totalSize;
  }

  openFileDialog(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const newFile: FileModel = {
        id: uuidv4(),
        name: file.name,
        lastmodified: new Date(file.lastModified).toLocaleDateString('sl-SI', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric' 
        }).replace(/\//g, '.'),
        size: file.size
      };

      if (this.bucketID) {
        this.bucketService.pushFile(this.bucketID, newFile).subscribe(() => {
          this.files.push(newFile);
        });
      }
    }
  }

  selectedFileOnClick(file: any){
    this.selectedFile = file;
  }

  deleteFile(){
    if (this.bucketID && this.selectedFile) {
      const confirmDelete = window.confirm(`Are you sure you want to delete file "${this.selectedFile.name}"?`);
      if (!confirmDelete) return;

      this.bucketService.deleteFile(this.bucketID, this.selectedFile.id).subscribe(() => {
        this.files = this.files.filter(file => file.id !== this.selectedFile?.id);
        this.selectedFile = null;
      })
    }
  }

  onBucketDelete(): void {
    if (this.bucketID){
      if (window.confirm(`Are you sure you want to delete bucket "${this.bucketName}"?`)) {
        this.bucketService.deleteBucket(this.bucketID).subscribe(() => {
          this.router.navigate(['/']);
        });
      }
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) {
      return bytes + ' B';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + ' KB';
    } else if (bytes < 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    } else {
      return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    }
  }  
}
