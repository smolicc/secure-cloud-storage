import { Component, OnInit} from '@angular/core';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BucketServiceService } from '../../services/bucket-service.service';
import { v4 as uuidv4 } from 'uuid';
import { Bucket } from '../../models/bucket.model';
import { Location } from '../../models/location.model';

@Component({
  selector: 'app-bucket-list',
  standalone: true,
  imports: [NgFor, NgIf, CommonModule, FormsModule],
  templateUrl: './bucket-list.component.html',
  styleUrl: './bucket-list.component.css'
})
export class BucketListComponent implements OnInit {
  buckets: Bucket[] = [];
  showForm: boolean = false;
  CreateNewBucketBTN: boolean = true;
  locations: Location[] = [];
  newBucket: Bucket  = { id: '', name: '', location: '', files: [] };

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
    this.CreateNewBucketBTN = false;
  }

  createBucket() {
    
    if(this.newBucket)
    {
      if (!this.newBucket.name.trim()) return;

      this.newBucket.id = uuidv4();
  
      this.bucketService.pushBucket(this.newBucket).subscribe(() => {
        this.buckets.push(this.newBucket); 
        this.newBucket = { id: '', name: '', location: this.locations[0].name, files:[] };
        this.showForm = false;
        this.CreateNewBucketBTN = true;
      });
    }
  }

  openBucket(bucket: any) {
    this.router.navigate(['/bucket', bucket.id]);
  }
}
