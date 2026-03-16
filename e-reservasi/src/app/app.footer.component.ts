import {Component} from '@angular/core';

@Component({
    selector: 'app-footer',
    template: `
        <div class="footer clearfix">
        <span>Copyright TRANSMEDIC, {{ currentYear }} @EPIC_TEAM</span>
        <!--    <div class="footer-links">
            <a href="#" class="first">Panduan</a>
             <span class="link-divider">|</span>
          <a href="#">About</a>
            <span class="link-divider">|</span>
            <a href="#">Privacy</a>
            <span class="link-divider">|</span>
            <a href="#">Contact</a>
            <span class="link-divider">|</span>
            <a href="#">Map</a> 
        </div>-->
    </div>
    `
})
export class AppFooterComponent {
    currentYear = new Date().getFullYear();
}
