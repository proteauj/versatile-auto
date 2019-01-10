import { ErrorHandler, Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {

  constructor(private messageService: MessageService, private translate: TranslateService) { }

  handleError(error: Error | HttpErrorResponse) {
    if (error instanceof HttpErrorResponse) {
      if (error.status == 0) {
        this.messageService.showError(this.translate.instant('error.api.down'));
      } else {
        if (error.status == 404) {
          this.messageService.showError(this.translate.instant('error.api.notfound'));
        } else {
          this.messageService.showError(this.translate.instant('error.api.general'));
        }
      }
    } else {
      this.messageService.showError(this.translate.instant('error.general'));
    }

    console.error('Error: ', error);
  }
}
