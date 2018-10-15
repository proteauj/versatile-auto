import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '../message.service';
import { TranslateService } from '@ngx-translate/core';
import { JobService } from '../job.service';
import { Job, FileModel } from '../models/job';
import { faSave, faMinusCircle, faFileUpload } from '@fortawesome/free-solid-svg-icons';

import {HttpClient, HttpRequest, HttpEvent} from '@angular/common/http';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css']
})
export class JobDetailsComponent implements OnInit {

  protected files: File[] = [];
  protected filesSaved: FileModel[] = [];
  protected filesToShow: File[] = [];
  protected formData = new FormData();
  protected fileUploadConfig;
  protected job: Job;
  protected idJob: number;

  faSave = faSave;
  faMinusCircle = faMinusCircle;
  faFileUpload = faFileUpload;

  constructor(private messageService: MessageService, private translate: TranslateService,
              private jobService: JobService, private router: Router,
              private formBuilder: FormBuilder, private route: ActivatedRoute) { }

  ngOnInit() {
    this.fileUploadConfig = {
        multiple: true,
        formatsAllowed: ".jpg,.png,.docx,.doc,.xls,.xlsx,.pdf,.gif,.txt",
        maxSize: "20",
        uploadAPI:  {
          url:"http://localhost:8080/jobs/files",
          headers: {
         "Content-Type" : "text/plain;charset=UTF-8"
          }
        },
        theme: "dragNDrop",
        hideProgressBar: true,
        hideResetBtn: true,
        hideSelectBtn: true,
        hideUploadBtn: true
    };


    this.route.params.subscribe(params => {
      this.idJob = params['idJob'];
      this.jobService.getJob(this.idJob).then(data => {
        this.job = data;
      });

      this.jobService.getFiles(this.idJob).then(data => {
            this.filesSaved = data;

            /*for (let fileModel of this.filesSaved) {
              this.filesToShow.push(new File(fileModel.file, fileModel.name));
            }*/
          });
    });
  }

  getFiles() {

  }

  onSubmit() {
    for (let i = 0; i < this.files.length; i++) {
      var file: File = this.files[i];

      this.jobService.createFile(file, this.idJob).subscribe(data => {
        this.filesSaved.push(data[0]);
        this.messageService.add(this.translate.instant('jobdetails.create.success'));
      }, error => {
        console.log("Error", error);
      });
    }
  }

  onFileChanged(event) {
    for (let file of event.target.files) {
      this.files.push(file);
    }
  }


}
