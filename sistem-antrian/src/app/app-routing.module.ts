import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppMainComponent } from './app.main.component';

import { AuthGuard, LoginGuard } from './guard';
import { AccessDeniedComponent,  NotFoundComponent } from './page';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { canActivate: [LoginGuard], path: 'login', redirectTo: 'home' },
            {
            path: '', component: AppMainComponent,
                children: [
                    { path: 'home', redirectTo: 'index' },
                    { path: 'viewer', loadChildren: () => import('./page/queue/viewer/viewer.module').then(m => m.ViewerModule) },
                    { path: 'caller', loadChildren: () => import('./page/queue/caller/caller.module').then(m => m.CallerModule) },
                    { path: 'index', loadChildren: () => import('./page/queue/home/home.module').then(m => m.HomeModule) },
                
                    { canActivate: [AuthGuard], path: 'not-found', component: NotFoundComponent },
                    { canActivate: [AuthGuard], path: 'access-denied', component: AccessDeniedComponent },

                    { path: '**', redirectTo: 'not-found' }
                ]
            },

        ], { scrollPositionRestoration: 'enabled' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
