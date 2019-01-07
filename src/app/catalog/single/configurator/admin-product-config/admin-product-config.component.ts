declare var require: any;
declare const JSONEditor: any;
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { AssetService, ConfigsService, BcProductService } from '../../../../_services';
const unique = require('unique-words');

@Component({
  selector: 'admin-prod-config',
  templateUrl: './admin-product-config.component.html',
  styleUrls: ['./admin-product-config.component.scss']
})
export class AdminProductConfigComponent implements OnInit, OnDestroy {

	@Input() data: any;
	@Input() sku: any;
	@Input() loc: any;
	@Output() closeModal = new EventEmitter<any>();
	jsasset = '/assets/js/jsoneditor/jsoneditor.min.js';
	json: any;
	editor: any;
	revert: any;
	clone: any;
	all_names: any;
	changes: boolean;

	get All() { return this.bcProductService.AllProducts; }

	constructor(
		public assetService: AssetService,
		public configsService: ConfigsService,
		public bcProductService: BcProductService
	) {
		const self = this;
	}

	ngOnInit() {
		this.all_names = this.All.map(i=>i.name);
		this.clone = JSON.parse(JSON.stringify(this.data));
		this.jsonEditor();
	}

	ngOnDestroy() {
        this.assetService.removeScript(this.jsasset);
    }

	close() {
		this.closeModal.emit(false);
	}

	jsonEditor() {
		const self = this;
		// create the editor
		this.assetService.loadScript(this.jsasset).then(data => {
	        const container = document.getElementById("jsoneditor");
	        const options = {
	            mode: 'tree',
	            modes: ['code', 'tree'], // allowed modes
	            sortObjectKeys: false,
	            templates: [
			        {
			            text: 'Set',
			            title: 'New Set',
			            className: 'jsoneditor-type-object',
			            field: 'set_unique_key',
			            value: {
			                'name': 'Set Name Here',
			                'slug': 'set_unique_key (same as above)',
			                'options': {},
			                'required': false,
			                'radio': false
			            }
			        },{
			            text: 'note',
			            title: 'Add note',
			            field: 'note',
			            value: {
			                'value': 'write your note here',
			            }
			        }
			    ],
			    autocomplete: {
			    	caseSensitive: false,
			      	applyTo:['value'],
					getOptions: function (text, path, input, editor) {
						return new Promise(function (resolve, reject) {
							var options = self.all_names;
							if (options.length > 0) resolve(options); else reject();
						});
					}
			    },
	            onError: function (err) {
	              alert(err.toString());
	            },
	            onChange: function () {
	             	self.changes = true;
	            },
	            onChangeJSON: function (json) {
	            	// deprecated?
	            },
	        };
	        this.editor = new JSONEditor(container, options, this.data);

	        // this.editor.set();

	        // Set json
	        this.json = this.editor.get();
        });
	}

	setOrder() {
		let json = this.getJSON();
		// const orderWasUpdated = '';
		// if(orderWasUpdated) {
			this.editor.node.childs.map( (it, i) => json[it.field]['order'] = i );
			this.editor.set(json);
			console.log( 'this.editor ==>', this.getJSON() );
		// }
	}

	getJSON() {
		let mode = this.editor.getMode();
        return this.json = this.editor.get();
    }

    set_loc() {
    	console.log(this.data[0])
    	// let base = `/products/${this.sku}/data/config`;
    	// if(this.data.options) {
    	// 	console.log(this.data[0].options)
    	// 	this.loc = base;
    	// } else {
    	// 	console.log(this.data.options)
    	// 	this.loc = `${base}/${this.data.set.slug}/options/${this.data.key}`;
    	// }
    	// return this.loc = (this.data.options) ? base : `${base}/${this.data.set.slug}/options/${this.data.key}`;
    }

	save() {
		this.setOrder();
		this.configsService.set(this.loc,this.getJSON());
		this.revert = true;
		this.changes = false;
	}

	revert_config() {
		this.configsService.set(this.loc,this.clone);
		this.editor.set(this.clone);
		this.revert = false;
	}


}











