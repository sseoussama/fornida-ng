import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
// declare var require: any;
// var classie = require('assets/js/classie.min.js');
import classie from 'desandro-classie';

@Component({
  selector: 'Field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {
	@Input() id: string;
	@Input() type: string;
	@Input() model: string;
	@Input() label: string;
	@Input() icon: string;
	@Output() fieldChanged = new EventEmitter<string>();

	constructor() { }

	ngOnInit() {
		this.init();
	}

	init() {
		(function() {
		// setTimeout( function(){
			// trim polyfill : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
			if (!String.prototype.trim) {
				(function() {
					// Make sure we trim BOM and NBSP
					var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
					String.prototype.trim = function() {
						return this.replace(rtrim, '');
					};
				})();
			}

			[].slice.call( document.querySelectorAll( 'input.fielD' ) ).forEach( function( inputEl ) {
				// in case the input is already filled..
				if( inputEl.value.trim() !== '' ) {
					classie.add( inputEl.parentNode, 'Input--filled' );
				}

				// events:
				inputEl.addEventListener( 'focus', onInputFocus );
				inputEl.addEventListener( 'blur', onInputBlur );
			} );

			function onInputFocus( ev ) {
				classie.add( ev.target.parentNode, 'Input--filled' );
			}

			function onInputBlur( ev ) {
				if( ev.target.value.trim() === '' ) {
					classie.remove( ev.target.parentNode, 'Input--filled' );
				}
			}
		})();
	}

	onInputChange(e, id) {
		let value = e.target.value;
		this.fieldChanged.emit(value);
	}

}









