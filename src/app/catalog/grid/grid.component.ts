import { Component, OnInit, Input, ElementRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd } from '@angular/router';
import { BcProductService, FirebaseProductsService } from '../../_services';
import { SnotifyService, SnotifyToast } from 'ng-snotify';


let i = 0;
const refresh = (toast: SnotifyToast) => {
  location.reload();
}
const failedCat_id = {
	timeout: 200000,
	showProgressBar: false,
	closeOnClick: true,
	exit: 'bounceOutRight',
	pauseOnHover: true,
	titleMaxLength: 25,
	backdrop: 0.6,
	position: 'rightBottom',
	buttons: [
		{text: 'refresh page', action: refresh, bold: true },
	],
}





@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit, OnDestroy {

	done: boolean;
	ready: boolean;
	
	@Input() active_cat_id: string;
	@Input() Products: any;

	constructor(
		public router: Router,
		public route: ActivatedRoute,
		public bcProductService: BcProductService,
		public notice: SnotifyService,
		public elRef:ElementRef
	) {}

	ngOnInit() {
	}

	ngOnDestroy() {}

	loading(e,dur) {
		let target = (<any>$(e.target));
		target.addClass('is-loading').delay(dur).queue(function(next){
			target.removeClass('is-loading');
			target.dequeue();
		});
	}

	

}
