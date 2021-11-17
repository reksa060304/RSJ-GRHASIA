import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable, Subject } from 'rxjs';
import { AlertMsg } from './alert.interface';



@Injectable()
export class AlertService {
    private subject = new Subject<AlertMsg>();
    private keepAfterNavigationChange = false;
    constructor(private messageService: MessageService) { }

    private show(info: string, summary: string, detail: string, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ info: info, summary: summary, detail: detail });
    }

    info(title: string, message: string, keepAfterNavigationChange = false) {
        this.messageService.add({key:'t-notif',severity:'info', summary:title, detail:message});
        // this.show('info', title, message, keepAfterNavigationChange);
    }

    success(title: string, message: string, keepAfterNavigationChange = false) {
        this.messageService.add({key:'t-notif',severity:'success', summary:title, detail:message});
        // this.show('success', title, message, keepAfterNavigationChange);
    }

    warn(title: string, message: string, keepAfterNavigationChange = false) {
        this.messageService.add({key:'t-notif',severity:'warn', summary:title, detail:message});
        // this.show('warn', title, message, keepAfterNavigationChange);
    }

    error(title: string, message: string, keepAfterNavigationChange = false) {
        this.messageService.add({key:'t-notif',severity:'error', summary:title, detail:message});
        // this.show('error', title, message, keepAfterNavigationChange);
    }

    getMessage(): Observable<AlertMsg> {
        return this.subject.asObservable();
    }
}