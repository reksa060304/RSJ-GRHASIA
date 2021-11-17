import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoaderService {

    private loaderSubject = new BehaviorSubject<boolean>(false);
    private isSettingDataFixed = new BehaviorSubject<boolean>(false); 

    loaderState = this.loaderSubject.asObservable();
    statusDataFixed = this.isSettingDataFixed.asObservable();
    constructor() { }
    show() {
        this.loaderSubject.next(<boolean>true);
    }
    hide() {
        this.loaderSubject.next(<boolean>false);
    }
    showIsDataFixed() {
        this.isSettingDataFixed.next(<boolean>true);
    }
    hideIsDataFixed() {
        this.isSettingDataFixed.next(<boolean>false);
    }
}
