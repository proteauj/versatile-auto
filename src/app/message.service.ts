import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})

export class MessageService {
  constructor(private toastr: ToastrService) { }

  //messages: string[] = [];

  showSuccess(message: string) {
    this.toastr.success(message, '', {
      timeOut: 3000
    });
  }

  showError(message: string) {
    this.toastr.error(message, '', {
      timeOut: 3000
    });
  }

  /*add(message: string) {
    $timeout(function() {
      this.messages.push(message);
    }, 300);
  }

  clear() {
    this.messages = [];
  }*/
}
