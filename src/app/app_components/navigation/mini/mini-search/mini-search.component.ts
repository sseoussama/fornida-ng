import { Component, OnInit } from '@angular/core';
import { BcProductService } from './../../../../_services';
import { FilterPipe } from '../../../../utils';


@Component({
  selector: 'app-mini-search',
  templateUrl: './mini-search.component.html',
  styleUrls: ['./mini-search.component.scss'],
  // pipes: [FilterPipe]
})


export class MiniSearchComponent implements OnInit {

	searchText: string;

	get Products() { return this.bcProductService.AllProducts; }

	constructor( public bcProductService: BcProductService ) { }

	ngOnInit() {}

	isConfigurable(p) {
		return (p.custom_fields) ? JSON.stringify(p.custom_fields).includes('use_builder') : false;
	}

}
