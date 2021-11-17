import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { LoaderState } from './loader.interface';



@Injectable()
export class LoaderService {

    private loaderSubject = new Subject<LoaderState>();

    count = 0;

    show() {
        // debugger
        this.loaderSubject.next(<LoaderState>{show: true});
        this.count++;
    }

    hide() {
        if (this.count <= 1) {
            this.loaderSubject.next(<LoaderState>{show: false});
        }
        this.count--;
    }


	getState(): Observable<LoaderState> {
		return this.loaderSubject.asObservable();
    }
}