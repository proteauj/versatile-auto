import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '../message.service';
import { TranslateService } from '@ngx-translate/core';
import { JobService } from '../job.service';
import { Job, FileModel } from '../models/job';
import { faSave, faMinusCircle, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { NgbCarouselConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


import {HttpClient, HttpRequest, HttpEvent} from '@angular/common/http';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css'],
  providers: [NgbCarouselConfig]
})
export class JobDetailsComponent implements OnInit {

  private files: File[] = [];
  private filesSaved: Map<number, FileModel> = new Map<number, FileModel>();
  private filesToShow: File[] = [];
  private formData = new FormData();
  private fileUploadConfig;
  private job: Job;
  private idJob: number;
  private imageFiles: FileModel[] = [];

  faSave = faSave;
  faMinusCircle = faMinusCircle;
  faFileUpload = faFileUpload;
  closeResult: string;

  constructor(private messageService: MessageService, private translate: TranslateService,
              private jobService: JobService, private router: Router,
              private formBuilder: FormBuilder, private route: ActivatedRoute,
              private config: NgbCarouselConfig, private modalService: NgbModal) { }

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

    this.config.showNavigationArrows = false;
    this.config.showNavigationIndicators = true;
    this.config.interval = 1000;
    this.config.wrap = false;
    this.config.keyboard = false;
    this.config.pauseOnHover = false;

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

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}
