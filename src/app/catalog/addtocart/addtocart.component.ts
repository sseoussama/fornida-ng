import { Component, OnInit } from '@angular/core';
import { SnotifyService } from 'ng-snotify';
import { BcCartService } from '../../_services';

@Component({
  selector: 'app-addtocart',
  templateUrl: './addtocart.component.html',
  styleUrls: ['./addtocart.component.scss']
})
export class AddtocartComponent implements OnInit {

  constructor(
		public bcCartService: BcCartService,
		public notice: SnotifyService
	){}

  ngOnInit() {
  }

 //  addToCart(product, qty) {
	// 	let send = {
	// 		p: product,
	// 		q: qty
	// 	};
	// 	this.bcCartService.addtocart(send).subscribe(res => {
	// 		console.info("== add_to_cart response ==>", res);
	// 		// if(!res) console.error('Probably missing varientID');
	// 		(res.data.id) ? this.update_cart_data(res) : console.error('expected cartID');
	// 	},error => {
	// 		this.notice.warning( error, {
	// 			timeout: 200000,
	// 			showProgressBar: false,
	// 			closeOnClick: true,
	// 			pauseOnHover: true,
	// 			titleMaxLength: 25,
	// 			backdrop: 0.6,
	// 			position: 'rightBottom'
	// 		});
	//         // this.errors = error;
 //        });
	// }

}
