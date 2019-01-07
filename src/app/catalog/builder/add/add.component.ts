declare var require: any;
import { Component, OnInit, ElementRef } from '@angular/core';
import { ConfigsService } from '../../../_services/configs.service';

@Component({
	selector: 'app-add',
	templateUrl: './add.component.html',
	styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

	// sample: object = [];
	get sample() { return this.configsService.Sample_data; }


	constructor(
		public configsService: ConfigsService,
		public elRef: ElementRef
		// private renderer: Renderer
	) {
		// this.sample = configsService.sample_data;
		// console.log("sample ==>",this.sample);
	}

	ngOnInit() {
		this.inputStyle();
	}

	checkToggled(e, data) {
		// console.log('checkToggled', data);
		let checked = e.target.checked;
		(checked) ? this.configsService.add_config(data) : this.configsService.remove_config(data);
	}

	onPreConfig(e, pre) {
		let self = this;
		self.unsetAllOptions();
		setTimeout(function() {
			$.each(pre.values, function(index, data) {
				var query = "input#" + data.part;
				// console.log('will toggle: ', query);
				var element = self.elRef.nativeElement.querySelector(query);
				element.checked = e.target.checked;
				element.dispatchEvent(new Event('change'));
			});
		}, 0);
	}

	unsetAllOptions() {
		var self = this;
		var i = -1;
		$("input.option_input").each(function() {
			i++;
			var element = self.elRef.nativeElement.querySelectorAll("input.option_input")[i];
			if (element.checked) {
				element.checked = false;
				element.dispatchEvent(new Event('change'));
			}
		});
	}

	unsetPreConfigs() {
		$("input.preconfig").prop("checked", false)
	}


	inputStyle() {
		// input
		$('input, select, textarea').on('click focus', function() {
			var parent = $(this).parent('.stylefield');
			$(this).siblings('input, select, textarea').focus();
			parent.addClass('focused filled');
		});
		$('input, select, textarea').on('focusout', function() {
			var parent = $(this).parent('.stylefield');
			parent.removeClass('focused');
			if ((<any>this).value === '') {
				parent.removeClass('filled')
			}
		});
	}

}
