import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {

	@Input() id: string;
	@Input() name: string;
	@Input() type: string;
	@Input() label: string;
	@Input() state: string;
	@Output() fieldChanged = new EventEmitter<string>();

	constructor() { }

	ngOnInit() {
	}

	onInputChange(e, id) {
		this.fieldChanged.emit(e);
	}

}
