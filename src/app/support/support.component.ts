import { Component, OnInit } from '@angular/core';
import { BcAuthService, FlamelinkService } from '../_services';
import { slugify, toArray } from '../utils';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {

	mode: any;
	user: any;
	user_subscription: any;
	supportQuery: string;

	links = [
		{ name: 'FAQs', slug: 'faqs', link: '/faqs' },
		{ name: 'account', slug: 'account', link: '/account' },
		{ name: 'about', slug: 'about', link: '/about' },
		{ name: 'contact', slug: 'contact', link: '/contact' },
		{ name: 'privacy', slug: 'privacy', link: '/privacy' },
		{ name: 'Shipping', slug: 'Shipping', link: '/Shipping' }
	]

	topics: any;
	// topics = [
	// 	{
	// 		name: 'getting started',
	// 		img: 'assets/img/ColoredLineIcons/png/256/book.png',
	// 		link: '/page/sample',
	// 		excerpt: 'Welcome! We\'re so glad you\'re here. Let\'s get started!'
	// 	},{
	// 		name: 'Account',
	// 		img: 'assets/img/ColoredLineIcons/png/256/folder.png',
	// 		link: '/',
	// 		excerpt: 'From blah to blah — learn how it works from top to bottom!'
	// 	},{
	// 		name: 'Shipping Policy',
	// 		img: 'https://images.vexels.com/media/users/3/153848/isolated/preview/3c40a52f106e0cc6a121902be8e75bbc-push-cart-with-box-icon-by-vexels.png',
	// 		link: '/',
	// 		excerpt: 'Welcome! We\'re so glad you\'re here. Let\'s get started!'
	// 	},{
	// 		name: 'Configurator',
	// 		img: 'assets/img/ColoredLineIcons/png/256/bulletin_board.png',
	// 		link: '/',
	// 		excerpt: 'From blah to blah — learn how it works from top to bottom!'
	// 	},{
	// 		name: 'FAQs',
	// 		img: 'assets/img/ColoredLineIcons/png/256/lightbulb_idea.png',
	// 		link: '/',
	// 		excerpt: 'From blah to blah — learn how it works from top to bottom!'
	// 	},{
	// 		name: 'Contact Us',
	// 		img: 'assets/img/ColoredLineIcons/png/256/fountain_pen.png',
	// 		link: '/',
	// 		excerpt: 'From blah to blah — learn how it works from top to bottom!'
	// 	}
	// ]


	constructor(
		public bcAuthService: BcAuthService,
		public flamelinkService: FlamelinkService
	) {
		this.getTopics();
		this.bcAuthService.mode.subscribe(mode => {
			this.mode = mode;
			this.getUser(mode.email);
		});
	}

	ngOnInit() {
	}

	getTopics() {
		this.flamelinkService.getExisting('supportTopics', data=> {
			this.topics = data;
		})
	}


	getUser(email) {
		setTimeout( e => {
			this.user = this.bcAuthService.user;
		},1000);
		
		// this.user_subscription = this.bcAuthService.get_user({email: mode.email}).subscribe(user=>this.user=user);
		// setTimeout(e=>this.user_subscription.unsubscribe,1500);
	}


}

function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
}
