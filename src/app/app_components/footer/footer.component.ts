import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { BcProductService, LocalstorageService, FlamelinkService, BcAuthService } from '../../_services';
import { _log } from '../../utils';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

	s_topics:any;
	mode:any;
	loginModal:any;

	@ViewChild('test') test: ElementRef;
	@ViewChild('userTrigger') userTrigger: ElementRef;

	get categoryTree() { return this.bcProductService.CategoryTree; }

	constructor(
		private bcProductService:BcProductService,
		private flamelinkService: FlamelinkService,
		private bcAuthService: BcAuthService,
		public elRef: ElementRef,
		public localstorageService: LocalstorageService
	) {
		this.bcAuthService.mode.subscribe(mode => {
			this.mode = mode;
		});
	}
	
	ngOnInit() {
		if(this.localstorageService.isBrowser) {
			this.getTopics();
		}
	}

	parentClick(parent) {
		parent.childOpen = !parent.childOpen;
		// this.router.navigate([`/category${parent.url}all`]);
		// if(this.isActive(parent)){}else {}
	}

	getTopics() {
		this.flamelinkService.getExisting('supportTopics', data=> {
			this.s_topics = data;
		});
	}

	goto(path) {
		this.bcAuthService.goto(path);
	}

	out() {
		this.bcAuthService.signOut();
	}


}
