import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, finalize } from 'rxjs/operators';
import { LoaderService } from './loader.service';
import { MessageService } from 'primeng/api';
// import { TranslatorService } from './translator.service';
import { Config } from '../guard';
import { AlertService } from './component/alert/alert.service';
@Injectable({
	providedIn: 'root'
})
export class ApiService {
	private totalRequests = 0;
	baseApi = 'service/medifirst2000/'
	listSucces = [200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210]
	listError = [500, 401, 404, 400]
	constructor(private http: HttpClient, public loaderService: LoaderService, public messageService: MessageService,
		//  public translate: TranslatorService,
		  private alert: AlertService) {
	
	 }
	 getJSON(): Observable<any> {
        return this.http.get<any>("assets/config.json")
			.pipe(
                tap((res: any) => {
					return res
				}),
		
            );
    }
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
