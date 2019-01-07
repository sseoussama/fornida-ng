import { Component, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { ConfigsService } from '../../../../_services';


@Component({
  selector: 'option-anchors',
  templateUrl: './option-anchors.component.html',
  styleUrls: ['./option-anchors.component.scss']
})
export class OptionAnchorsComponent implements AfterViewInit, OnDestroy {

	@Input() product: any;
	sets: any;
	_observeSets: any;

	constructor(public configsService: ConfigsService) { }

	ngAfterViewInit() {
		this.getSets();
	}

	ngOnDestroy() {
		this._observeSets.unsubscribe();
	}

	getSets() {
		this._observeSets = this.configsService.setCurrent(this.product['sku']).subscribe(sets => {
			this.sets = this.toArray(sets['config']).sort(byOrder);
			this.scroll_listener(this.sets);
		});
	}

	toArray(obj_obj) {
		return Object.keys(obj_obj).map(i => obj_obj[i]);
	}

	open_configs() {
		this.configsService.configSubmitted.next(true);
	}

	smooth(target, offset: number) {
		this.open_configs();
		const c = target;
		setTimeout(e=>this.activate_anchor(c),1000);
		const self = this;
		const ev = event;
		setTimeout( e => {
			offset = offset || 0;
			target = $(`#${target}`);
			if (target.length) {
				ev.preventDefault();
				$('html, body').animate({
						scrollTop: target.offset().top - offset,
						easing: 'easeOutCirc'
				}, 500, function() {
					self.emphasize(target.find('.form-head'));
					let $target = $(target);
					$target.focus();
					if ($target.is(':focus')) { // Checking if the target was focused
						return false;
					} else {
						$target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
						$target.focus(); // Set focus again
					}
				});
			}
		},200);
	}

	emphasize(target) {
		const self = this;
		const on = {'background': '#f5f5f5'};
		const off = {'background': '#ffffff'};
		setTimeout( function() {
			target.css(on).delay(200).queue(function(next) {
				target.css(off).dequeue();
			});
		}, 0);
	}

	scroll_listener(sets) {

		const self = this;

		$(window).on('scroll', function(){
			scrNav();
		});

		function scrNav() {
			let sTop = $(window).scrollTop();
			$('.form-section').each(function() {
				let id = $(this).attr('id'), offset = $(this).offset().top-60, height = $(this).height();
				if(sTop >= offset && sTop < offset + height) {
					self.activate_anchor(id);
				}
			});
		}

		scrNav();
	}

	activate_anchor(id) {
		$('.level-item').removeClass('active');
		let conainer = $('.anchor-menu .inner');
		let newlyActive = $('.anchor-menu').find(`[data-scroll=${id}]`);
		if (newlyActive !== undefined && newlyActive.position() !== undefined) {
			let target = newlyActive.position().left + conainer.scrollLeft() - 20;
			newlyActive.addClass('active');
			conainer.scrollLeft(target);
		}
	}


}




function byOrder(a,b) {
  if (a.order < b.order)
    return -1;
  if (a.order > b.order)
    return 1;
  return 0;
}




