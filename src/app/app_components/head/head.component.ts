import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { BcAuthService } from '../../_services';
import { filter } from 'rxjs/operators';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.scss']
})
export class HeadComponent implements OnInit {
	drop: boolean;
	content: string;
	mode: any;
	// show: any = show;

	constructor(
		public bcAuthService: BcAuthService,
		public router: Router
	) {
		this.drop = false; // default state
		this.content = 'user'; // preload user for use in setting config id in single.component.ts
		const self = this;
		// setTimeout( function() {
		// 	self.content = 'cart';  // preload cart content so that the grid can get qty data
		// }, 1000);
		setTimeout( function() {
			self.content = 'notice';  // preload notice to preset refs
		}, 2000);
		this.bcAuthService.mode.subscribe(mode => {
			this.mode = mode;
		});
	}

	ngOnInit() {
		this.closeOnNav();
		$('.badge.Cart').hide();
	}

	open_mini(e, content) {
		$('#above').css('overflow', 'visible');
		$('.blackout').show();
		this.drop = true;
		this.content = content;
		const self = this;
		// $(`.${content}-content.open-true`).css('border', '2px solid red');
		if($(`.${content}-content.open-true`).length) {
			self.close_mini();
		}
		// setTimeout(o => {
		// 	$(`.${self.content}-content`).find('*').filter(':input:visible:first').focus();
		// }, 0);
		$(`.blackout, e.target`).click( function() {
			self.close_mini();
		});

		$('body').unbind().click(function(e) {
    		if ($(e.target).closest('.topcons').length === 0) {
				self.close_mini();
    		}
    	});
    	$('.anchor-menu').css('z-index', '1');

		$(e.target).click( function() {
			self.close_mini();
		});
	}

	closeOnNav() {
		this.router.events.pipe( filter( (event ) => event instanceof NavigationEnd) ).subscribe(e => {
			this.close_mini();
		});
	}

	close_mini() {
		this.content = 'search'; // revert to default // also necessary so cart destroys and re-inits everytime. 
		// $('#above').css('z-index', 7);
		$('.blackout, .topcons a').unbind();
		$('.blackout').hide();
		this.drop = false;
		$('#above').css('overflow', 'hidden');
		$('.anchor-menu').css('z-index', '10');
	}

	above_top() {
		// $('#above').css('z-index', 100);
	}

}
