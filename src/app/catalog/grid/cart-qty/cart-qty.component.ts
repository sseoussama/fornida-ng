import { Component, OnInit, Input } from '@angular/core';
import { BcProductService, BcCartService } from '../../../_services';
import { SnotifyService } from 'ng-snotify';
import { _log } from '../../../utils';


@Component({
  selector: 'cart-qty',
  templateUrl: './cart-qty.component.html',
  styleUrls: ['./cart-qty.component.scss']
})
export class CartQtyComponent implements OnInit {

	@Input() product: any;
	get Cart() { return this.bcCartService.Cart; }
	cart: any;
	cart_copy: any = [];
	cart_id: any = this.bcCartService.local_cartId;
	changes: boolean;

	constructor(
		public bcProductService: BcProductService,
		public bcCartService: BcCartService,
		public notice: SnotifyService
	) {
		this.bcCartService.cartDataChange.subscribe((value) => {
			this.cart = this.bcCartService.cart;
	        this.cart_id = this.bcCartService.local_cartId;
			// this.cartQtys(); // later
	    });
	}

	ngOnInit() {
		// this.cartQtys(); // needs work
	}

	onAddToCart(e, product, qty) {
		let $e = $(e.target);
		$e.hide(); $e.siblings('.ll').removeClass('hide');
		this.bcCartService.onAddToCart(product, qty);
		setTimeout(() => {
			$e.show();  $e.siblings('.ll').addClass('hide');
		}, 1800);
	}

	cartQtys() {
		const self = this;
		setTimeout( function() {
			let cart_items;
			try {
				cart_items = self.Cart.data.data.line_items.physical_items;
			} catch (err) {
				_log(' == if cart is empty — ignore this. ', 'd', err);
				return false;
			}
			$.each(cart_items, function() {
				self.cart_copy[this.sku] = { // imitate cart item
					quantity: this.quantity,
					sku: this.sku,
					id: this.id
				};
			});
		}, 400);
	}

	update_item(item) { this.bcCartService.update_item(item, this.cart_id); }
	delete_item(item) {
		// delete request
		this.bcCartService.delete_item(item.id, this.cart_id);
		// remove copy
		this.cart_copy[item.sku] = {};
	}
	increment(item, product) {item.quantity = item.quantity + 1; this.changes = true; }
	decrement(item, product) {
		if ( item.quantity === 0 ) {
			return false;
		} else {
			item.quantity = item.quantity - 1; this.changes = true;
		}
	}
	save(item, product) {
		if (this.changes) {
			item.product_id = product.id;
			(item.quantity <= 0) ? this.delete_item(item) : this.update_item(item);
		}
		this.changes = false;
	}




}
