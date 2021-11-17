import { Injectable,Injector } from '@angular/core';
// import {TranslateService} from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class TranslatorService {
	public loaderSubject: loaderSubject
	constructor(
		// private translate: TranslateService
		) { }

	generateTranslate() {
		// this.loaderSubject = {
		// 	kesalahan:'',
		// 	sukses:'',
		// 	peringatan:'',
		// 	pesanKesalahanServer:'',
		// 	errorKoneksi:'',
		// 	usernamePasswordSalah:'',
		// 	konfirmLogout:'',
		// 	konfirmasiKeluar:'',
		// 	pesanKesalahanDataTidakLengkap:'',
		// 	pesanSuksesInputData:'',
		// 	pesanSuksesUpdateData:'',
		// 	pesanSuksesAktifkanData:'',
		// 	pesanSuksesHapusData:'',
		// 	usernamePasswordNotNull:'',
		// 	pesanKesalahaSesiBerakhir:'',
		// 	pesanKesalahanApiTidakDitemukan:'',
		// 	pesanKesalahanEmailTidakTersedia:'',
		// 	pesanKesalahanNoHpTidakTersedia:'',
		// 	pesanSuksesNoHpTersedia:'',
		// 	pesanSuksesEmailTersedia:'',
		// 	pesanSuksesUploadData:'',
		// 	pesanKesalahanUploadData:'',
		// 	modulAplikasiNotNull:'',
		// 	pesanKesalahanTidakSupportGeoLocation:'',
		// 	pesanKesalahanDataBelumDipilih:'',
		// 	pesanKesalahanPengirimanData:'',
		// 	peringatanSettingDataFixed:''
		// }
		// this.translate.get('kesalahan').subscribe((res:string)=>{
		// 	this.loaderSubject.kesalahan = res
		// })
		// this.translate.get('sukses').subscribe((res:string)=>{
		// 	this.loaderSubject.sukses = res
		// })
		// this.translate.get('pesanKesalahanServer').subscribe((res:string)=>{
		// 	this.loaderSubject.pesanKesalahanServer = res
		// })
		// this.translate.get('errorKoneksi').subscribe((res:string)=>{
		// 	this.loaderSubject.errorKoneksi = res
		// })
		// this.translate.get('usernamePasswordSalah').subscribe((res:string)=>{
		// 	this.loaderSubject.usernamePasswordSalah = res
		// })
		// this.translate.get('konfirmasiKeluarDariRoutes').subscribe((res:string)=>{
		// 	this.loaderSubject.konfirmLogout = res
		// })
		// this.translate.get('konfirmasiKeluar').subscribe((res:string)=>{
		// 	this.loaderSubject.konfirmasiKeluar = res
		// })
		// this.translate.get('pesanSuksesInputData').subscribe((res:string)=>{
		// 	this.loaderSubject.pesanSuksesInputData = res
		// })
		// this.translate.get('pesanSuksesUpdateData').subscribe((res:string)=>{
		// 	this.loaderSubject.pesanSuksesUpdateData = res
		// })
		// this.translate.get('pesanSuksesAktifkanData').subscribe((res:string)=>{
		// 	this.loaderSubject.pesanSuksesAktifkanData = res
		// })
		// this.translate.get('pesanSuksesHapusData').subscribe((res:string)=>{
		// 	this.loaderSubject.pesanSuksesHapusData = res
		// })
		// this.translate.get('usernamePasswordNotNull').subscribe((res:string)=>{
		// 	this.loaderSubject.usernamePasswordNotNull = res
		// })
		// this.translate.get('pesanKesalahaSesiBerakhir').subscribe((res:string)=>{
		// 	this.loaderSubject.pesanKesalahaSesiBerakhir = res
		// })
		// this.translate.get('pesanKesalahanApiTidakDitemukan').subscribe((res:string)=>{
		// 	this.loaderSubject.pesanKesalahanApiTidakDitemukan = res
		// })
		// this.translate.get('pesanKesalahanEmailTidakTersedia').subscribe((res:string)=>{
		// 	this.loaderSubject.pesanKesalahanEmailTidakTersedia = res
		// })
		// this.translate.get('pesanKesalahanNoHpTidakTersedia').subscribe((res:string)=>{
		// 	this.loaderSubject.pesanKesalahanNoHpTidakTersedia = res
		// })
		// this.translate.get('pesanSuksesNoHpTersedia').subscribe((res:string)=>{
		// 	this.loaderSubject.pesanSuksesNoHpTersedia = res
		// })
		// this.translate.get('pesanSuksesEmailTersedia').subscribe((res:string)=>{
		// 	this.loaderSubject.pesanSuksesEmailTersedia = res
		// })
		// this.translate.get('pesanSuksesUploadData').subscribe((res:string)=>{
		// 	this.loaderSubject.pesanSuksesUploadData = res
		// })
		// this.translate.get('pesanKesalahanUploadData').subscribe((res:string)=>{
		// 	this.loaderSubject.pesanKesalahanUploadData = res
		// })
		// this.translate.get('modulAplikasiNotNull').subscribe((res:string)=>{
		// 	this.loaderSubject.modulAplikasiNotNull = res
		// })
		// this.translate.get('pesanKesalahanTidakSupportGeoLocation').subscribe((res:string)=>{
		// 	this.loaderSubject.pesanKesalahanTidakSupportGeoLocation = res
		// })
		// this.translate.get('pesanKesalahanDataTidakLengkap').subscribe((res:string)=>{
		// 	this.loaderSubject.pesanKesalahanDataTidakLengkap = res
		// })
		// this.translate.get('pesanKesalahanDataBelumDipilih').subscribe((res:string)=>{
		// 	this.loaderSubject.pesanKesalahanDataBelumDipilih = res
		// })
		// this.translate.get('pesanKesalahanPengirimanData').subscribe((res:string)=>{
		// 	this.loaderSubject.pesanKesalahanPengirimanData = res
		// })
		// this.translate.get('peringatan').subscribe((res:string)=>{
		// 	this.loaderSubject.peringatan = res
		// })
		// this.translate.get('peringatanSettingDataFixed').subscribe((res:string)=>{
		// 	this.loaderSubject.peringatanSettingDataFixed = res
		// })
	}
	getTranslate() {
		return this.loaderSubject
	}

}
interface loaderSubject {
	kesalahan:string
	sukses:string
	peringatan:string
	pesanKesalahanServer:string
	errorKoneksi:string
	usernamePasswordSalah:string
	konfirmLogout:string
	konfirmasiKeluar:string
	pesanKesalahanDataTidakLengkap:string
	pesanSuksesInputData:string
	pesanSuksesUpdateData:string
	pesanSuksesAktifkanData:string
	pesanSuksesHapusData:string
	usernamePasswordNotNull:string
	modulAplikasiNotNull:string
	pesanKesalahaSesiBerakhir:string
	pesanKesalahanApiTidakDitemukan:string
	pesanKesalahanEmailTidakTersedia:string
	pesanKesalahanNoHpTidakTersedia:string
	pesanSuksesNoHpTersedia:string
	pesanSuksesEmailTersedia:string
	pesanSuksesUploadData:string
	pesanKesalahanUploadData:string
	pesanKesalahanTidakSupportGeoLocation:string
	pesanKesalahanDataBelumDipilih:string,
	pesanKesalahanPengirimanData:string,
	peringatanSettingDataFixed:string
}
