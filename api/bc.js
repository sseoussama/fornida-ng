const BigCommerce = require('node-bigcommerce');
// const admin = require('firebase-admin');
// const firebase = require('firebase/app');
// require('firebase/database');
const fb = require("./firebase");
const bc = {};
var jwt = require('jwt-simple');


// const cloudnav_sand = new BigCommerce({
//     logLevel: 'Carts, Checkout Content, Themes, Content, Customers, Customers Login, Information & Settings, Marketing, Orders, Products, Order Transactions',
//     accessToken: '4qheyn0e9k2ak4or1gakwn2jtu5fx5r',
//     clientId: 'nxqq7s8r805qtjjxnea6s8l4x5ytypf',
//    account.secret 'qrtl0tdz778j36pce75y3fq7dxvh2t2',
//     callback: 'http://localhost:3200/api/auth',
//     responseType: 'json',
//     apiVersion: 'v3',
//     storeHash: 'fcknjlyuc'
// });


// const account = {
//     logLevel: 'Carts, Checkout Content, Themes, Content, Customers, Customers Login, Information & Settings, Marketing, Orders, Products, Order Transactions',
//     accessToken: '5e6a0tidjs6ex4intfh04ozgneftx0n',
//     clientId: 'ckn8g3ygux2f4pmxel43gjnbc95bgak',
//     secret: 'tc2nm1omsi240rvep8rdd652hxiyoie',
//     callback: 'http://localhost:8080/api/auth',
//     responseType: 'json',
//     storeHash: '2bihpr2wvz',
//     entry_url: "https://store-2bihpr2wvz.mybigcommerce.com"
// };

const app = {
    logLevel: 'Carts, Checkout Content, Themes, Content, Customers, Customers Login, Information & Settings, Marketing, Orders, Products, Order Transactions',
    accessToken: 'qrqxb2zmwxs6vf4f0z4ajnlk3o7w5dh', // from api account (Fornida-API-Connector)
    clientId: '1h194a72tsu6w5ytp8jtkppw88s1cvb',
    // secret: 'fz2h0powwdibhy08by7hgdrk8emfhhj', // from api account (Fornida-API-Connector)
    secret: 'd14z0h5cw367d7pcip51zjo4594k84p',
    callback: 'http://localhost:8080/api/auth',
    responseType: 'json',
    storeHash: '2bihpr2wvz',
    entry_url: "http://localhost:3100"
    // entry_url: "https://store-2bihpr2wvz.mybigcommerce.com"
};

const bc_v3 = new BigCommerce(Object.assign(app, {apiVersion: 'v3'}));
const bc_v2 = new BigCommerce(Object.assign(app, {apiVersion: 'v2'}));
const bc_app = new BigCommerce(Object.assign(app, {apiVersion: 'v3'}));







// const credentials = {
//     apiKey: "AIzaSyBmQYZaR7GH2mmkzl3k10bDhk82DB7VPOU",
//     authDomain: "fornida-6f0cf.firebaseapp.com",
//     databaseURL: "https://fornida-6f0cf.firebaseio.com",
//     projectId: "fornida-6f0cf",
//     storageBucket: "fornida-6f0cf.appspot.com",
//     messagingSenderId: "293827765974"
// };
// firebase.initializeApp(credentials);
// const db = firebase.database();
// function activityRef(slug){ 
//     return db.ref(`user/${slug}/activity/data`);
// }
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
// });







bc.auth = (req, res, next) => {
    console.log("AUTH ==>", req.query)
    bc_app.authorize(req.query).then(data => {
        console.log('auth res ==>'.blue, data);
        return res.json({ data: data })
    }).catch(next);
};


bc.update_cart_item = (req,res,next) => {
    let cartId = req.body.cartId;
    let item = req.body.item;
    return bc_v3.put(`/carts/${cartId}/items/${item.id}`, {line_item:item}).then(data => {
        return data;
    }).catch(next);
};

bc.add_to_cart = (data,next) => {
    let payload = {
        line_items: data.line_items,
        option_selections: data.option_selections,
        gift_certificatesL: null
    }
    console.log("add_to_cart =>", data.cartId, pretty(payload).magenta);
    return bc_v3.post(`/carts/${data.cartId}/items`, payload).then(data => {
        return data;
    }).catch(next);
};

bc.create_cart = (data1,next) => {
    let payload = {
        customer_id: 1,
        line_items: data1.line_items
    }
    return bc_v3.post('/carts', payload).then(data => {
        return data;
    }).catch(next);
};

bc.get_cart_urls = (cartId,next) => {
    return bc_v3.post(`/carts/${cartId}/redirect_urls`, {cartId:cartId}).then(data => {
        return data;
    }).catch(next);
};

bc.get_cart = (req, res, next) => {
    let cartId = req.query.cart_id;
    console.log(`getting cartId: ${cartId}`.bgWhite.black.bold);
    return bc_v3.get(`/carts/${cartId}?include=line_items.physical_items.options,line_items.physical_items.custom_fields`, req.query).then(data => {
        console.log(`getting cartId: ${data}`.bgWhite.black.bold);
        return include_stash(data, (cart) => {
            console.log(`cart: ${pretty(cart.data.id)}`.bgGreen.black.bold);
            res.send(cart);
        });
        // res.send(data) // without stashes
    }).catch(er => {
        console.log(`Cart Error: ${pretty(er)}`.bgRed.black.bold);
        return res.send(er); // send er so app can react
    });
};

// tmp({
//     query: {
//         "cart_id": "ea63c1c7-4c61-419f-a505-515f5f904a01",
//         "include": "line_items.physical_items.options"
//     }
// });

// function tmp(req) {
//     let cartId = req.query.cart_id;
//     console.log('tmp: ', cartId)
//     return bc_v3.get(`/carts/${cartId}?include=line_items.physical_items.options,line_items.physical_items.custom_fields`, req.query).then(data => {
//         console.log(data);
//         return include_stash(data, (cart) => {
//             console.log(`SENDING cartData: ${ pretty(cart.data.id) }`.bgGreen.black)
//             // return cart;
//             // res.send(cart);
//         });
//         // return data; // without stashes
//     }).catch(er => {
//         return er;
//     });
// }

function include_stash(cartData, send_cart) {
    console.log(`include_stash ${cartData.data.id}`.bgRed);
    const self = this;
    let line_items = cartData.data.line_items.physical_items;
    let options = line_items.map(b => b.options);
    let build_ids = [];
    let parents = [];
    
    
    // put all ids into build_ids
    for (let key in options) {
        // let self = options[key];
        // if (self.length && self[0].name==='build_id') {
        if (options[key].length && JSON.stringify(options[key]).includes('build_parent')) {
            build_ids.push(options[key][0].value);
        }
    }

    // only if builds exist
    if (!build_ids.length) return send_cart(cartData);
    
    // mark cart data
    cartData.data.hasBuilds = true;

    // only uniques
    build_ids = build_ids.filter((item, pos) => build_ids.indexOf(item) == pos);
    console.log(`build_ids: ${pretty(build_ids)}`.bgRed);

    const builds = [];

    // get stashed from unique
    step(-1);
    function step(i) {
        i = i+1;
        let more = i !== build_ids.length-1;
        return getStash(build_ids[i], (build)=> {
            // console.log(`Modifying ====> ${build.build_id} (${build.parent_product_id}) ${typeof line_items}`.bgYellow.black.bold);
            // console.log(options);
            if (!build) {
                console.log('no build ==>', i);
                // return send_cart(cartData);
                // builds.push('skipping')
                return (more) ? step(i) : send_cart(cartData);
            }
            console.log(more, `: ${i} vs ${build_ids.length-1}`);
            console.log(`${i} vs ${build_ids.length}`);
            // let ths = options.find(x => x.name === 'build_parent' );
            let ths = line_items.find(x => 
                JSON.stringify(x).includes('build_parent') &&
                JSON.stringify(x).includes(build.build_id)
            );
            // console.log(`ths => ${pretty(ths)}`.bgYellow.black.bold);
            
            ths['components'] = build.components;
            ths['buildQty'] = build.buildQty;
            ths['build_id'] = build.build_id;
            updateComponentPrices(ths.components, line_items, () => {
                const configs_sum = sum(ths.components, 'price') || 0;
                ths['per_total'] = configs_sum;
                ths['total'] = ths.per_total * ths.buildQty;

                // continue
                // builds.push(build.build_id);
                return (more) ? step(i) : send_cart(cartData);
            });
        })
    }

}

function sum(items, prop) {
  return items.reduce(function (a, b) {
    return a + b[prop] * b['quantity'];
  }, 0);
}

function updateComponentPrices(components, line_items, next) {
  const total = components.length;
  let i;
  for (i = 0; i < total; i++) {
    let line_price = line_items.find(x => x.product_id === components[i].id).list_price
    components[i].price = line_price;
    if (i + 1 === total) { next(); }
  }
}

function getStash(buildId, addBuild) {
    console.log(`getStash: ${buildId}`.bgCyan);
    return fb.subscribe(`stashed/${buildId}`).once('value', function (snapshot) {
        console.log('====>snapshot', typeof snapshot.val())
        return addBuild(snapshot.val());
    });
}

bc.delete_item = (cartId, itemId, next) => {
    return bc_v3.delete(`/carts/${cartId}/items/${itemId}`).then(confirmation => {
        return confirmation;
    }).catch(next);
};

bc.CustomerToken = () => {
    return bc_v3.get('/products').then(data => {
        return data;
    }).catch(next);
};

bc.getProducts = (req, res, next) => {
    // let params = JSON.stringify(req.query);
    let params = req.query;
    params['include'] = 'custom_fields,images';
    console.log('params:'.bgBlue, params);
    params = Object.keys(params).map(function(k) { return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]) }).join('&')
    // let id = params.categories;
    return bc_v3.get('/catalog/products?'+params).then(data => {
        return data;
    }).catch(next);
};

bc.getCategories = (req, res, next) => {
    let params = req.query;
    params = Object.keys(params).map(function(k) { return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]) }).join('&')
    return bc_v3.get('/catalog/categories?'+params).then(data => {
        return data;
    }).catch(next);
};

bc.getCategoryTree = (next) => {
    return bc_v3.get('/catalog/categories/tree').then(data => {
        return data;
    }).catch(next);
};

bc.getProductImages = (req, res, next) => {
    let product_id = req.query.product_id;
    let limit = req.query.limit;
    return bc_v3.get(`/catalog/products/${product_id}/images?limit=${limit}`).then(data => {
        return data;
    }).catch(next);
};

bc.getProductImage = (req, res, next) => {
    let product_id = req.query.product_id;
    let image_id = req.query.image_id;
    return bc_v3.get(`/catalog/products/${product_id}/images/${image_id}`).then(data => {
        return data;
    });
};

bc.getProductById = (req, res, next) => {
    let product_id = req.query.product_id;
    return bc_v3.get(`/catalog/products/${product_id}?include=custom_fields,images`).then(data => {
        return data;
    });
};

bc.getOptionById = (req, res, next) => {
    let data = req.query;
    let product_id = req.query.id;
    let option_id = req.query.option_set_id;
    return bc_v3.get(`/catalog/products/${product_id}/options/${option_id}`).then(data => {
        console.log(`options by id => ${pretty(data)}`.magenta);
        return data;
    }).catch(next);
};

bc.getOptions = (req, res, next) => {
    let product_id = req.query.id;
    return bc_v3.get(`/catalog/products/${product_id}/options`).then(data => {
        console.log(`options => ${pretty(data)}`.magenta)
        return data;
    }).catch(next);
};

bc.getVariantsByProductId = (req, res, next) => {
    let product_id = req.query.id;
    return bc_v3.get(`/catalog/products/${product_id}/variants`).then(data => {
        return data;
    }).catch(next);
};

bc.getBrands = (req, res, next) => {
    return bc_v3.get(`/catalog/brands`).then(data => {
        return data;
    }).catch(next);
};

bc.get_user = (req,res,next) => {
    let email = req.query.email;
    return bc_v2.get(`/customers?email=${email}`, {email:email}).then(data => {
        return data;
    }).catch(next);
};


bc.get_user_address = (req,res,next) => {
    let email = req.query.email;
    return bc_v2.get(`/customers?email=${email}`, {email:email}).then(data => {
        return bc_v2.get(`${data[0].addresses.resource}`).then(address => {
            let obj = {address:address};
            let withaddress = Object.assign(data[0], obj);
            // console.log(`with address => ${pretty(withaddress)}`.yellow)
            return withaddress;
        });
    }).catch(next);
};

bc.create_customer = (req,res,next) => {
    console.log(`req: ${pretty(req.body)}`.magenta);
    return bc_v2.post(`/customers`, req.body).then(data => {
        console.log(`res: ${pretty(data)}`);
        return data;
    }).catch(next);
};

bc.update_customer = (req,res,next) => {
    const params = req.body.params;
    console.log(`req: ${pretty(params)}`.blue);
    return bc_v2.put(`/customers/${params.uid}`, {_authentication:params._authentication}).then(data => {
        console.log(`res:`, data);
        return data;
    }).catch(next);
};

function decode_utf8(s) {
  return decodeURIComponent(escape(s));
}

function get_token(req, data) {
    let uid = req.id;
    let email = req.email;
    let time = Math.round((new Date()).getTime() / 1000);
    let  payload = {
        "iss": app.clientId,
        // "iat": Math.floor(new Date() / 1000),
        "iat": time,
        "jti": uid+"-"+time,
        "operation": "customer_login",
        "store_hash": app.storeHash,
        "customer_id": uid,
        "redirect_to": '/'
    }
    console.log(`${pretty(payload)}`.cyan);
    let token = jwt.encode(payload, app.secret, 'HS256');
    token = decode_utf8(token);
    let sso_url = `${app.entry_url}/login/token/${token}`;
    console.log(`sso_url ==> `.cyan, sso_url);
    let resp = {
        sso_url: sso_url,
        success: true,
        email: email,
        uid: uid,
        token: token
    }
    return resp;
}

bc.goto = (req,res,next) => {
    let time = Math.round((new Date()).getTime() / 1000);
    let  payload = {
        "iss": app.clientId,
        // "iat": Math.floor(new Date() / 1000),
        "iat": time,
        "jti": req.query.uid+"-"+time,
        "operation": "customer_login",
        "store_hash": app.storeHash,
        "customer_id": req.query.uid,
        "redirect_to": req.query.path
    }
    let token = jwt.encode(payload, app.secret, 'HS256');
    token = decode_utf8(token);
    let sso_url = {url: `${req.query.stencil}/login/token/${token}`};
    res.send(sso_url);
}

bc.login = (req,res,next) => {
    let id = req.query.id;
    let password = req.query.password;
    let email = req.query.email;
    return bc_v2.post(`/customers/${id}/validate`, {password:password}).then(data => {
        return (data.success) ? get_token(req.query, data) : Object.assign(data,{msg:"Password Validation Failed"});
    }).catch(next);
};


bc.getCustomFields = (req,res,next) => {
    let id = req.query.id;
    console.log('getCustomFields:'.bgCyan, id);
    return bc_v3.get(`/catalog/products/${id}/custom-fields`).then(data => {
        return data;
    }).catch(e => {
        console.log(e);
    });
};

bc.makeCustomField = (req,res,next) => {
    let id = req.query.id;
    let field = {
        name: req.query.name,
        value: req.query.value,
    };
    console.log('makeCustomField:'.bgCyan, req.query);
    return bc_v3.post(`/catalog/products/${id}/custom-fields`, field).then(data => {
        return data;
    }).catch(next);
};

bc.updateCustomField = (req,res,next) => {
    let id = req.query.id;
    let field_id = req.query.field_id;
    let field = {
        name: req.query.name,
        value: req.query.value,
    };
    console.log('makeCustomField:'.bgCyan, req.query);
    return bc_v3.put(`/catalog/products/${id}/custom-fields/${field_id}`, field).then(data => {
        return data;
    }).catch(next);
};

bc.getProductModifier = (req,res,next) => {
    let product_id = req.query.product_id;
    console.log('getProductModifier:'.bgCyan, req.query);
    return bc_v3.get(`/catalog/products/${product_id}/modifiers`).then(data => {
        return data;
    }).catch(next);
};

bc.addProductModifier = (req,res,next) => {
    let payload = {
        "name": req.query.field_name,
        "display_name": req.query.field_name,
        "type": "text",
        "required": true,
        "config": {
            "default_value": req.query.default,
            "text_characters_limited": false,
            "text_min_length": 0,
            "text_max_length": 0
        },
        "option_values": []
    }
    let product_id = req.query.product_id;
    console.log('addProductModifier:'.bgCyan, req.query);
    return bc_v3.post(`/catalog/products/${product_id}/modifiers`, payload).then(data => {
        return data;
    }).catch(next);
    // .catch( err => {
    //     return bc_v3.put(`/catalog/products/${product_id}/modifiers`, payload).then(data => {
    //         return data;
    //     }).catch(next);
    // });
};

bc.removeCustomField = (req,res,next) => {
    let id = req.query.id;
    let field_id = req.query.field_id;
    return bc_v3.delete(`/catalog/products/${id}/custom-fields/${field_id}`).then(data => {
        return data;
    }).catch(next);
};

bc.addCoupon = (req,res,next) => {
    console.log('addCoupon =>'.magenta, req.query);
    let coupon_code = req.query.coupon_code;
    let checkoutId = req.query.checkoutId;
    return bc_v3.post(`/checkouts/${checkoutId}/coupons`, { "coupon_code": coupon_code }).then(data => {
        return data;
    }).catch(next);
};

bc.removeCoupon = (req,res,next) => {
    let couponCode = req.query.couponCode;
    let checkoutId = req.query.checkoutId;
    let endpoint = `/checkouts/${checkoutId}/coupons/${couponCode}`
    console.log(`${endpoint}`.magenta, req.query);
    return bc_v3.delete(endpoint).then(data => {
        return data;
    }).catch(next);
};

bc.getShipEstimate = (req,res,next) => {
    // console.log('getShipEstimate (body) =>'.magenta, req.body);
    // console.log('getShipEstimate (query) =>'.magenta, req.query.id);
    let url = `/checkouts/${req.query.id}/consignments?includes=consignments.available_shipping_options`;
    return bc_v3.post(url, req.body).then(data => {
        console.log('getShipEstimate (checkout data) =>'.magenta, data.id);
        return data;
    }).catch(next);
};

//  /$$                           /$$
// | $$                          | $$
// | $$$$$$$   /$$$$$$   /$$$$$$ | $$   /$$  /$$$$$$$
// | $$__  $$ /$$__  $$ /$$__  $$| $$  /$$/ /$$_____/
// | $$  \ $$| $$  \ $$| $$  \ $$| $$$$$$/ |  $$$$$$
// | $$  | $$| $$  | $$| $$  | $$| $$_  $$  \____  $$
// | $$  | $$|  $$$$$$/|  $$$$$$/| $$ \  $$ /$$$$$$$/
// |__/  |__/ \______/  \______/ |__/  \__/|_______/
bc.abandoned = (req, res, next) => { // hook_id: 14193377
    var hook = req.body;
    console.log("ABANDONED HOOK ==> ", hook);
    return activityRef("test_abandoned_webhook").push({
        test: "Test Works!",
        hook: hook,
        created: Date.now(),
        seen: false
    }).then(data => {
        // return data;
        return 200, "Fornida Thanks You!";
    }).catch(next);
};

function getOrder(id) {
    console.log('order_id: '.magenta, id)
    return bc_v2.get(`/orders/${id}`);
}

bc.statusUpdated = (req, res, next) => { // hook_id: 14193377
    var hook = req.body;
    const prev = status(hook.data.status.previous_status_id);
    const new_stat = status(hook.data.status.new_status_id);
    let order;
    return getOrder(hook.data.id).then(o => {
        let order = o;
        let slug = slugify(order.billing_address.email);
        // let slug = 'contactomarnowgmailcom';
        return activityRef(slug).push({
            msg: `Order, ${hook.data.id}, status changed to ${new_stat}`,
            order: order,
            title: "Order Activity",
            color: "green",
            link: "",
            created: Date.now(),
            seen: false
        }).then(data => {
            // return data;
            return 200, "Fornida Thanks You!";
        }).catch(next);
    }).catch(next);

};




function pretty(obj) {
    return JSON.stringify(obj, null, 2)
}
function slugify(Text) {return Text .toLowerCase() .replace(/[^\w ]+/g,'') .replace(/ +/g,'-') ; }

module.exports = bc;









// 0   Incomplete
// 1   Pending
// 2   Shipped
// 3   Partially_Shipped
// 4   Refunded
// 5   Cancelled
// 6   Declined
// 7   Awaiting_Payment
// 8   Awaiting_Pickup
// 9   Awaiting_Shipment
// 10  Completed
// 11  Awaiting_Fulfillment
// 12  Manual_Verification_Required
// 13  Disputed


function status(code) {
    switch(code) {
        case 0:
            return "Incomplete";
            break;
        case 1:
            return "Pending";
            break;
        case 2:
            return "Shipped";
            break;
        case 3:
            return "Partially_Shipped";
            break;
        case 4:
            return "Refunded";
            break;
        case 5:
            return "Cancelled";
            break;
        case 6:
            return "Declined";
            break;
        case 7:
            return "Awaiting_Payment";
            break;
        case 8:
            return "Awaiting_Pickup";
            break;
        case 9:
            return "Awaiting_Shipment";
            break;
        case 10:
            return "Completed";
            break;
        case 11:
            return "Awaiting_Fulfillment";
            break;
        case 12:
            return "Manual_Verification_Required";
            break;
        case 13:
            return "Disputed";
            break;
        default:
            return "unknown";
    }
}
















