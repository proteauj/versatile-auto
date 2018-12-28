import { Injectable } from '@angular/core';
import { interval, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  intervalTime;
  timeoutTimer;


  constructor() { }

  //Passer 60000 pour 1 minute
  setInterval(value: number) {
    this.intervalTime = interval(value);
  }

  getMinutesDifferenceDate(startTime: Date, endTime: Date) {
    var momentStart = moment(startTime, 'YYYY-MM-DD HH:mm');
    var momentEnd = moment(endTime, 'YYYY-MM-DD HH:mm');
    var minutesDiff = momentEnd.diff(momentStart, 'minutes');
    return minutesDiff;
  }

  //Passer l'heure de fin usuelle d'un employé
  setTimeOut(startTime: Date, endTime: Date) {
    var minutesDiff = this.getMinutesDifferenceDate(startTime, endTime);
    var nbMilliSecondsMax = minutesDiff * 60000;
    this.timeoutTimer = timer(nbMilliSecondsMax);
  }

  getObservableTimer() {
    return this.intervalTime.pipe(takeUntil(this.timeoutTimer));
  }

  //const subscribe = example.subscribe(val => console.log(val));
}
