import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '../message.service';
import { TranslateService } from '@ngx-translate/core';
import { JobService } from '../job.service';
import { Job, FileModel } from '../models/job';
import { faSave, faMinusCircle, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

import { MatDialog } from '@angular/material';
import { ImagePreviewDialogComponent } from '../image-preview-dialog/image-preview-dialog.component';

export interface DialogData {
  images: FileModel[];
}

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css']
})
export class JobDetailsComponent implements OnInit {

  private files: File[] = [];
  private filesSaved: Map<number, FileModel> = new Map<number, FileModel>();
  private filesToShow: File[] = [];
  private formData = new FormData();
  private job: Job;
  private idJob: number;
  private imageFiles: FileModel[] = [];

  displayedColumns = ['name', 'file', 'id'];
  dataSource;

  constructor(private messageService: MessageService, private translate: TranslateService,
              private jobService: JobService, private router: Router,
              private formBuilder: FormBuilder, private route: ActivatedRoute,
              private config: NgbCarouselConfig, public dialog: MatDialog) { }

  ngOnInit() {

    this.config = {
      showNavigationArrows: false,
      showNavigationIndicators: true,
      interval: 1000,
      wrap: false,
      keyboard: false,
      pauseOnHover: false
    }

    this.route.params.subscribe(params => {
      this.idJob = params['idJob'];
      this.jobService.getJob(this.idJob).then(data => {
        this.job = data;

        this.jobService.getFiles(this.idJob).then(data => {
          var files = data;

          for (let file of files) {
            this.filesSaved.set(file.id, file);
          }

          this.dataSource = this.getFilesValues();
        });
      });
    });
  }

  getFile() {
    document.getElementById("upload").click();
  }

  onFileChanged(event) {
    this.jobService.createFiles(event.target.files, this.idJob).subscribe(data => {
      this.messageService.showSuccess(this.translate.instant('jobdetails.create.success'));
      var newFilesSaved = data.body;

      for (let file of newFilesSaved) {
        this.filesSaved.set(file.idFile, this.jobService.getFileFromRessource(file));
      }
    }, error => {
      this.messageService.showError(this.translate.instant('jobdetails.create.error'));
    });
  }

  onDelete(idFile: number) {
    this.jobService.deleteFile(idFile).subscribe(data => {
      this.messageService.showSuccess(this.translate.instant('jobdetails.delete.success'));
      this.filesSaved.delete(idFile);
      this.dataSource = this.getFilesValues();
    }, error => {
      this.messageService.showError(this.translate.instant('jobdetails.delete.error'));
    });
  }

  getFilesValues(): Array<FileModel> {
    return Array.from(this.filesSaved.values());
  }

  showPreview(file: FileModel, content) {
    this.imageFiles = [];
    this.imageFiles.push(this.filesSaved.get(file.id));
    for (let fileSaved of this.getFilesValues()) {
      if (fileSaved.id != file.id && fileSaved.isImage) {
        this.imageFiles.push(fileSaved);
      }
    }

    this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ImagePreviewDialogComponent, {
      data: {
        images: this.imageFiles,
        config : this.config
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
