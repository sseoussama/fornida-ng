import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { BcProductService } from '../../_services';
import { NavigationEnd, Router } from '@angular/router';
import { _log } from '../../utils';
import * as $ from 'jquery';
import { ISubscription, Subscription } from "rxjs/Subscription";
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'app-nav',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {
	collections: any[];
	categories: any[] = [];
	active_cat_id: number;
	active_parent_id: number;
	mega: boolean;
	_categories: Subscription;
	_routeListener: Subscription;
	p: any[];
	// get Collections() { return this.bcProductService.Collections; }
	get CategoryTree() { return this.bcProductService.CategoryTree; }
	// get brands() { return this.bcProductService.Brands; }


	constructor(
		public bcProductService: BcProductService,
		public router: Router,
		public elRef: ElementRef
	) {
		this.getCategories();
	}

	ngOnInit() {
		this.onRouteChange();
		// dev only
		const self = this;
	}
	ngOnDestroy() { }

	getCategories() {
		const self = this;
		this._categories = this.bcProductService.getCategories().subscribe(categories => {
			_log(' == categories (nav.c.ts) ==> ', 'bc', categories);
			// set id as key
			categories.data.forEach(itm => {
				self.categories[itm.id] = itm;
			});
		});
	}

	getCategoryImg(id) {
		// let cat = this.categories.find(x => x.id == id);
		// return cat.id;
		// return this.categories[id].image_url;
	}

	getPlace() {
		const self = this;
		$('.level-item').removeClass('active');
		setTimeout( function() {
			const active_parent_el = $('a.activeChild').attr('id');
			$('#navigation #' + active_parent_el).addClass('active');
		}, 500);
	}

	// openMega(el, parent) {
	// 	// this.getPlace();
	// 	const already = $(el).hasClass('megaActive');
	// 	$('.stash').removeClass('stash');
	// 	$('.megaActive').removeClass('megaActive');
	// 	$(el).siblings('.active').addClass('stash');
	// 	$(el).addClass('megaActive');
	// 	$('body').addClass('mega_open');
	// 	this.p = parent;
	// 	this.mega = true;
	// 	if ( already ) return this.closeMega(); // for toggle
	// }

	// closeMega() {
	// 	this.mega = false;
	// 	$('.stash').removeClass('stash');
	// 	$('.megaActive').removeClass('megaActive');
	// 	$('body').removeClass('mega_open');
	// }

	onRouteChange() {
		this._routeListener = this.router.events.subscribe((event) => {
			if ( event instanceof NavigationEnd ) {
				// this.closeMega();
				this.getPlace();
			}
		});
	}

	// childnav
	childnav_open(el, parent) {
		$('#above').css('overflow', 'visible');
		const self = this;
		$(el.target).siblings('.navigation-itemm').css('opacity', 0.4);
		$(el.target).addClass('megaActive').click( function() {
			self.childnav_close(el, parent);
		});
		$('body').addClass('nav_open');
		parent.childnav1 = true;
		$('.anchor-menu').css('z-index', '1');
	}

	// childnav
	childnav_close(el, parent) {
		$('#above').css('overflow', 'hidden');
		$(el.target).siblings('.navigation-itemm').css('opacity', 1);
		$('.megaActive').removeClass('megaActive');
		// parent.childnav = false;
		$('body').removeClass('nav_open');
		parent.childnav1 = false;
		$('.anchor-menu').css('z-index', '10');
	}

	// admin change img
	onImgChange(e) {
		const $form = $(e.target);
		let data = {
			'img_url' : $form.find('#img_url').val()
		};
	}




}
