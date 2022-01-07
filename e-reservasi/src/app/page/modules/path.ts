import { AuthGuard } from '../../helper';
import * as pMaster from './';



let session = JSON.parse(localStorage.getItem('user.data'));
export const pathMaster = [

    { path: '', redirectTo: 'reservasi', pathMatch: 'full' },
    //KIOS K
   
    //END KIOS K

    //Reservasi
    { path: 'reservasi', component: pMaster.ReservasiOnlineComponent },
    //END Reservasi


    { canActivate: [AuthGuard], path: '404', component: pMaster.NotFoundComponent },
    { canActivate: [AuthGuard], path: '**', redirectTo: '/404' },

];