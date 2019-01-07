import { Component, OnInit } from '@angular/core';
import { BcCartService } from '../_services';
import * as $ from 'jquery';
import { SnotifyService } from 'ng-snotify';
import 'rxjs/Rx';
declare var require: any;
const Sticky = require('sticky-js');
const Rellax = require('rellax');
import { Meta, Title }  from '@angular/platform-browser';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	// cart_id: any = localStorage.getItem("cartId");
	
	zone_1: any = [
		{
			id : "custom",
			label : "100% CUSTOM",
			excerpt: "You want to be a recluse, be our guest, build away without talking to a sole.",
			caption : "1 —  standard dummy text ever since the 1500s, when an unknown printer took a standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
			image : "assets/img/home-config/cap-right.png",
			icon: "fa fa-puzzle-piece",
		}, {
			id : "interactive",
			label : "INTERACTIVE",
			excerpt: "The Server Configurator was built with you in mind.",
			caption : "We have been in the industry for a long time. Even our most experienced engineers need a little trial and error before they get the perfect server built. Instantly see the effects of adding a component to your build... something along those lines",
			image : "assets/img/home-config/cap-right – 3.png",
			icon: "fa fa-object-group",
		}, {
			id : "livesupport",
			label : "LIVE SUPPORT",
			excerpt: "Build Away Without Talking To A Sole — BUT our engineers are here to help",
			caption : "Let us do what we do best. Your company has needs; lets talk it out together. Just click the chat icon at the bottom to start the conversation; but take it a step further by sharing your \"configurator id\". That way we can see what you see and together we will build bad a** server.",
			image : "assets/img/home-config/cap-right – 4.png",
			icon: "fas fa-headset",
			image_icon: "http://icons.iconarchive.com/icons/icons8/ios7/256/Music-Headset-icon.png"
		}, {
			id : "save",
			label : "SAVE",
			excerpt: "",
			caption : "4 — Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, wh. scrambled it to make a type specimen book.",
			image : "assets/img/home-config/save.png",
			icon: "fa fa-save",
		}, {
			id : "collaborate",
			label : "COLLABORATE",
			excerpt: "",
			caption : "4 — Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, wh. scrambled it to make a type specimen book.",
			image : "assets/img/home-config/cap-right – 2.png",
			icon: "fa fa-users",
		}, {
			id : "share",
			label : "SHARE",
			excerpt: "",
			caption : "4 — Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, wh. scrambled it to make a type specimen book.",
			image : "assets/img/home-config/cap-right.png",
			icon: "fa fa-share",
		}, {
			id : "assembly",
			label : "ASSEMBLY",
			excerpt: "You will be happy to know, Fornida does not charge for hardware configurations or ground shipping to anywhere in the continental United States.",
			caption : "",
			image : "assets/img/home-config/cap-right.png",
			icon: "fa fa-cogs",
		}, {
			id : "freeshipping",
			label : "FREE SHIPPING",
			excerpt: "",
			caption : "4 — Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, wh. scrambled it to make a type specimen book.",
			image : "assets/img/home-config/cap-right.png",
			icon: "fa fa-truck",
		}
	];

	zone_2: any = [
		{
			title: "Section Title",
			img: "https://webobjects2.cdw.com/is/image/CDW/4754858?wid=1142&hei=818&resMode=bilin&fit=fit,1",
			href: "javascript:void(0)",
			id: "left"
		}, {
			title: "Another Title",
			img: "https://i.dell.com/is/image/DellContent//content/dam/global-site-design/product_images/dell_enterprise_products/storage_systems/md_series/md1200/global_spi/storage-md-series-md1200-left-hero-685x350-ng.psd?fmt=jpg&wid=570&hei=400",
			href: "javascript:void(0)",
			id: "right"
		}
	];

	zone_pulse: any = [
		{
			caption: "IP Telephony",
			img: "https://xorcom.com/wp-content/uploads/2016/12/xp0150g-Ip-Phone.png",
			href: "javascript:void(0)",
			cto: "Call to Action"
		}, {
			caption: "Routers",
			img: "http://www.netgear.co.uk/images/Products/Networking/DSLmodemrouters/D7000/D7000_Hero_Transparent.png",
			href: "javascript:void(0)",
			cto: "Call to Action"
		}, {
			caption: "Switches",
			img: "assets/img/tmp/i-workstation.png",
			href: "javascript:void(0)",
			cto: "Call to Action"
		}, {
			caption: "Wireless",
			img: "https://www.computerpcmedic.com/wp-content/uploads/2017/05/home-business-wifi-network-devices.png",
			href: "javascript:void(0)",
			cto: "Call to Action"
		}
	];

	constructor(
		public notice: SnotifyService,
		private meta: Meta,
		private title: Title
	) {
		title.setTitle('Fornida — Custom Server Configurator');
		meta.addTags([
		    { name: 'og:title', content: 'Fornida — Server Configurator' },
		    { name: 'og:description', content: 'Fornida is a leading independent distributor of electronic commodities located in Plano, TX. We are an authorized retailer of new and certified refurbished Dell HPE servers and server components. We offer a full range of supply chain solutions to address any sourcing need. Build custom servers using our free server builder tool or let us guide you through the process to ensure you find the best solution to fit your company\'s needs.' },
		    { name: 'og:image', content: 'https://cdn7.bigcommerce.com/s-2bihpr2wvz/product_images/uploaded_images/fornida-servers2.png' },
		]);
	}


	ngOnInit() {
		$('#above').css('overflow', 'hidden');
		setTimeout( function(){
			// var rellax = new Rellax('[data-rellax-speed]');
		}, 1000);
	}



}













