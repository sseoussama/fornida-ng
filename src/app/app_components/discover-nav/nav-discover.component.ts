import { Component, OnInit } from '@angular/core';
import { BcProductService } from './../../_services'

@Component({
  selector: 'discover-nav',
  templateUrl: './nav-discover.component.html',
  styleUrls: ['./nav-discover.component.scss']
})
export class NavComponent implements OnInit {

	subs: any;
	get CategoryTree() { return this.bcProductService.CategoryTree; }
	// b:any = [
	// 	{name: "Sub-Category"},
	// 	{name: "Something"},
	// 	{name: "another"},
	// 	{name: "lorem-ipsum"},
	// 	// {name: "ipsum-lora"},
	// 	// {name: "best category"},
	// 	{name: "Sub Option"}
	// ];
	categories: object = [
		{name: 'Servers', icon: 'server'},
		{name: 'Storage', icon: 'database'},
		{name: 'Networking', icon: 'share-alt'},
		{name: 'Power supplies', icon: 'battery-full'},
		{name: 'Hard drives', icon: 'soundcloud'},
		{name: 'Memory modules', icon: 'bomb'},
		{name: 'Resistors', icon: 'wifi'}
	];

	i = [
		{i18:'server'},
		{i19:'database'},
		{i21:'share-alt'},
		{i20:'battery-full'},
		{i22:'soundcloud'}
	];

	i18 = 'server';
	i19 = 'database';
	i21 = 'share-alt';
	i20 = 'battery-full';
	i22 = 'soundcloud';
	// i18 = 'bomb'
	// i18 = 'wifi'
	public names = new Map<number,string>([
	  [18, "fa fa-server"],
	  [19, "fa fa-database"],
	  [20, "fa fa-battery-full"],
	  [21, "fa fa-share-alt"],
	  [22, "fab fa-soundcloud"],
	]);

	// pre(txt) {
	// 	var self = this;
	// 	var tmp = [];
	// 	this.b.forEach(function(this1){
	// 		// console.log(this1)
	// 		tmp.push({name: txt+"_" + this1["name"]});
	// 	})
	// 	// console.log("tmp: ",tmp)
	// 	return tmp
	// }

	constructor(public bcProductService: BcProductService) {}

	ngOnInit() {}

	// ii(id) {
	// 	return this.i.filter(obj => {
	// 	  return obj.b === id
	// 	})
	// }

	setSubs(category, e) {
		// this.unsetSubs(false);
		// $('#highlights ul').addClass('fadeOutDown');
		// e.target.closest('.nav-itemm a').classList.add('active');
		// this.subs = category.subs;
		// this.subs = category.subs.sort(function() {
		// 	return .5 - Math.random();
		// });
	}
	unsetSubs(keep) {
		// $('#highlights ul').removeClass('fadeOutDown');
		// $('.nav-itemm a').removeClass('active');
		// this.subs = false;
	}

}
