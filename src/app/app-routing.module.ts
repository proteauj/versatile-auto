import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { JobNewComponent } from './job-new/job-new.component';
import { JobTaskComponent } from './job-task/job-task.component';
import { JobDetailsComponent } from './job-details/job-details.component';
import { JobComponent } from './job/job.component';
import { JobInspectComponent } from './job-inspect/job-inspect.component';
import { UserComponent } from './user/user.component';
import { UserTaskComponent } from './user-task/user-task.component';
import { ClientComponent } from './client/client.component';

import { Job } from './models/job';

import { CanActivateRouteGuard } from './can-activate-route.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'login-register', component: LoginRegisterComponent },
  { path: 'job', component: JobComponent, canActivate: [CanActivateRouteGuard] },
  { path: 'job-new', component: JobNewComponent, canActivate: [CanActivateRouteGuard] },
  { path: 'job-new/:idJob', component: JobNewComponent, canActivate: [CanActivateRouteGuard] },
  { path: 'job-task/:idJob', component: JobTaskComponent, canActivate: [CanActivateRouteGuard] },
  { path: 'job-details/:idJob', component: JobDetailsComponent, canActivate: [CanActivateRouteGuard] },
  { path: 'job-inspect/:idJob', component: JobInspectComponent, canActivate: [CanActivateRouteGuard] },
  { path: 'user', component: UserComponent, canActivate: [CanActivateRouteGuard] },
  { path: 'user-task', component: UserTaskComponent, canActivate: [CanActivateRouteGuard] },
  { path: 'client', component: ClientComponent, canActivate: [CanActivateRouteGuard] }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes, {useHash: true}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}




