import {Component} from '@angular/core';

@Component({
    selector: 'app-footer',
    template: `
        <div class="footer clearfix">
        <span>Copyright PT. Transindo Data Perkasa, 2021 @epic_team</span>
        <div class="footer-links">
            <a href="#" class="first">Terms</a>
            <span class="link-divider">|</span>
            <a href="#">About</a>
            <span class="link-divider">|</span>
            <a href="#">Privacy</a>
            <span class="link-divider">|</span>
            <a href="#">Contact</a>
            <span class="link-divider">|</span>
            <a href="#">Map</a>
        </div>
    </div>
    `
})
export class AppFooterComponent {

}
