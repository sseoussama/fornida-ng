import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Headers, Response } from '@angular/http';
import { Observable } from "rxjs/Rx";
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { _log, notice, SnotifyService } from '../utils';
import 'rxjs/Rx';
import { LocalstorageService } from './localstorage.service';
// import { ConfigsService } from './configs.service';

const noticeParams = notice;



// const api_url = environment.api_url;

const checkIcon = {icon: "/assets/img/notice-check.svg"};
const errIcon = {icon: "/assets/img/notice-err.svg"};
const trashIcon = {icon: "/assets/img/notice-trash.svg"};
const defaultParams = {
	timeout: 3000,
	showProgressBar: false,
	closeOnClick: true,
	pauseOnHover: true,
	position: 'rightTop'
};



@Injectable()
export class BcCartService {

	// cart_id: any = localStorage.getItem("cartId");
	cart: any = {};
	cart_set: boolean;
	isBrowser: boolean;
	local_email: any;
	local_cartId: any;
	apiUrl: any;
	checkout: any;


	cartDataChange: Subject<any> = new Subject<any>();
	deleting: Subject<any> = new Subject<any>();

	constructor(
		public http: HttpClient,
		public notice: SnotifyService,
		private localstorageService: LocalstorageService,
		// public configsService: ConfigsService
	) {
		this.local_email = this.localstorageService.getItem('email');
		this.local_cartId = this.localstorageService.getItem('cartId');
		this.isBrowser = this.localstorageService.isBrowser;
		this.apiUrl = this.localstorageService.apiUrl;

		_log(' == api_url => ', 'd', this.apiUrl);
		this.subscribe_data_changes();
		if (localstorageService.isBrowser) {
			this.init_cart_data('cart service construct',this.local_cartId);
		}
	}

	get Cart() { return this.cart; }

	onAddToCart(product, qty, variant_id?) {
		let send = {
			p: product,
			q: qty,
			v: variant_id || null
		};
		this.addtocart(send).subscribe(res => {
			_log(' == add_to_cart response ==> ', 'bc',  res);
			this.notice.success(product.name, `Added to Cart!`, Object.assign(defaultParams, checkIcon));
			(res.data.id) ? this.update_cart_data(res) : console.error('expected cartID');
		}, error => {
			this.notice.warning( error, defaultParams);
        });
	}


	addtocart(data) {
		let payload = {
			"product": data.p,
			"line_items": this.form_lineitem(data)
		};
		payload['cartId'] = localStorage.getItem("cartId") ? localStorage.getItem("cartId") : undefined;
		return this.http.post<any>( this.apiUrl + "/add_to_cart", payload ).catch(this.errHandler);
	}

	addMulti(data, buildQty) {
		const line_items = [];
		for (let i = 0, len = data.length; i < len; i++) {
		  const item = this.form_lineitem2(data[i]);
		  item.quantity = item.quantity*buildQty;
		  line_items.push(item);
		}
		let payload = {
			"product": data.p,
			"line_items": line_items
		};
		payload['cartId'] = localStorage.getItem("cartId") ? localStorage.getItem("cartId") : undefined;
		this.http.post<any>( this.apiUrl + "/add_to_cart", payload ).subscribe(res => {
			_log(' == addMulti response ==> ', 'bc',  res);
			this.notice.success(`Items Added to Cart!`, Object.assign(defaultParams, checkIcon));
			// if first item was added we need to set cartID in session
			// (res.data.id) ? this.init_cart_data('after addMulti', this.local_cartId) : console.error('expected cartID');
			(res.data.id) ? this.init_cart_data('after addMulti', res.data.id) : console.error('expected cartID');
		}, error => {
			let show = error.error.formatted || error.statusText;
			_log(show, 'e');
			this.notice.warning(
				show,
				`There was a problem`,
				noticeParams('errIcon')
			);
        });
	}

	init_cart_data(reason, cart_id, next?) {
		return this.get_cart(cart_id).subscribe(the_data => {
			_log(` == get_cart (${cart_id}) ==> `, 't');
			_log(` == get_cart (${reason}) ==> `, 'bc', the_data);
			if (the_data.code === 404 || the_data.code === 500) {
				_log('UNSETTING CART ', 'd');
				if(next) { next(the_data); }
				return this.unset_cart_data();
			}
			if(next) { next(the_data); }
			return this.update_cart_data(the_data);
		});
	}

	subscribe_data_changes() {
		this.cartDataChange.subscribe((cart_set) => {
			_log('cart service: Cart Set => ',cart_set);
			this.cart_set = cart_set;
            this.local_cartId = localStorage.getItem("cartId");
        });
	}

	unset_cart_data() {
		if(this.isBrowser) {
			$('.badge.Cart').hide();
		}
		// this.cart_set = false;
		// I think BC deletes prev cart_ids after all items were deleted from them
		// so force the app to get a new cart id
		localStorage.removeItem("cartId");
		return this.changeCart(false, 'unset');
	}

	update_cart_data(the_data) {
		if(this.isBrowser) {
			$('.badge.Cart').show();
		}
		this.cart.data = the_data;
		this.cart_set = true;
		const cartId = the_data.data.id;
		localStorage.setItem( "cartId", cartId );
		this.get_cart_urls(cartId).subscribe(urls => {
			let _urls = {
				cart_url: urls.data.cart_url,
				checkout_url: urls.data.checkout_url,
				cart_path: urls.data.cart_url.split('.com')[1],
				checkout_path: urls.data.checkout_url.split('.com')[1]
			};
			Object.assign(this.cart.data.data, _urls);
		});
		this.changeCart(this.cart_set, 'update');
		return this.cart;
	}

	changeCart(val, reason) {
		_log(`changeCart(${val}): ${reason}`, 'd');
		// this caused problems when cart was empty. Resulted in cart_set null here and true on cart component
		// this.cartDataChange.next(this.cart_set);
		this.cartDataChange.next(val);
	}

	get_cart_urls(cart_id) {
		const data = {cart_id: cart_id };
		return this.http.get<any>( this.apiUrl + "/get_cart_urls", {params: data} ).catch(this.errHandler);
	}

	get_cart(cart_id) {
		const data = {cart_id: cart_id, include: "line_items.physical_items.options" };
		return this.http.get<any>( this.apiUrl + "/get_cart", {params: data} ).catch(this.errHandler);
	}

	// delete_arr_old(productIds, deleteBuild:Function) {
	// 	const self = this;
	// 	const cartId = this.local_cartId;
	// 	// let attempts = 0;
	// 	try {
	// 		const currentlyInCart = this.cart.data.data.line_items.physical_items;
	// 		let i = 0;
	// 		const itemLoop = function() {
	// 			const item = productIds[i];
	// 			const cartItem = currentlyInCart.find(x => x.product_id === item);
	// 			if(cartItem === undefined) {
	// 				_log(`${item} could not be deleted. cartItem not found`, 'e', currentlyInCart);
	// 				i++;
	// 			} else {
	// 				self.delete_item(cartItem.id, cartId, ret => {
	// 					i++;
	// 					if(i < productIds.length) {
	// 			            itemLoop();
	// 			        } else {
	// 			        	console.log('************init_cart_data after delete_arr************');
	// 						self.init_cart_data('after delete array', self.local_cartId, (x) => setTimeout(e => deleteBuild(),2000) );
	// 			        }
	// 					return false;
	// 				});
	// 			}
	// 		};
	// 		itemLoop(productIds); // init first
	// 	} catch(err) {
	// 		// attempts++;
	// 		_log(' == Cannot Delete ==> ', 'e', err);
	// 		// self.init_cart_data(self.local_cartId);
	// 		// if(attempts===1) {
	// 		// 	setTimeout(e=>self.delete_arr(productIds),300);
	// 		// }
	// 	}
	// }


	delete_build(build_id, addEdits:Function) {
		const self = this;
		const cartId = this.local_cartId;
		// let attempts = 0;
		try {
			let i = 0;
			const line_items = this.cart.data.data.line_items.physical_items;
			const cart_ids = line_items.filter(b => JSON.stringify(b).includes(build_id)).map(b => {
				return {
					id: b.id,
					name: b.name
				};
			});
			// console.error("cart_ids to delete", cart_ids);
			const itemLoop = function () {
				self.delete_item(cart_ids[i], cartId, ret => {
					i++;
					if (i < cart_ids.length) {
						itemLoop();
					} else {
						console.log('************init_cart_data after delete_arr************');
						self.init_cart_data('after delete array', self.local_cartId, (x) => setTimeout(e => addEdits(), 2000));
					}
					return false;
				});
			};
			itemLoop(); // init first
		} catch(err) {
			// attempts++;
			_log(' == Cannot Delete ==> ', 'e', err);
			// self.init_cart_data(self.local_cartId);
			// if(attempts===1) {
			// 	setTimeout(e=>self.delete_arr(productIds),300);
			// }
		}
	}

	delete_item(cartItemID, cartId, nextInArr?) {
		console.log(`delete ${cartItemID} from ${cartId}`);
		// cartItemID is in an optional format
		let iId = (cartItemID.id) ? cartItemID.id : cartItemID;
		const data = { itemId: iId, cartId: cartId };
		return this.http.get<any>( this.apiUrl + "/delete_item", {params: data} ).subscribe(confirmation_data => {
			_log(' == delete_cart_item ==> ', 'bc', confirmation_data);
			let tmpp = Object.assign(defaultParams, trashIcon);
			this.deleting.next(cartItemID.name);
			if(!nextInArr) {
				this.handle_confirmation_data(confirmation_data);
				this.notice.success(`item deleted`, tmpp);
			} else {
				nextInArr();
			}
		});
	}

	update_item(item, cartId) {
		const payload = {};
		payload['cartId'] = cartId;
		payload['item'] = item;
		return this.http.post<any>( this.apiUrl + "/update_cart_item", payload )
		.catch(err => this.updateErrHandler(err))
		.subscribe(confirmation_data => {
			_log(' == update_cart_item ==> ', 'bc', confirmation_data);
			this.handle_confirmation_data(confirmation_data);
		});
	}

	handle_confirmation_data(confirmation_data) {
		this.init_cart_data('confirmation_data',this.local_cartId); // temporary
		// confirmation data needs to have options before i can use this
		// if(confirmation_data && !confirmation_data.error) {
		// 	this.update_cart_data(confirmation_data);
		// } else {
		// 	this.unset_cart_data();
		// }
	}

	form_lineitem(data) {
	    return [{
            quantity: data.q,
            product_id: data.p.id,
            // variant_id: 46,
            variant_id: data.v,
            list_price: data.p.price,
            gift_certificates: null,
            option_selections: null
        }];
	}

	form_lineitem2(data) {
	    return {
            quantity: data.quantity||1,
            product_id: data.id,
            // variant_id: 46,
            variant_id: data.v,
            list_price: data.price,
            gift_certificates: null,
            option_selections: data.option_selections
        };
	}

	addCoupon(checkoutId, coupon_code) {
		let data = {checkoutId:checkoutId, coupon_code:coupon_code};
		return this.http.get<any>( this.apiUrl + "/addCoupon", {params: data} )
			.catch((e: any) => Observable.throw(this.couponErrHandler(e)));
	}

	removeCoupon(checkoutId, coupon_code) {
		let data = {checkoutId:checkoutId, couponCode:coupon_code};
		return this.http.get<any>( this.apiUrl + "/removeCoupon", {params: data} )
			.catch((e: any) => Observable.throw(this.errHandler(e)));
	}

	errHandler(error: HttpErrorResponse) {
		_log(" == cart error ==> ", 'e', error);
		return Observable.throw(error.error || "unknown error");
	}
	updateErrHandler(error: HttpErrorResponse) {
		_log(" == could not update cart ==> ", 'y', error);
		this.notice.warning(
			`We don\'t have enough stock on hand for the quantity you selected.`,
			noticeParams('errIcon')
		);
		this.handle_confirmation_data(this.cart.data);
		return Observable.throw(error.error || "unknown error");
	}

	couponErrHandler(error: HttpErrorResponse) {
		_log(" == coupon error1 ==> ", 'e', error.error.formatted);
		this.notice.warning(
			error.error.formatted,
			noticeParams('errIcon')
		);
		// this.handle_confirmation_data(this.cart.data);
		// return Observable.throw(error.error || "unknown error");
	}


	getShipEstimate(id, payload) {
		return this.http.post<any>( this.apiUrl + `/getShipEstimate?id=${id}`, payload ).catch(this.errHandler);
	}




}



