import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'layout-dark',
  templateUrl: './layout-dark.component.html',
  styleUrls: ['./layout-dark.component.scss']
})
export class LayoutDarkComponent implements OnInit {

	@Input() content: any;

	badges = [
		{
			title: "Save TIME and MONEY",
			desc: "With you IT Budget.  Get the same great hardware, with warranty, faster, for less.",
			img: "assets/img/home-config/ic-1.png"
		},{
			title: "Support",
			desc: "Peace of mind is crucial when buying Data Center gear.  All product sold buy Fornida come with the manufacturers warranty or Fornida standared 1-Year, 3-Year, or 5-Year warranty.",
			img: "assets/img/home-config/ic-2.png"
		},{
			title: "Dedicated Account Executive",
			desc: "Friendly, knowledgable, helping you get the right solution the first time.",
			img: "assets/img/home-config/ic-3.png"
		},{
			title: "Financing Options for days",
			desc: "Pay with Credit Card.  Apply for NET Terms.  Use Dell Financial Services.  Use DLL.  Buy your hardware as a service - OPEX instead of CAPEX.",
			img: "assets/img/home-config/ic-4.png"
		}
	]

	constructor() { }

	ngOnInit() {}

}
