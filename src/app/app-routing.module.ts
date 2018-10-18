import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { JobNewComponent } from './job-new/job-new.component';
import { JobTaskComponent } from './job-task/job-task.component';
import { JobDetailsComponent } from './job-details/job-details.component';
import { JobComponent } from './job/job.component';

import { Job } from './models/job';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'job', component: JobComponent},
  { path: 'job-new', component: JobNewComponent },
  { path: 'job-task/:idJob', component: JobTaskComponent},
  { path: 'job-details/:idJob', component: JobDetailsComponent}
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}



