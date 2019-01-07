import { Component, OnDestroy, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { BcProductService} from '../../../../_services';
// import { environment } from '../../../../../environments/environment';
// import * as flamelink from 'flamelink'
// const content = flamelink( environment.firebase ).content;


@Component({
  selector: 'details-popout',
  templateUrl: './details-popout.component.html',
  styleUrls: ['./details-popout.component.scss']
})
export class DetailsPopoutComponent implements OnInit, OnDestroy {

	@Input() product: any;
	@Output() closeModal = new EventEmitter<any>();

	tests: any;

	constructor(public bcProductService: BcProductService) {
		// this.get_testimonies();
	}

	ngOnInit() {
		$('#above').css('z-index', '1');
		$('.anchor-menu').css('z-index', '1');
		$('.x.gallery').css('z-index', '2');
		// $('.body').css(['overflow', 'hidden']);
		if(this.product.name === undefined) {
			this.getProduct(this.product, (p) => this.product = p);
		}
	}

	getProduct(id, next) {
		next(this.bcProductService.allProducts.find(p=> p.id===id));
	}

	// get_testimonies() {
	// 	content.get('testimonyDemo').then(testimonyDemo => {
	// 		console.log('All of your testimonyDemo:', testimonyDemo)
	// 		this.tests = testimonyDemo;
	// 	}).catch(error => {
	// 		console.error('flamelink:', error);
	// 	});
	// }

	onCloseModal() {
		this.closeModal.emit(false);
	}

	ngOnDestroy() {
		$('#above').css('z-index', '9');
		$('.anchor-menu').css('z-index', '10');
		$('.x.gallery').css('z-index', '1');
		// $('.body').css('overflow', 'inherit');
	}

}
