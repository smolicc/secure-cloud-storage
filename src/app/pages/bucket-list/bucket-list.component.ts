import { Component, OnInit} from '@angular/core';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BucketServiceService } from '../../services/bucket-service.service';

@Component({
  selector: 'app-bucket-list',
  standalone: true,
  imports: [NgFor, NgIf, CommonModule, FormsModule],
  templateUrl: './bucket-list.component.html',
  styleUrl: './bucket-list.component.css'
})
export class BucketListComponent implements OnInit {
  buckets: any[] = [];
  showForm: boolean = false;
  CreateNewButon: boolean = true;
  locations: { id: string; name: string }[] = [];
  newBucket = { name: '', location: '' }; 

  constructor(private router: Router, private bucketService: BucketServiceService) {}

  ngOnInit() {
    this.loadBuckets();
    this.loadLocations();
  }

  loadBuckets() {
    this.bucketService.getBuckets().subscribe(data => {
      this.buckets = data;
    });
  }

  loadLocations(): void {
    this.bucketService.getLocations().subscribe((data) => {
      this.locations = data;
      if (this.locations.length > 0) {
        this.newBucket.location = this.locations[0].name;
      }
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.CreateNewButon = false;
  }

  createBucket() {
    
    if (!this.newBucket.name.trim()) return;

    this.bucketService.pushBucket(this.newBucket).subscribe(() => {
      this.loadBuckets();
      this.newBucket = { name: '', location: '' }; 
      this.showForm = false;
      this.CreateNewButon = true;
    });
  }

  openBucket(bucket: any) {
    this.router.navigate(['/bucket', bucket.id]);
  }
}
