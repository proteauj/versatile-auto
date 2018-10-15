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
  protected filesSaved: Map<number, FileModel> = new Map<number, FileModel>();
  //protected filesSaved: Promise<FileModel[]>;
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
        var files = data;

        for (let file of files) {
          this.filesSaved.set(file.id, file);
        }
      });
    });
  }

  getFile() {
    document.getElementById("upload").click();
  }

  onFileChanged(event) {
    this.jobService.createFiles(event.target.files, this.idJob).subscribe(data => {
      this.messageService.add(this.translate.instant('jobdetails.create.success'));
      var newFilesSaved = data.body;

      for (let file of newFilesSaved) {
        this.filesSaved.set(file.id, file);
      }
    }, error => {
      console.log("Error", error);
    });
  }

  onDelete(idFile: number) {
    this.jobService.deleteFile(idFile).subscribe(data => {
      this.messageService.add(this.translate.instant('jobdetails.delete.success'));
      this.filesSaved.delete(idFile);
    }, error => {
      console.log("Error", error);
    });
  }

  getFilesValues(): Array<FileModel> {
    return Array.from(this.filesSaved.values());
  }
}
