import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { FileModel } from '../models/job';

export interface DialogData {
  images: FileModel[],
  config: NgbCarouselConfig
}

@Component({
  selector: 'app-image-preview-dialog',
  templateUrl: './image-preview-dialog.component.html',
  styleUrls: ['./image-preview-dialog.component.css'],
  providers: [NgbCarouselConfig]
})
export class ImagePreviewDialogComponent {

  constructor(public dialogRef: MatDialogRef<ImagePreviewDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
