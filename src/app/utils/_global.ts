declare var require: any;
export { SnotifyService } from 'ng-snotify';
import { environment } from '../../environments/environment';

export const _log = function(msg, style, data?) {
	data = (data) ? data : '';
	let s = "";
	let s1 = "";
	switch ( style ) {
	    case 't': // terminal
	        s = "background: #222; color: #bada55";
	        break;
        case 'i': // info
            s = "background: #efefef; color: blue; 'font-weight:900;'";
            break;
	    case 'bc': // bigCommerce API
            s = "background: #4b71fc; color: #fff; 'font-weight:900;'";
            break;
        case 'fb': // FireBase API
	    	s = "background: #ffcb00; color: #333; 'font-weight:900;'";
	        break;
        case 'fl': // FlameLink API
	    	s = "background: #f27c57; color: white; 'font-weight:bold;'";
	        break;
        case 'e': // error
            s = "background: red; color: white; 'font-weight:bold;'";
            break;
        case 'd': // default
            s = "background: #333; color: white; 'font-weight:bold;'";
            break;
        case 'y': // yellow
            s = "background: #FFBB3B; color: white; 'font-weight:bold;'";
            break;
        case 's': // success
            s = "background: green; color: white; 'font-weight:bold;'";
            break;
        case 'listener': // listener
            s = "background: #efefef; color: red; 'font-weight:bold;'";
            s1 = "⦕";
            break;
        case 'o': // orange
            s = "background: #f27c57; color: white; 'font-weight:bold;'";
            break;
	    default:
	       s = "background: #222; color: #bada55";
	}

    if (localStorage.getItem("isBrowser") === "true" && !environment.production) {
	    console.log(`%c ${s1} ${msg}`, s, data);
    } else if (environment.production) {
        // console.log(`%c ${s1} ${msg}`);
    }
};


export const slugify = function(TexT) {
    TexT = TexT || "";
    return TexT .toLowerCase() .replace(/[^\w ]+/g,'') .replace(/ +/g,'-') ;
};

export const toArray = function(obj_obj) {
    return Object.keys(obj_obj).map(i => obj_obj[i]);
};

export const show: object = {
	i6: {w: 374},
    i7: {w: 600},
    pro13: {w: 1280},
    pro15: {w: 1440},
    pro27: {w: 2600},
    ipadpro: {w: 1024, h: 1366},
    upto: function(device, exclude) {
    	exclude = (exclude) ? 2 : 0;
    	return {
    		sizes : {
    			max: this[device].w - exclude,
    			min: 300
    		}
    	};
    },
    downto: function(device, exclude) {
    	exclude = (exclude) ? 2 : 0;
    	return {
    		sizes : {
    			max: 3000,
    			min: this[device].w + exclude
    		}
    	};
    },
    on: function(device, exclude) {
    	exclude = (exclude) ? 2 : 0;
    	return {
    		sizes : {
    			max: this[device].w - exclude,
    			min: this[device].w + exclude
    		}
    	};
    },
};


const icon1 = function(icon) {
    let foo;
    switch ( icon ) {
        case 'checkIcon':
            foo = {icon: "/assets/img/notice-check.svg"};
        break;
        case 'errIcon':
            foo = {icon: "/assets/img/notice-err.svg"};
        break;
        case 'trashIcon':
            foo = {icon: "/assets/img/notice-trash.svg"};
        break;
        default:
            foo = null;
        break;
    }
    return foo;
};


const checkIcon = {icon: "/assets/img/notice-check.svg"};
const errIcon = {icon: "/assets/img/notice-err.svg"};
const trashIcon = {icon: "/assets/img/notice-trash.svg"};

const defaultParams = {
    timeout: 10000,
    showProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    position: 'rightTop',
    titleMaxLength: 30
};

export const notice = function(icon) {
    return Object.assign( defaultParams, icon1(icon) );
};

export const productCondition = function(sku) {
    sku = sku.toLowerCase();
    if (sku.includes('/rf')) {
        return {
            val: "Refurbished",
            info: "an explination of Refurbished"
        };
    } else if(sku.includes('/no')) {
        return {
            val: "New",
            info: "an explination of New"
        };
    } else if(sku.includes('/ct')) {
        return {
            val: "New Configure",
            info: "an explination of New Configure"
        };
    } else if(sku.includes('/cr')) {
        return {
            val: "configured refurbished",
            info: "an explination of configured refurbished"
        };
    } else {
        return {
            val: "New",
            info: "an explination of New"
        };
    }
};



// export const isAuth = function(icon) {
//     this.email = localStorage.getItem("email");
//     this.authenticated = (this.email != null);
//     console.log("this.authenticated: ", this.authenticated, this.email);
//     _log(' == Authenticated ==> ', 'i', this.email);
//     if ( this.authenticated ) {
//         this.get_user(this.email);
//     }
// }

export const Loader: object = {
    show: function() {
      $('.whiteout').fadeIn(200);
    },
    hide: function() {
      $('.whiteout').fadeOut(200);
    }
};



export const states = [
    {name: 'ALABAMA', abv: 'AL'},
    {name: 'ALASKA', abv: 'AK'},
    {name: 'ARIZONA', abv: 'AZ'},
    {name: 'ARKANSAS', abv: 'AR'},
    {name: 'CALIFORNIA', abv: 'CA'},
    {name: 'COLORADO', abv: 'CO'},
    {name: 'CONNECTICUT', abv: 'CT'},
    {name: 'DELAWARE', abv: 'DE'},
    {name: 'FLORIDA', abv: 'FL'},
    {name: 'GEORGIA', abv: 'GA'},
    {name: 'HAWAII', abv: 'HI'},
    {name: 'IDAHO', abv: 'ID'},
    {name: 'ILLINOIS', abv: 'IL'},
    {name: 'INDIANA', abv: 'IN'},
    {name: 'IOWA', abv: 'IA'},
    {name: 'KANSAS', abv: 'KS'},
    {name: 'KENTUCKY', abv: 'KY'},
    {name: 'LOUISIANA', abv: 'LA'},
    {name: 'MAINE', abv: 'ME'},
    {name: 'MARYLAND', abv: 'MD'},
    {name: 'MASSACHUSETTS', abv: 'MA'},
    {name: 'MICHIGAN', abv: 'MI'},
    {name: 'MINNESOTA', abv: 'MN'},
    {name: 'MISSISSIPPI', abv: 'MS'},
    {name: 'MISSOURI', abv: 'MO'},
    {name: 'MONTANA', abv: 'MT'},
    {name: 'NEBRASKA', abv: 'NE'},
    {name: 'NEVADA', abv: 'NV'},
    {name: 'NEW HAMPSHIRE', abv: 'NH'},
    {name: 'NEW JERSEY', abv: 'NJ'},
    {name: 'NEW MEXICO', abv: 'NM'},
    {name: 'NEW YORK', abv: 'NY'},
    {name: 'NORTH CAROLINA', abv: 'NC'},
    {name: 'NORTH DAKOTA', abv: 'ND'},
    {name: 'OHIO', abv: 'OH'},
    {name: 'OKLAHOMA', abv: 'OK'},
    {name: 'OREGON', abv: 'OR'},
    {name: 'PENNSYLVANIA', abv: 'PA'},
    {name: 'RHODE ISLAND', abv: 'RI'},
    {name: 'SOUTH CAROLINA', abv: 'SC'},
    {name: 'SOUTH DAKOTA', abv: 'SD'},
    {name: 'TENNESSEE', abv: 'TN'},
    {name: 'TEXAS', abv: 'TX'},
    {name: 'UTAH', abv: 'UT'},
    {name: 'VERMONT', abv: 'VT'},
    {name: 'VIRGINIA', abv: 'VA'},
    {name: 'WASHINGTON', abv: 'WA'},
    {name: 'WEST VIRGINIA', abv: 'WV'},
    {name: 'WISCONSIN', abv: 'WI'},
    {name: 'WYOMING', abv: 'WY'}
];




// flamelink
// const flamelink = require('flamelink');
// const content = flamelink( environment.firebase ).content;























