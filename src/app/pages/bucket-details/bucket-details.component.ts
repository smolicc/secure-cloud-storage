import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BucketServiceService } from '../../services/bucket-service.service';

@Component({
  selector: 'app-bucket-details',
  imports: [CommonModule],
  templateUrl: './bucket-details.component.html',
  styleUrl: './bucket-details.component.css'
})
export class BucketDetailsComponent implements OnInit{
  bucketID: string | null = '';
  bucketName: string = '';
  selectedBucket: any = null;
  files: any[] = [];
  selectedFileName: string = '';
  activeTab: string = 'files';
  storageSize: string = '';

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
  }

  loadFiles(): void {
    if (this.bucketID) {
        this.bucketService.getFilesById(this.bucketID).subscribe(data => {
        this.selectedBucket = data;
        this.files = this.selectedBucket.files;
        
        const totalSize: number = this.selectedBucket.files.reduce((sum: number, file: { size: string }) => 
          sum + parseFloat(file.size), 0
        );
        this.storageSize = totalSize.toString();
      });
    }
  }

  openFileDialog(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const newFile = {
        name: file.name,
        lastmodified: new Date(file.lastModified).toLocaleDateString(),
        size: (file.size / (1024*1024)).toFixed(2)
      };

      if (this.bucketID) {
        this.bucketService.pushFile(this.bucketID, newFile).subscribe(() => {
        this.loadFiles();
        });
      }
    }
  }

  selectedFileOnClick(file: any){
    this.selectedFileName = file.name;
  }

  deleteFile(){
    if (this.bucketID && this.selectedFileName) {
      const confirmDelete = window.confirm(`Are you sure you want to delete "${this.selectedFileName}"?`);
      if (!confirmDelete) return;

      this.bucketService.deleteFile(this.bucketID, this.selectedFileName).subscribe(() => {
        this.loadFiles();
        this.selectedFileName = '';
      })
    }
  }

  onBucketDelete(): void {
    if (this.bucketID){
      if (window.confirm(`Are you sure you want to delete "${this.bucketName}"?`)) {
        this.bucketService.deleteBucket(this.bucketID).subscribe(() => {
          this.router.navigate(['/']);
        });
      }
    }
  }
}
