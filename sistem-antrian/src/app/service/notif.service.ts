import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { SwPush } from '@angular/service-worker';
import { Config } from '../guard';
@Injectable({
  providedIn: 'root',
})
export class WebNotificationService {
  readonly VAPID_PUBLIC_KEY = 'BODzvtPs5_TOQOf749Jpvbw3TdG8Z5kJupofXljhQT3TG8YB7GV-mKxYVY8AQV5Wf3_3UtNxL-D9aa487J3V3Tc';
  private baseUrl = ''
  constructor(private http: HttpClient,
              // private swPush: SwPush,
              ) {}
  subscribeToNotification() {
    // this.swPush.requestSubscription({
    //     serverPublicKey: this.VAPID_PUBLIC_KEY
    // })
    // .then(sub => this.sendToServer(sub))
    // .catch(err => console.error('Could not subscribe to notifications', err));
  }
  sendToServer(params: any) {
    this.http.post(Config.get().apiNotif+'notification', { notification : params }).subscribe();
  }
}