import { Routes } from '@angular/router';
import { BucketListComponent } from './pages/bucket-list/bucket-list.component';
import { BucketDetailsComponent } from './pages/bucket-details/bucket-details.component';

export const routes: Routes = [
  { path: '', component: BucketListComponent },
  { path: 'bucket/:id', component: BucketDetailsComponent },
  { path: '**', redirectTo: '' }
];
