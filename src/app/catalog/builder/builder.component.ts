declare var require: any;
import { Component, OnInit } from '@angular/core';
import { ConfigsService } from '../../_services';
import { ActivatedRoute } from '@angular/router';
// const smooth = require('src/assets/js/smoothscroll.js');



@Component({
  selector: 'app-Builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss']
})
export class BuilderComponent implements OnInit {
	public fragment: string;
	title = 'HPE PROLIANT SERVERS';
	Configs: object = [];
	config: boolean;
	// sample: Object;
	// slides = [
	// 	{img: 'assets/img/server.png'},
	// 	{img: 'assets/img/server.png'},
	// 	{img: 'assets/img/server.png'},
	// 	{img: 'assets/img/server.png'},
	// ];
	// projectSlider = $('.slick-slider');
	// slideConfig = {
	// 	'slidesToShow': 1,
	// 	'slidesToScroll': 1,
	// 	'arrows': true,
	// 	'infinite': true,
	// 	'touchThreshold': 9,
	// 	'fade': false,
	// 	'appendArrows': $('.slick-navi'),
	// 	'dots': true,
	// 	'autoplay': false,
	// };
	get sample() { return this.configsService.Sample_data; }

	constructor(
		public configsService: ConfigsService, 
		public route: ActivatedRoute,
	) {
		// this.sample = configsService.sample_data;
		console.log('sample ==>', this.sample);
		this.configsService.ConfigsChange.subscribe(value => {
			this.Configs = value;
		});
	}

	ngOnInit() {
		const self = this;
		self.route.fragment.subscribe(fragment => { this.fragment = fragment; });
	}


	emphasize(target) {
		const self = this;
		const on = {'background': '#1489DD', 'color': '#ffffff'};
		const off = {'background': '#ffffff', 'color': '#000000'};
		setTimeout( function(){
			target.css(on).delay(200).queue(function(next) {
				target.css(off);
				target.dequeue();
			});
		}, 0);
	}

	smooth(target, offset: number) {
		const self = this;
		offset = offset || 0;
		target = $(`#${target}`);
		console.log(target);
		console.log(target.length);
		if (target.length) {
			event.preventDefault();
			$('html, body').animate({
					scrollTop: target.offset().top - offset,
					easing: 'easeOutCirc'
			}, 500, function() {
				self.emphasize(target);
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
	}

	next_optionset() {}

	// slick methods
	Next() {(<any>$('.slick-slider')).slick('slickNext'); }

	Prev() {(<any>$('.slick-slider')).slick('slickPrev'); }

	showArrows() {
		let
			lastVisible = $('.grid-item').last().hasClass('slick-active'),
			firstVisible = $('.grid-item').first().hasClass('slick-active'),
			arrowPrev = $('li.prev'),
			arrowNext = $('li.next')
		;

		// prev
		if (firstVisible) {
			arrowPrev.fadeTo( 'fast' , 0);
		} else {
			arrowPrev.fadeTo( 'fast' , 1);
		}

		// next
		if (lastVisible) {
			arrowNext.fadeTo( 'fast' , 0);
		} else {
			arrowNext.fadeTo( 'fast' , 1);
		}
	}
	afterChange(e) {
		// console.log('afterChange');
	}

}
