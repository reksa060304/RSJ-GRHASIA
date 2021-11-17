import { Directive, HostListener, Renderer2, ElementRef } from '@angular/core';

@Directive({
    selector: '[uppercase]'
})
export class ChangeDirective {

    constructor(
        private renderer: Renderer2,
        private el: ElementRef
    ) { }

    @HostListener('keyup') onKeyUp() {
        //   this.el.nativeElement.value = this.el.nativeElement.value.toUpperCase();
        //   this.el.nativeElement.value = this.el.nativeElement.value.replace(/./g , this.el.nativeElement.value.toUpperCase());
        this.el.nativeElement.value = this.el.nativeElement.value.replace(/\b\w/g, first => first.toLocaleUpperCase());
        //   console.log(this.el.nativeElement.value)
        //  console.log('some thing key upped')
    }
}