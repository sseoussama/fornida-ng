import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'number-field',
  templateUrl: './number-field.component.html',
  styleUrls: ['./number-field.component.scss']
})
export class NumberFieldComponent implements OnInit {

	@Input() model: any;
	@Input() onLightBg: any;
	@Output() valChange = new EventEmitter<number>();
	@Output() blurred = new EventEmitter<any>();

	constructor() { }

	ngOnInit() {
	}

	minus(model) {
		let val = this.model-1;
		val = (val<1) ? 1 : val;
		this.valChange.emit(val);
	}

	plus(model) {
		this.valChange.emit(this.model + 1);
	}

	emit_blur() {
		this.blurred.emit(this.model);
	}

	fieldChanged(val) {
		this.valChange.emit(this.model);
		// return (val<1 || typeof val != "number") ? this.model=1 : this.valChange.emit(val);
	}

}
