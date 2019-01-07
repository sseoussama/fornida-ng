declare let JSONEditor: any;
declare var require: any;
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { AssetService } from '../../_services';
// require('../../../assets/js/jsoneditor/jsoneditor.min.js');

@Component({
  selector: 'json-viewer',
  templateUrl: './json-viewer.component.html',
  styleUrls: ['./json-viewer.component.scss']
})
export class JsonViewerComponent implements OnInit, OnDestroy {

	@Input() data: any;
	@Output() closeModal = new EventEmitter<any>();
	jsasset = '/assets/js/jsoneditor/jsoneditor.min.js';

	constructor(public assetService: AssetService,) {
	}

	ngOnInit() {
		this.jsonEditor();
		// console.log("jsonViewer: ",typeof this.data,": ",this.data);
	}

	ngOnDestroy() {
        this.assetService.removeScript(this.jsasset);
    }

	close() {
		this.closeModal.emit(false);
	}

	jsonEditor() {
		// create the editor
        const container = document.getElementById("jsoneditor");
        const options = {
            mode: 'tree',
            modes: ['code', 'form', 'text', 'tree', 'view'], // allowed modes
            onError: function (err) {
              alert(err.toString());
            },
            onChange: function () {
              // console.log('change');
            },
        };
        const editor = new JSONEditor(container, options);

        editor.set(this.data);

        // get json
        const json = editor.get();
	}

}
