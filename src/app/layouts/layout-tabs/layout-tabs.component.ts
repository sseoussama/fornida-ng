import { Component, AfterViewInit, Input, ElementRef } from '@angular/core';
import { LocalstorageService } from '../../_services/localstorage.service';
import * as $ from "jquery";

@Component({
  selector: 'layout-tabs',
  templateUrl: './layout-tabs.component.html',
  styleUrls: ['./layout-tabs.component.scss']
})
export class LayoutTabsComponent implements AfterViewInit {

	current: number = 0;
	active: any;
	isBrowser: boolean;
	@Input() data: any;

	constructor(public elRef: ElementRef, private localstorageService: LocalstorageService) {
		this.isBrowser = this.localstorageService.isBrowser;
	}

	ngAfterViewInit() {
		const self = this;
		// setTimeout( e=> {self.active = $('a.trigger-item')[0]}, 500);
		// setTimeout(e=> this.triggerClick($('a.trigger-item')[0]), 400) // default
		this.triggerClick($('a.trigger-item')[0])
	}

	prev(){
		const prev = $('a.trigger-item.active').index()-1;
		this.triggerClick($('a.trigger-item')[prev]);
	}
	next(){
		const next = $('a.trigger-item.active').index()+1;
		this.triggerClick($('a.trigger-item')[next]);
	}

	triggerClick(target) {
		if(this.isBrowser && target) {
			target.dispatchEvent(new Event('click'));
		}
	}

	setActive(e) {
		this.active = $(e.target);
	}

	tabChange(e, i) {
		this.current = i;
		this.place_underline($(e.target));
	}

	over(e) {
		this.place_underline($(e.target), true);
	}

	leave() {
		this.place_underline( this.active );
	}

	place_underline(target, over?) {
		const $underline = $('.underline');
		const $underlineB = $('.underline-b');
		const activeL = target.position().left;
		const pad = parseInt(target.css('padding-left').replace('px',''));
		const containerL = $('.forunderlines.taj').position().left;
		const pos = activeL-containerL+pad+'px';    	
		if(!over) {
		$underline.css({
			'margin-left': pos,
			'width': target.width()+'px'
		});
		}
			$underlineB.css({
				'margin-left': pos,
				'width': target.width()+'px'
			});
	}

}
