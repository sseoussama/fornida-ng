import { Component, OnInit, Input } from '@angular/core';
// import { BcProductService } from '../../../../../_services';
// import { _log } from '../../../../../utils';

@Component({
  selector: 'app-details',
  templateUrl: './option-details.component.html',
  styleUrls: ['./option-details.component.scss']
})
export class OptionDetailsComponent implements OnInit {

	@Input() option: string;
	@Input() product: any;
	// loading: boolean = true;

	constructor() { }

	ngOnInit() {
		const self = this;
		// setTimeout( function() {
		// 	self.loading = false;
		// }, 2000);
	}

	// getProduct(id) {
	// 	this.bcProductService.getProductById(id).subscribe(single => {
	//         _log('== single (option) ==>:', 'i', single);
	//         // this.reload = true;
	//         return this.product = single.data;
	//     });
	// }

}
