import { Component, OnInit, Input } from '@angular/core';
import { slugify, toArray } from '../utils';
import { FlamelinkService } from '../_services';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements OnInit {

	@Input() mode;

	tags: any;
	faqs: any;
	supportQuery: string;

	// faqs = [
	// 	{
	// 		question: 'What happens once I place my order?',
	// 		answer: 'When you complete your payment, you will receive a confirmation e-mail to advise you that we are processing your order. We will contact you by email in the event that we need further information from you, or if there is a problem with your order. You will be charged when your order is shipped.',
	// 		tags: ['placing an order']
	// 	},{
	// 		question: 'Can I place an order without creating an account?',
	// 		answer: 'When you complete your payment, you will receive a confirmation e-mail to advise you that we are processing your order. We will contact you by email in the event that we need further information from you, or if there is a problem with your order. You will be charged when your order is shipped.',
	// 		tags: ['General']
	// 	},{
	// 		question: 'What happens once I place my order?',
	// 		answer: 'When you complete your payment, you will receive a confirmation e-mail to advise you that we are processing your order. We will contact you by email in the event that we need further information from you, or if there is a problem with your order. You will be charged when your order is shipped.',
	// 		tags: ['placing an order']
	// 	},{
	// 		question: 'What happens once I place my order?',
	// 		answer: 'When you complete your payment, you will receive a confirmation e-mail to advise you that we are processing your order. We will contact you by email in the event that we need further information from you, or if there is a problem with your order. You will be charged when your order is shipped.',
	// 		tags: ['General', 'dog']
	// 	}
	// ]

	constructor(public flamelinkService: FlamelinkService) {
		this.get_faqs();
	}

	ngOnInit() {
	}

	get_faqs() {
		this.flamelinkService.getExisting('faQs', data=> {
			this.faqs = data;
			this.tags = this.setFaqTopics(data);
		})
	}

	setFaqTopics(faqs) {
        const tags = new Set();
        let tag_arrs = faqs.map( it => {
            it.tags.map(val => {
              tags.add(val)
            });
        });
        return tags;
    }

}
