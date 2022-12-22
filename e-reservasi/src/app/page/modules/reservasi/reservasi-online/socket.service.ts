import { Injectable } from '@angular/core';
import * as io from "socket.io-client";
import { Configuration } from "../../../../helper/config";
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  // static emit(arg0: string, arg1: { name: any; body: any; }) {
  //   throw new Error('Method not implemented.');
  // }

  private socket: any;
    //wrapper : CallBackWrapper[];

    private callBack : (data : string) => any = null

    constructor(){
      this.socket = io(Configuration.get().socketIO,
      {
        transports: ['websocket',  'polling'],
      });
      console.log('socket connect');
    }



    on(stat, callBack : (data : string) => any = null){
      //this.wrapper[ob] = new CallBackWrapper(callBack, ob);
      this.callBack = callBack;
      this.socket.on(stat, function(data){
        //console.log('data  asli ' + data);
        callBack(data);
      });
    }

    emit(info, message){
      this.socket.emit(info, message);
    }
}
