import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { BcCartService, BcAuthService, LocalstorageService, ConfigsService, BcProductService  } from '../_services';
import { _log, notice, SnotifyService } from '../utils';
import { ISubscription, Subscription } from "rxjs/Subscription";
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";


let idx1 = 0;
let idx2 = 0;

@AutoUnsubscribe()
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, AfterViewInit {
	hov: string = 'checkout';
	cart_path: string;
	delete_msg: string;
	cart: any;
	email: any;
	ui_loading: string = 'Loading...';
	user: any;
	chosen: any;
	shippingOptions: any;
	modal: any;
	cart_set: boolean;
	changes: boolean;
	line_items: any;
	cart_id: any = this.bcCartService.local_cartId;
	editorContent: any;
	mode: any;
	checkout: any;
	no_data_msg: string =  'Loading Cart ... ';
	ui_not_ready: string =  'Loading Cart ... ';
	ui_ready: boolean = false;
	per: any = false;
	active_builds = [];
	stashModsMade = false;
	estimateModal = false;
	shareModal = false;
	loadedCartId: any;
	loaded: boolean;
	stashed: any;
	recently_deleted: any;
	_stashed: Subscription;
	_one: Subscription;
	_CartData: Subscription;
	_quertParams: Subscription;
	_addCoupon: Subscription;
	_removeCoupon: Subscription;
	_getShipEstimate: Subscription;
	_deleting: Subscription;

	// get stashed() { return this.configsService.Stashed; }
	get All() { return this.bcProductService.AllProducts; }

	constructor(
		public bcCartService: BcCartService,
		public bcAuthService: BcAuthService,
		public route: ActivatedRoute,
		public router: Router,
		public localstorageService: LocalstorageService,
		public configsService: ConfigsService,
		public bcProductService: BcProductService,
		private location: Location
	) {
		// this.getStashed();
		const self = this;
		this.ui_ready = false;
		this.stashModsMade = false;
		self.onCartDataChange();
		// this.bcCartService.init_cart_data('cart page construct', this.cart_id );
		// this.configsService.getStashedConfigs();
		this._one = this.bcAuthService.mode.subscribe(mode => {
			this.mode = mode;
			this.user = mode.user;
		});
	}

	chosenVal() {
		try {
			return this.shippingOptions.find(o=>o.id===this.chosen).cost;
		} catch {
			return 0;
		}
	}

	ngOnInit() {
		this._queryParam_listener();
	}

	ngAfterViewInit() {
		const self = this;
		// this.autoEstimate();
	}

	setCheckout(checkout) {
		this.checkout = checkout;
		this.shippingOptions = checkout.consignments[0].available_shipping_options;
	}

	autoEstimate() {
		if (this.localstorageService.isBrowser && this.user) {
			this.getShipEstimate(this.user);
		} else {
			idx1++; if(idx1>2) { return false; } // try only twice
			// console.error(`get estimate Attempt: ${i}`);
			setTimeout(() => this.autoEstimate(), 700);
		}
	}

    onCartDataChange() {
		console.log("XXXX",this.bcCartService.cart);
		try {
			this.show_cart(this.bcCartService.cart_set);
		} catch(e) {}
		const self=this;
		this._CartData = this.bcCartService.cartDataChange.subscribe((value) => {
			this.ui_ready = false; // should be false for prod
			this.cart_set = value;
			this.show_cart(value);
		});
		// if (!this.cart_set) {
		// 	setTimeout(() => self.bcCartService.cartDataChange.next(true), 1000);
		// }
	}

	show_cart(value) {
		if (value) {
			console.log(value, this.bcCartService.cart);
			this.cart = this.bcCartService.cart.data.data;
			this.cart_id = localStorage.getItem('cartId');
			(this.cart.hasBuilds) ? this.configurable_ui() : this.ui_ready = true;
			this.autoEstimate();
			// this.ui_ready = true; // dev only
		} else {
			this.no_data_msg = 'Your cart is empty.';
			this.cart = false;
		}
	}

	refresh() {
		this.bcCartService.init_cart_data('cart page construct', this.cart_id);
	}

	syncProducts() {
		this.configsService.remove('all_products','');
	}

	getStashed() {
		this._stashed = this.configsService.stashedSubject.subscribe( stashed => {
			_log(' == stashedSubject (in cart) ==> ', 'fb', stashed);
			this.stashed = stashed;
			if (!this.ui_ready) {
				// this.bcCartService.cartDataChange.next(true);
			}
		});
	}

	_queryParam_listener() { // reload builder if query "join" change;
		this._quertParams = this.route.queryParams.subscribe(params => {
			if (params['loadedCartId']) {
				// if the loaded cart is accessed by url only then make the "cartId_bak" to revert back to
				if (!localStorage.getItem("cartId_bak")) {
					localStorage.setItem("cartId_bak", localStorage.getItem("cartId"));
				}
				// init cart with the request queryparam id
				this.bcCartService.init_cart_data('query param existed', params['loadedCartId']);
				// update ui accordingly
				this.loadedCartId = params['loadedCartId'];
				this.loaded = true;
			} else if (localStorage.getItem("cartId_bak")) { // id there is no param and there is a cartId_bak then load cartId_bak
				localStorage.setItem("cartId", localStorage.getItem("cartId_bak"));
				localStorage.removeItem("cartId_bak");
				this.bcCartService.init_cart_data('no queryparam and there was \"cartId_bak\"', localStorage.getItem("cartId"));
			}
		});
	}
	// 50bd6453-81d6-4e9d-80b5-cbd60205a776 // config
	// 609d1a75-e855-4156-b349-1e4498d780f2 // components
	loadCartId(newCartID) {
		// this.cart_set = false;
		// this.cart = false;
		this.shippingOptions = false;
		localStorage.setItem( "cartId_bak", localStorage.getItem("cartId") );
		// localStorage.setItem( "cartId", newCartID );
		this.router.navigate(['/cart'], { queryParams: { loadedCartId: newCartID } });
	}

	loadCartIdRm() {
		// this.cart_set = false;
		// this.cart = false;
		this.shippingOptions = false;
		// localStorage.setItem( "cartId", newCartID );
		this.loaded = false;
		this.router.navigate(['/cart']);
		// this.bcCartService.init_cart_data("remove loaded cart pressed", localStorage.getItem("cartId_bak"));
	}



	goto(path) {
		this.bcAuthService.goto(path);
	}

	gotocart() { this.goto(this.cart.cart_path); }
	gotocheckout() { this.goto(this.cart.checkout_path); }

	// tslint:disable-next-line:use-life-cycle-interface
	ngOnDestroy() { }

	calculate_per(item) {
		// const components = this.get_stashed_obj(item).components;
		// const configs_sum = this.sum(components, 'price')||0;
		// return (configs_sum)+this.product.price;
	}

	sum(items, prop) {
	    return items.reduce( function(a, b) {
	        return a + b[prop]*b['quantity'];
	    }, 0);
	}

	delete_build(item) {
		const build_id = item.build_id;
		// const build_obj = this.stashed.find(x => x['build_id'] === build_id);

		// // catch err
		// if(build_obj === undefined) {
		// 	_log('Cant delete this item. no build_id or stashed build_obj found', 'e', item);
		// 	return false;
		// }

		// set "recently_deleted" so the app knows to ignore
		this.recently_deleted = build_id;

		// set the deleting msg
		this.delete_msg = 'Deleting Build Components';
		this._deleting = this.bcCartService.deleting.subscribe( (name)=> {
			this.delete_msg = 'Deleting ' + name; // terminal style
		});

		// hide mess till cart is re-initted
		this.ui_ready = false;

		// delete items from cart // delete build from stash
		this.bcCartService.delete_build(build_id, () => {
			this.configsService.deleteBuild(build_id);
			this.ui_loading = 'Loading...'; // original message
		});
	}

	delete_item(item) {
		this.bcCartService.delete_item(item.id, this.cart_id);
	}

	update_item(item) {
		this.bcCartService.update_item(item, this.cart_id);
	}

	change(item, val) {
		item.quantity = val;
		this.changes = true;
	}
	increment(item) { item.quantity = item.quantity + 1; this.changes = true; }
	decrement(item) {
		if (item.quantity === 0) {
			return false;
		} else {
			item.quantity = item.quantity - 1; this.changes = true;
		}
	}

	lastPage() {
		this.location.back();
	}

	// save(item) {
	// 	if (this.changes && item.quantity === 0) {
	// 		this.delete_item(item);
	// 	} else if (this.changes){
	//    		this.update_item(item);
	// 	}
	// 	this.changes=false;
	// }

	save(item) {
		if (this.changes) {
			(item.quantity <= 0 ) ? this.delete_item(item) : this.update_item(item);
		}
		this.changes = false;
	}



	configurable_ui() {
		setTimeout( () => {
			const self = this;

			// elements
			const p = $('[data-option-name="build_parent"]');
			const c = $('[data-option-name="build_id"]');
			const config_parents = p.closest('.cart_item');
			const config_components = c.closest('.cart_item');

			// show or hide
			// c.hide();
			p.hide();
			config_components.hide();
			config_parents.show();

			// function x() {
			// 	self.updateBuildTotals();
				self.ui_ready = true;
			// }

			// // display cart after scripts finish
			// if(this.stashed) {
			// 	x();
			// } else {
			// 	idx2++; if (idx2 > 3) { return false; } // try 3 times
			// 	setTimeout(e=> x(), 1000);
			// }

		}, 500); // make sure elements exist
	}

	// buildId(item) {
	// 	// return false; // dev only
	// 	// const is = JSON.stringify(item).includes('build_parent');
	// 	try {
	// 	    const build_id = item['options'].find(x => x.name === 'build_parent').value;
	// 	    const idx = $.inArray(build_id, this.active_builds) === -1;
	// 	    if(build_id && idx && this.stashed) {
	// 			this.active_builds.push(build_id);
	// 		}
	// 		return build_id;
	// 	} catch(err) { return false; }
	// }

	// get_stashed_obj(item) {
	// 	const build_id = item['options'].find(x => x.name === 'build_parent').value;
	// 	const stash = this.stashed.find(x => x['build_id'] === build_id);
	// 	if (stash === undefined) {
	// 		console.error(`stashed undefined => ${item.product_id} (${build_id})`);
	// 		// remove cartid from user storage and hard refresh
	// 		localStorage.removeItem("cartId");
	// 		location.reload();
	// 	}
	// 	return stash;
	// }

	// stash(key, item) {
	// 	const stash = this.get_stashed_obj(item);
	// 	if (stash === undefined) {
	// 		// console.error('stashed undefined',item.product_id);
	// 		return 0;
	// 	} else {
	// 		return this.get_stashed_obj(item)[key] || 0;
	// 	}
	// }

	// updateBuildTotals() { // changes price values in stash with values from cart
	// 	let i;
	// 	for (i = 0; i < this.stashed.length; i++) {
	// 		const ths = this.stashed[i];
	// 		// const active = this.active_builds.indexOf(`${ths.build_id}`);
	// 		const active = $.inArray(ths.build_id, this.active_builds) !== -1;
	// 		const recently_deleted = ths.build_id === this.recently_deleted;
	// 		if ( active && !recently_deleted ) {
	// 			this.stashModsMade = true;
	// 			// console.info('active stash', ths.build_id);
	// 			const components = ths.components;
	// 			this.updateComponentPrices(components, ths.parent_product_id, componentsNew => {
	// 				const buildQty = ths.buildQty;
	// 		    	const configs_sum = sum(components, 'price')||0;
	// 		    	ths.per_total = (configs_sum);
	// 		    	ths.total = ths.per_total*buildQty;
	// 		    	// this.stashModsMade = true;
	// 			});
	// 		}
	// 	}
    // }

    // updateComponentPrices(components, pId, next) {
	// 	const total = components.length;
    // 	let i;
    // 	for ( i = 0; i < total; i++ ) {
	// 	    components[i].price = this.getLineItem(components[i].id).list_price;
	// 	    if(i+1 === total) {
	// 	    	next(components);
	// 	    }
	// 	}
    // }

    getProduct(id) {
    	return this.All.find(x => x.id === id);
    }

    getLineItem(id) {
		const list = this.cart.line_items.physical_items;
    	return list.find(x => x.product_id === id);
    }

    close() {
		this.modal = false;
	}

	loading( e, dur ) {
		const self = this;
		const target = (<any>$(e.target));
		target.addClass('is-loading').delay(dur).queue(function(next) {
			target.removeClass('is-loading').dequeue();
			// self.onCloseModal();
		});
	}

	addCoupon(checkoutId, coupon_code) {
		this._addCoupon = this.bcCartService.addCoupon(checkoutId, coupon_code).subscribe(res => {
			_log(' == addCoupon response ==> ', 'i', res);
			this.checkout = res.data;
			this.bcCartService.init_cart_data('after coupon add', this.cart_id);
			// this.handle_confirmation_data(res.data.cart);
		});
	}

	removeCoupon(checkoutId, coupon_code) {
		this._removeCoupon = this.bcCartService.removeCoupon(checkoutId, coupon_code).subscribe(res => {
			_log(' == removeCoupon response ==> ', 'i', res);
			this.checkout = res.data;
			this.bcCartService.init_cart_data('after coupon add', this.cart_id);
		});
	}


	// getUser(next) {
	// 	this.email = this.localstorageService.getItem('email');
	// 	if(this.email) {
	// 		this.user = this.bcAuthService.get_user({email:this.email}, true).subscribe(User => {
	// 			_log(" == Get User (estimate) ==> ", 'i', User);
	// 			this.user = User;
	// 			if(next) {next(this.user);}
	// 		});
	// 	}
	// }

	discountsum() {
		let obj = (this.checkout) ? this.checkout : this.cart;
		return obj['coupons'].reduce(function (a, b) {
			return a + b['discounted_amount'];
		}, 0);
	}

	estimateClick(id) {
		(this.chosen !== id) ? this.chosen = id : this.chosen = false;
	}

	getShipEstimate(u) { // similar on estimate modal
		console.log('getShipEstimate');
		let wait = (!this.cart) ? 1000 : 0;
		setTimeout(() => {
			let id = this.cart_id;
			let address = u.address[0];
			let items = this.cart.line_items.physical_items.map(b => {
				return {item_id: b.id, quantity: b.quantity};
			});
			let payload = [{
				"shipping_address": {
					"country_code": address.country_iso2,
					"postal_code": address.zip,
					"custom_fields": [
						{
							"field_id": "field_25",
							"field_value": "Great!"
						}
					]
				},
				"line_items": items
			}];
			this._getShipEstimate = this.bcCartService.getShipEstimate(id, payload).subscribe( checkout=> {
				this.checkout = checkout.data;
				this.bcCartService.checkout = checkout.data;
				this.shippingOptions = this.checkout.consignments[0].available_shipping_options;
			});
		}, wait);
	}



}






function sum(items, prop) {
    return items.reduce( function(a, b) {
        return a + b[prop]*b['quantity'];
    }, 0);
}



