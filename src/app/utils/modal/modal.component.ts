import { Component, OnDestroy, OnInit, EventEmitter, Output, Input, AfterViewInit } from '@angular/core';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy, AfterViewInit {

	@Output() closeModal = new EventEmitter<any>();
	@Input() width: string;

	constructor() { $('.anchor-menu').first().removeAttr('style');}

	ngOnInit() {
		$('.anchor-menu').first().removeAttr('style');
		$('#above').css('z-index', '1');
		$('.anchor-menu').first().css('z-index', '1');
	}

	ngAfterViewInit() {
    }

	onCloseModal() {
		this.closeModal.emit(false);
	}

	ngOnDestroy() {
		$('#above').removeAttr('style');
		// $('.anchor-menu').first().show();
		$('.anchor-menu').first().css('z-index', '10');
		// $('.anchor-menu').first().removeAttr('style');
	}

}
