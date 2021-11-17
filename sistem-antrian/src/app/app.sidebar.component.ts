import { Component } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { AuthService } from './service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './app.sidebar.component.html'
})
export class AppSideBarComponent {
    namaPegawai: any
    initial: any;
    jabatan: string = ''

    constructor(public app: AppMainComponent,
        public authService: AuthService) { }

    ngOnInit() {
        let user = this.authService.getDataLoginUser()
        if (user == null) {
            return
        }
        if (user.pegawai.namaLengkap != undefined && user.pegawai.namaLengkap != '-') {
            this.namaPegawai = user.pegawai.namaLengkap
            let forInitial = this.namaPegawai.split(' ')

            if (forInitial.length > 1) {
                let a = forInitial[0].substring(0, 1).toUpperCase()
                let b = forInitial[1].substring(0, 1).toUpperCase()
                this.initial = a + b
            } else if (forInitial.length == 1) {
                let a = forInitial[0].substring(0, 1).toUpperCase()
                this.initial = a
            }
        } else {
            this.namaPegawai = 'Adminitrator'
            this.initial = this.namaPegawai.substring(0, 1).toUpperCase()
        }
        this.jabatan = user.jenisPegawai!=null? user.jenisPegawai.jenispegawai : ''
    }

}
