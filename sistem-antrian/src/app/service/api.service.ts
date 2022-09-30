import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, finalize, takeUntil } from 'rxjs/operators';
import { LoaderService } from './loader.service';
import { MessageService } from 'primeng/api';
// import { TranslatorService } from './translator.service';
import { Config } from '../guard';
import { AlertService } from './component/alert/alert.service';
import { StreamState } from '../interfaces/stream-state';
import * as moment from 'moment';

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	private totalRequests = 0;
	baseApi = 'service/medifirst2000/'
	listSucces = [200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210]
	listError = [500, 401, 404, 400]
	private stop$ = new Subject();
	private audioObj = new Audio();
	audioEvents = [
		"ended",
		"error",
		"play",
		"playing",
		"pause",
		"timeupdate",
		"canplay",
		"loadedmetadata",
		"loadstart"
	];
	private state: StreamState = {
		playing: false,
		readableCurrentTime: '',
		readableDuration: '',
		duration: undefined,
		currentTime: undefined,
		canplay: false,
		error: false,
	};
	private stateChange: BehaviorSubject<StreamState> = new BehaviorSubject(
		this.state
	);

	private updateStateEvents(event: Event): void {
		switch (event.type) {
			case "canplay":
				this.state.duration = this.audioObj.duration;
				this.state.readableDuration = this.formatTime(this.state.duration);
				this.state.canplay = true;
				break;
			case "playing":
				this.state.playing = true;
				break;
			case "pause":
				this.state.playing = false;
				break;
			case "timeupdate":
				this.state.currentTime = this.audioObj.currentTime;
				this.state.readableCurrentTime = this.formatTime(
					this.state.currentTime
				);
				break;
			case "error":
				this.resetState();
				this.state.error = true;
				break;
		}
		this.stateChange.next(this.state);
	}
	private resetState() {
		this.state = {
			playing: false,
			readableCurrentTime: '',
			readableDuration: '',
			duration: undefined,
			currentTime: undefined,
			canplay: false,
			error: false
		};
	}
	play() {
		this.audioObj.play();
	}

	pause() {
		this.audioObj.pause();
	}

	stop() {
		this.stop$.next();
	}

	seekTo(seconds) {
		this.audioObj.currentTime = seconds;
	}

	formatTime(time: number, format: string = "HH:mm:ss") {
		const momentTime = time * 1000;
		return moment.utc(momentTime).format(format);
	}
	private addEvents(obj, events, handler) {
		events.forEach(event => {
			obj.addEventListener(event, handler);
		});
	}

	private removeEvents(obj, events, handler) {
		events.forEach(event => {
			obj.removeEventListener(event, handler);
		});
	}

	playStream(url) {
		return this.streamObservable(url).pipe(takeUntil(this.stop$));
	}
	getState(): Observable<StreamState> {
		return this.stateChange.asObservable();
	  }
	  
	private streamObservable(url) {
		return new Observable<any>(observer => {
			// Play audio
			this.audioObj.src = url;
			this.audioObj.load();
			this.audioObj.play();

			const handler = (event: Event) => {
				this.updateStateEvents(event);
				observer.next(event);
			};

			this.addEvents(this.audioObj, this.audioEvents, handler);
			return () => {
				// Stop Playing
				this.audioObj.pause();
				this.audioObj.currentTime = 0;
				// remove event listeners
				this.removeEvents(this.audioObj, this.audioEvents, handler);
				// reset state
				this.resetState();
			};
		});
	}



	constructor(private http: HttpClient, public loaderService: LoaderService, public messageService: MessageService,
		//  public translate: TranslatorService,
		private alert: AlertService) {


	}


	public getJSON(jenis): Observable<any> {
		return this.http.get<any>(jenis)
		  .pipe(
			tap((res: any) => {
			  return res
			}),
	
		  )
	  };
	get(url: string): Observable<any> {


		url = Config.get().apiBackend + this.baseApi + url
		this.totalRequests++
		this.loaderService.show()
		this.loaderService.hideIsDataFixed()
		return this.http.get<any>(url)
			.pipe(
				tap((res: any) => {
					// console.log('Ambil data ' + JSON.stringify(res))
					if (typeof (res.SettingDataFixed) !== "undefined" && res.SettingDataFixed == 1) {
						this.loaderService.showIsDataFixed()
					} else if (typeof (res.SettingDataFixed) !== "undefined" && res.SettingDataFixed == 0) {
						this.loaderService.hideIsDataFixed()
					}
				}),
				finalize(() => this.decreaseRequests())
			);
	}

	post(url: string, data: any): Observable<any> {
		url = Config.get().apiBackend + this.baseApi + url
		this.totalRequests++
		this.loaderService.show()
		return this.http.post<any>(url, data).pipe(
			tap((_res: any) => {
				this.responseSuccess(_res);
			}, (error: any) => {
				this.handleError(error)
			}),
			finalize(() => this.decreaseRequests()),
		);
	}
	postLog(jenislog, referensi, noreff, keterangan): Observable<any> {
		debugger
		var url = Config.get().apiBackend + this.baseApi + "sysadmin/logging/save-log-all?jenislog=" + jenislog + "&referensi=" +
			referensi + '&noreff=' + noreff + '&keterangan=' + keterangan
		this.totalRequests++
		this.loaderService.show()
		return this.http.get<any>(url)
			.pipe(
				tap((res: any) => {
					this.loaderService.hide()
				}),
				finalize(() => this.decreaseRequests())
			);
	}


	add(url: string, data: any): Observable<any> {
		this.totalRequests++
		this.loaderService.show()
		return this.http.post<any>(url, data).pipe(
			tap((_res: any) => console.log('Tambah data /w' + JSON.stringify(data))),
			finalize(() => this.decreaseRequests())
		);
	}


	update(url: string, data: any): Observable<any> {
		this.totalRequests++
		this.loaderService.show()
		const urlUpdate = url
		return this.http.put(urlUpdate, data).pipe(
			tap(_res => console.log('Update Data data /w' + JSON.stringify(data))),
			finalize(() => this.decreaseRequests())
		);
	}

	upload(url: string, file: any): Observable<any> {
		this.totalRequests++
		this.loaderService.show()
		return this.http.post<any>(url, file).pipe(
			tap((_res: any) => console.log('Upload Data /w' + JSON.stringify(file))),
			finalize(() => this.decreaseRequests())
		);
	}
	getLocalJSON(id: string): Observable<any> {
		return this.http.get("./assets/i18n/" + id + ".json");
	}

	delete(url: string): Observable<any> {
		this.totalRequests++
		this.loaderService.show()
		return this.http.delete<any>(url).pipe(
			tap(_res => console.log('Delete data')),
			finalize(() => this.decreaseRequests())
		);
	}
	private decreaseRequests() {
		this.totalRequests--;
		if (this.totalRequests === 0) {
			this.loaderService.hide()
		}
	}
	private responseSuccess(res: Response | any) {
		if (this.listSucces.includes(res.status)) {
			let message = res.messages
			if (message != 'Sukses') {
				this.alert.success('Sukses', message);
			} else {
				this.alert.success('Sukses', 'Data berhasil disimpan');
			}
		}
	}

	private handleError(error: Response | any) {

		if (this.listError.includes(error.status)) {
			let message = error.error.messages
			if (message) {
				this.alert.error('Kesalahan', message);
			} else {
				this.alert.error('Kesalahan', 'Data gagal disimpan');
			}
		}
	}


}
