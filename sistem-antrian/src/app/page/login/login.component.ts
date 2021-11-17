import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
// import {TranslateService} from '@ngx-translate/core';

import { AuthService, ApiService } from '../../service';
// import { TranslatorService } from '../../service/translator.service';
import { MessageService } from 'primeng/api';
import { Config } from 'src/app/guard';
import { AlertService } from 'src/app/service/component/alert/alert.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
	// loginForm: FormGroup;
	loading = false;
	submitted = false;
	error = '';
	bahasa: any[];
	loginGagal: string;
	pilihModulAplikasi: boolean = false;
	usernamePasswordNotNull: string;
	d_modul_aplikasi: any[];
	modul_aplikasi: any;
	item:any ={}
	constructor(
		// private formBuilder: FormBuilder,
		private router: Router,
		private authService: AuthService,
		// private translate: TranslateService,
		// private terjemah: TranslatorService,
		private messageService: MessageService,
		private apiService: ApiService,
		private alert : AlertService) {  }

	ngOnInit() {
		this.modul_aplikasi = null
		// this.loginForm = this.formBuilder.group({
		// 	namaUser: [null, Validators.required],
		// 	kataSandi: [null, Validators.required],
		// 	bahasa: [null,Validators.required],
		// 	rememberMe: [true]
		// });
		// this.bahasa = [
		// {
		// 	label:"Bahasa Indonesia",
		// 	value:"id"
		// },
		// {
		// 	label:"English",
		// 	value:"en"
		// },
		// {
		// 	label:"日本",
		// 	value:"ja"
		// }]
		localStorage.clear()
		sessionStorage.clear()

		// this.alert.error('Info','Nama User belum di isi !!')
		// this.getBahasa()
	}

	// changeLanguage(event:any) {
	// 	this.translate.use('KdProfile='+Config.getKdProfile()+'&KdModulAplikasi=B1&KdVersion=2&KdBahasa='+event.value.KdBahasa);
	// 	localStorage.setItem('lang','KdProfile='+Config.getKdProfile()+'&KdModulAplikasi=B1&KdVersion=2&KdBahasa='+event.value.KdBahasa)
	// 	// this.terjemah.generateTranslate()
	// }
	// get f() { return this.loginForm.controls; }
	// getBahasa() {
	// 	this.apiService.get(Config.get().apiBackend+'language/combo-bahasa').subscribe(res=>{
	// 		if (res) {
	// 			this.bahasa = res.data
	// 			this.loginForm.get('bahasa').setValue(res.data[0])
	// 			this.translate.use('KdProfile='+Config.getKdProfile()+'&KdModulAplikasi=B1&KdVersion=2&KdBahasa='+res.data[0].KdBahasa);
	// 		}
	// 	})
	// }
	// onSubmit2() {
	// 	this.submitted = true;
	// 	if (this.loginForm.invalid) {
	// 		this.messageService.add({key: 't-login', severity:'error', summary: this.terjemah.loaderSubject.kesalahan, detail:this.terjemah.loaderSubject.usernamePasswordNotNull});
	// 		this.loading = false;
	// 		return;
	// 	}

	// 	this.loading = true;
	// 	this.authService.login(this.f.namaUser.value, this.f.kataSandi.value, this.f.rememberMe.value)
	// 	.pipe(first())
	// 	.subscribe(
	// 		(data: any) => {
	// 			this.loading = false;
	// 			if (data['x-auth-token']) {
	// 				this.router.navigate(['']);
	// 				this.translate.getTranslation('KdProfile='+data.bahasa.KdProfile+'&KdModulAplikasi='+data.bahasa.KdModulAplikasi+'&KdVersion='+data.bahasa.KdVersion+'&KdBahasa='+this.f.bahasa.value.KdBahasa).subscribe(res=>{
	// 					this.translate.setTranslation('KdProfile='+data.bahasa.KdProfile+'&KdModulAplikasi='+data.bahasa.KdModulAplikasi+'&KdVersion='+data.bahasa.KdVersion+'&KdBahasa='+this.f.bahasa.value.KdBahasa,res,true)
	// 				})
	// 				this.translate.use('KdProfile='+data.bahasa.KdProfile+'&KdModulAplikasi='+data.bahasa.KdModulAplikasi+'&KdVersion='+data.bahasa.KdVersion+'&KdBahasa='+this.f.bahasa.value.KdBahasa);
	// 				localStorage.setItem('lang','KdProfile='+data.bahasa.KdProfile+'&KdModulAplikasi='+data.bahasa.KdModulAplikasi+'&KdVersion='+data.bahasa.KdVersion+'&KdBahasa='+this.f.bahasa.value.KdBahasa)
	// 				// this.terjemah.generateTranslate()
	// 			} else {
	// 				this.d_modul_aplikasi = []
	// 				data.modulAplikasis.forEach((data:any)=>{
	// 					this.d_modul_aplikasi.push({label:data.ModulAplikasi,value:data.KdModulAplikasi})
	// 				})
	// 				this.pilihModulAplikasi = true
	// 				this.authService.setDataLoginUser(data)
	// 			}

	// 		}, (error:any) =>{
	// 			this.loading = false
	// 		});
	// }
	loginKeun() {


		this.submitted = true;
		if (!this.item.namaUser) {
			this.messageService.add({key: 't-login', severity:'error', summary: 'Kesalahan', detail:'Nama User harus di isi !'});
			this.loading = false;
			return;
		}
		if (!this.item.kataSandi) {
			this.messageService.add({key: 't-login', severity:'error', summary: 'Kesalahan', detail:'Kata Sandi harus di isi !'});
			this.loading = false;
			return;
		}

		this.loading = true;
		this.authService.login(this.item.namaUser, this.item.kataSandi,false)
		.pipe(first())
		.subscribe(
			(data: any) => {
				this.loading = false;
				if (data.id!= undefined) {
					this.router.navigate(['']);
					// this.translate.getTranslation('KdProfile='+data.bahasa.KdProfile+'&KdModulAplikasi='+data.bahasa.KdModulAplikasi+'&KdVersion='+data.bahasa.KdVersion+'&KdBahasa='+this.f.bahasa.value.KdBahasa).subscribe(res=>{
					// 	this.translate.setTranslation('KdProfile='+data.bahasa.KdProfile+'&KdModulAplikasi='+data.bahasa.KdModulAplikasi+'&KdVersion='+data.bahasa.KdVersion+'&KdBahasa='+this.f.bahasa.value.KdBahasa,res,true)
					// })
					// this.translate.use('KdProfile='+data.bahasa.KdProfile+'&KdModulAplikasi='+data.bahasa.KdModulAplikasi+'&KdVersion='+data.bahasa.KdVersion+'&KdBahasa='+this.f.bahasa.value.KdBahasa);
					// localStorage.setItem('lang','KdProfile='+data.bahasa.KdProfile+'&KdModulAplikasi='+data.bahasa.KdModulAplikasi+'&KdVersion='+data.bahasa.KdVersion+'&KdBahasa='+this.f.bahasa.value.KdBahasa)
					// this.terjemah.generateTranslate()
				} else {
					this.d_modul_aplikasi = []
					// data.modulAplikasis.forEach((data:any)=>{
					// 	this.d_modul_aplikasi.push({label:data.ModulAplikasi,value:data.KdModulAplikasi})
					// })
					this.pilihModulAplikasi = true
					this.authService.setDataLoginUser(data)
				}

			}, (error:any) =>{
				this.loading = false
			});
	}
	pilihModul(event:any){
		this.loading = true;
		// if (this.modul_aplikasi == '' || this.modul_aplikasi == null) {
		// 	this.messageService.add({key: 't-login', severity:'error', summary: this.terjemah.loaderSubject.kesalahan, detail:this.terjemah.loaderSubject.modulAplikasiNotNull});
		// 	this.loading = false;
		// 	return;
		// }
		// let dataUser = {
		// 	"id": this.authService.getDataLoginUser().id,
		// 	"namaUser": this.authService.getDataLoginUser().namaUser,
		// 	"kdUser": this.authService.getDataLoginUser().kdUser,
		// 	"idProfile": this.authService.getDataLoginUser().kdProfile,
		// 	"kdProfile": this.authService.getDataLoginUser().kdProfile,
		// 	"profile": this.authService.getDataLoginUser().profile,
		// 	"idModulAplikasi": event,
		// 	"kdPegawai": this.authService.getDataLoginUser().kdPegawai,
		// 	"kdKelompokUser": this.authService.getDataLoginUser().kdKelompokUser,
		// 	"KdNegara": this.authService.getDataLoginUser().KdNegara,
		// }
		// this.authService.loginModulAplikasi(dataUser,this.f.rememberMe.value)
		// .pipe(first())
		// .subscribe(
		// 	(_data: any) => {
		// 		this.loading = false;
		// 		this.router.navigate(['']);
		// 		// this.translate.getTranslation('KdProfile='+_data.bahasa.KdProfile+'&KdModulAplikasi='+_data.bahasa.KdModulAplikasi+'&KdVersion='+_data.bahasa.KdVersion+'&KdBahasa='+this.f.bahasa.value.KdBahasa).subscribe(res=>{
		// 		// 	this.translate.setTranslation('KdProfile='+_data.bahasa.KdProfile+'&KdModulAplikasi='+_data.bahasa.KdModulAplikasi+'&KdVersion='+_data.bahasa.KdVersion+'&KdBahasa='+this.f.bahasa.value.KdBahasa,res,true)
		// 		// })
		// 		// this.translate.use('KdProfile='+_data.bahasa.KdProfile+'&KdModulAplikasi='+_data.bahasa.KdModulAplikasi+'&KdVersion='+_data.bahasa.KdVersion+'&KdBahasa='+this.f.bahasa.value.KdBahasa);
		// 		localStorage.setItem('lang','KdProfile='+_data.bahasa.KdProfile+'&KdModulAplikasi='+_data.bahasa.KdModulAplikasi+'&KdVersion='+_data.bahasa.KdVersion+'&KdBahasa=1')
		// 		// this.terjemah.generateTranslate()
		// 	}, (error:any) =>{
		// 		this.loading = false
		// 	});
	}
	batal(){
		this.pilihModulAplikasi = false
		this.d_modul_aplikasi = []
		this.item = {}
		// this.loginForm.setValue({
		// 	namaUser:'',
		// 	kataSandi:'',
		// 	bahasa:'id',
		// 	rememberMe:false
		// })
		// this.loginForm.controls['namaUser'].markAsPristine();
		// this.loginForm.controls['kataSandi'].markAsPristine();
	}

}
