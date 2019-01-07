import { Component, OnInit } from '@angular/core';
import { BcAuthService } from '../../_services';

@Component({
  selector: 'app-faq-template',
  templateUrl: './faq-template.component.html',
  styleUrls: ['./faq-template.component.scss']
})
export class FaqTemplateComponent implements OnInit {

	mode: any;

	constructor(public bcAuthService: BcAuthService) {
		this.bcAuthService.mode.subscribe(mode => {
			this.mode = mode;
		});
	}

	ngOnInit() {
	}

}
