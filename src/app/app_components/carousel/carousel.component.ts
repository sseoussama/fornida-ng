import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from "../../_services/localstorage.service"

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})


export class CarouselComponent implements OnInit {
	slides = [
		{
			img: 'assets/img/tmp/img-1.png'
		}
		,
		{
			img: 'assets/img/tmp/img-2.png'
		},
		{
			img: 'assets/img/tmp/img-3.png'
		},
		{
			img: 'assets/img/tmp/img-4.png'
		},
	];
	projectSlider;
	slideConfig;

	constructor(private localstorageService: LocalstorageService) { }

	ngOnInit() {
		if(this.localstorageService.isBrowser) {
			this.projectSlider = $('.slick-slider');
			this.slideConfig = {
				'slidesToShow': 1,
				'slidesToScroll': 1,
				// 'speed': 0,
				'arrows': true,
				'centerMode': true,
				'infinite': false,
				'touchThreshold': 9,
				'fade': false,
				'appendArrows': $('.slick-navi'),
				'dots': true,
				'autoplay': true,
				'autoplaySpeed': 3500
			};
		}
	}


	// slick methods
	Next() { (<any>$('.slick-slider')).slick('slickNext'); }

	Prev() { (<any>$('.slick-slider')).slick('slickPrev'); }

	showArrows() {
		const
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
