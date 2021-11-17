import { Component, OnInit, OnDestroy } from '@angular/core';
import { Message, MessageService } from 'primeng/api';

import { Subscription } from 'rxjs';
import { AlertMsg } from './alert.interface';
import { AlertService } from './alert.service';




@Component({
    selector: 'app-alert',
    template: '<p-toast key="t-notif" class="mt-10" [baseZIndex]="100000"  ></p-toast>',
    styleUrls: ['./alert.component.css']
    // template: '<p-growl [value]="msgs" [baseZIndex]="100000" ></p-growl>'
})

export class AlertComp implements OnInit, OnDestroy {
    message: AlertMsg;
    msgs: Message[] = [];

    private showS: Subscription;

    constructor(private alertService: AlertService,
        private messageService: MessageService) { }

    ngOnInit() {
        this.showS = this.alertService.getMessage().subscribe(message => { 
            debugger
            this.showAlert(message); 
        });
        // console.log('ngOnInit alert');
    }

    ngOnDestroy() {
        this.showS.unsubscribe();
    }

    showAlert(message) {
     
        // debugger
        // this.msgs = [];
        if(message.info =='error'){
            this.messageService.add({severity:message.info, summary:message.summary, detail:message.detail});
        }else{
            this.messageService.add({key: 't-notif',severity:message.info, summary:message.summary, detail:message.detail});
        }
        
        // this.msgs.push({ severity: message.info, summary: message.summary, detail: message.detail });
    }
}