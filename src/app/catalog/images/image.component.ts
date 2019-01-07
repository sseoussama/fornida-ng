import { Component, OnInit, Input } from '@angular/core';
import { BcProductService } from '../../_services';
declare var require: any;
declare var slick: any;
var slick = require('../../../assets/js/slick.js');
import { LocalstorageService } from "../../_services/localstorage.service"

@Component({
  selector: 'product-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {

	// images: any[];
	image: any[];
	startCar: boolean = false;

	@Input() product_id: string;  // required. will get image for that product
	@Input() carousel: boolean; // if true then will render a slick carousel
	@Input() limit: number; // limit the return
	@Input() image_id: any; // if image_id then only that image will return
	@Input() size: string; // url_standard // url_thumbnail // url_tiny // url_zoom
	@Input() loadTime: number; // how long should icon show?
	@Input() images: any;
	single:any;

	slideConfig;
	projectSlider;


	constructor(private bcProductService: BcProductService, private localstorageService: LocalstorageService) {
		this.size = (this.size) ? this.size : "url_thumbnail"; // default size
		this.loadTime = (this.loadTime) ? this.loadTime : 0; // default loadtime
	}

	ngOnInit() {
		// this.onProductImages();
		if(this.localstorageService.isBrowser) {
			this.slideConfig = {
				"slidesToShow": 1,
				"slidesToScroll": 1,
				"arrows": true,
				// "variableWidth":true;
				'centerMode': false,
				// "infinite": false,
				"touchThreshold": 9,
				"fade": false,
				"appendArrows": $('.slick-navi'),
				"dots": true,
				// "autoplay": true,
				  // "autoplaySpeed": 2000
			};
			this.projectSlider = $('.product-gallery');
			this.delayCar();
		}
		if(!this.image_id) {
			this.single = this.images[this.image_id];
		}
		this.images.map( img=>  img.url_thumbnail = img.url_thumbnail.split('?')[0] );
	}

	// onProductImages() {
	// 	if(!this.image_id) {
	// 		// get all images
	// 		this.bcProductService.getProductImages(this.product_id, this.limit).subscribe (res => {
	// 			return this.images = res.data;
	// 		});
	// 	} else {
	// 		// get single image (if no image id then get '0')
	// 		this.bcProductService.getProductImage(this.product_id, this.image_id).subscribe (res => {
	// 			return this.image = res.data;
	// 		});
	// 	}
	// }

	delayCar() {
		const self = this;
		setTimeout( function() {
			(<any>$(`#p-${self.product_id}`)).slick(self.slideConfig);
			self.startCar = true;
		},this.loadTime);
	}

	// slick methods
	Next(){ (<any>$('.slick-slider')).slick('slickNext'); }

	Prev(){ (<any>$('.slick-slider')).slick('slickPrev'); }

	showArrows(){
		var 
			lastVisible = $('.grid-item').last().hasClass('slick-active'),
			firstVisible = $('.grid-item').first().hasClass('slick-active'),
			arrowPrev = $('li.prev'),
			arrowNext = $('li.next')
		;

		// prev
		if(firstVisible){
			arrowPrev.fadeTo( "fast" , 0);
		}else{
			arrowPrev.fadeTo( "fast" , 1);
		}

		// next
		if(lastVisible){
			arrowNext.fadeTo( "fast" , 0);
		}else{
			arrowNext.fadeTo( "fast" , 1);
		}
	}
	afterChange(e) {
	}


}
