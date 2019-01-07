import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'context',
  templateUrl: './contextmenu.component.html',
  styleUrls: ['./contextmenu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContextmenuComponent implements OnInit {

	@Input() zone: string;
	@Input() menu: string;
	loadContent: boolean = false;
	loading: boolean = true;

	constructor() {
	}

	ngOnInit() {
		const self = this;
		setTimeout( function() {
			self.registerContextMenu(self.zone, self.menu);
		}, 500);
	}
	registerContextMenu(zone, menu) {

		const self = this;
		const $menu = $(`#${menu}`);
		const $zone = $(zone);


		$zone.bind("contextmenu", function(event) {
			// console.log('context menu');
			event.preventDefault();
			// self.loadContent = true;

			$('.contextMenu').fadeOut("fast"); // close other menues

			setTimeout( function() {
				self.loading = false;
			}, 800);

			$menu.show().css({top: event.pageY - 80, left: event.pageX + 0});

		  	$('body').click(function() {
		  		self.close($menu);
			});
		});

	}

	close($menu) {
		const isHovered = $menu.is(":hover");
		if (isHovered === false) {
			$menu.fadeOut("fast");
		}
	}

	close1(target) {
		this.close($(target));
	}

}
