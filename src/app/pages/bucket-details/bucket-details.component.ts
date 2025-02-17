import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BucketServiceService } from '../../services/bucket-service.service';

@Component({
  selector: 'app-bucket-details',
  imports: [],
  templateUrl: './bucket-details.component.html',
  styleUrl: './bucket-details.component.css'
})
export class BucketDetailsComponent implements OnInit{
  bucketID: string | null = '';
  bucketName: string = '';
  
  constructor(private route: ActivatedRoute, private bucketService: BucketServiceService) {}

  ngOnInit() {
    this.bucketID = this.route.snapshot.paramMap.get('id');


    if (this.bucketID) {
        this.bucketService.getBucketById(this.bucketID).subscribe((bucket) => {
          this.bucketName = bucket.name;
        });
      }
  }
}
