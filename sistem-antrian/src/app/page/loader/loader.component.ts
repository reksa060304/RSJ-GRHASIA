import { Component, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from '../../service'

@Component({
	selector: 'app-loader',
	templateUrl: './loader.component.html',
	styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements AfterViewInit, OnDestroy {
	show: boolean = false
	subscription: Subscription
	constructor(private loaderService: LoaderService, private cdRef:ChangeDetectorRef) { }

	ngAfterViewInit() {
		this.subscription = this.loaderService.loaderState.subscribe((state:boolean)=>{
			this.show = state
			this.cdRef.detectChanges()
		})
	}
	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
