import { Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import { interval } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { AsyncPipe } from '@angular/common';
import { TimerService } from './timer.service';

@Pipe({ name: 'fromNow' })
export class FromNowPipe /*extends AsyncPipe {
  startTime:Date;
  elapsedTime:number;
  timer:Observable<number>;

  constructor(ref:ChangeDetectorRef, private timerService: TimerService) {
    super(ref);
    this.timerService.setInterval(60000);
  }

  getEndTime(): Date {
    var endTime = new Date();
    endTime.setHours(16, 30, 0, 0);
    return endTime;
  }

  transform(obj:any):any {
    if (obj instanceof Date) {
      this.startTime = obj;
      this.timerService.setTimeOut(this.startTime, this.getEndTime())

      if(!this.timer) {
        //this.timer = this.getObservable();
        this.timer = this.timerService.getObservableTimer();
      }

      return super.transform(this.timer);
    }

    return super.transform(obj);
  }


//    return Observable.interval(1000).startWith(0).map(()=> {
 /* private getObservable() {
    return interval(1000).pipe(map(() =>{
      var result: number;
      if (this.startTime != null) {
        var momentStart = moment(this.startTime, 'YYYY-MM-DD HH:mm');
        var momentEnd = moment(new Date(), 'YYYY-MM-DD HH:mm');
        var difference = momentEnd.diff(momentStart, 'minutes');
        result = difference;
      }
      return result;
    }));
  }
}*/

implements PipeTransform {
  //secondsCounter = interval(1000);
  //now: Date = new Date();
  timer;

  constructor(private timerService: TimerService) {
    this.timerService.setInterval(60000);
  }

  getEndTime(): Date {
    var endTime = new Date();
    endTime.setHours(16, 30, 0, 0);
    return endTime;
  }

  transform(startTime: Date, elapsedTime: number) {
    /*this.secondsCounter.subscribe(n => {
      this.now = new Date();
      console.log(`It's been ${n} seconds since subscribing!`)

      if (startTime != null) {
        var momentStart = moment(startTime, 'YYYY-MM-DD HH:mm');
        var momentEnd = moment(this.now, 'YYYY-MM-DD HH:mm');
        var difference = momentEnd.diff(momentStart, 'minutes');
        return difference;
      }
    });*/

    var result;
    if (elapsedTime != null) {
      result = elapsedTime;
    }

    if (startTime != null) {
      this.timerService.setTimeOut(startTime, this.getEndTime())
      this.timer = this.timerService.getObservableTimer();
      this.timer.subscribe(val => {
        console.log(val);
        result = result + val;
      });
    }

    return result;
  }
}
