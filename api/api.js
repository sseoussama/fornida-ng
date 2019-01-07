const express = require('express');
const router = express.Router();
// const MongoClient = require('mongodb').MongoClient;
// const ObjectID = require('mongodb').ObjectID;
// const User = require('../models/users');
const bc = require('./bc');
// const sms = require('./sms');
const jwtDecode = require('jwt-decode');
const request = require("request");
const sitemap = require('./sitemap');


router.get("/callback", (req, res, next) => {
    console.log('/CALLBACK USED'.bgCyan,req)
    res.send(products);
});

// Auth used by client browser while install bc app
router.get("/auth", (req, res, next) => {
    console.log(`auth req: ==>`.magenta);
    bc.auth(req, res, next).then(data => {
        console.log(`last then: ==>`.magenta);
        res.send(data)
    });
});

router.get("/load", (req, res, next) => {
    // res.send(req.body);
    res.render('index.html');
    console.log(`== BC Load Method: ==`.magenta);
});

router.get("/uninstall", (req, res, next) => {
    res.send(req.body);
    console.log(`== BC Uninstall Method: ==`.magenta);
});




// authenticated bc stencil urls
router.get("/goto", (req, res, next) => {
    bc.goto(req, res, next);
});

router.post("/decodejwt", (req, res, next) => {
    const jwt = JSON.stringify(req.body.jwt);
    var decoded = jwtDecode(jwt);
    res.send(decoded);
});

// bc GET products
router.get("/products", (req, res, next) => {
    // console.log(bc)
    bc.getProducts(req, res, next).then(products => {
        res.send(products)
    });
});
 
// put products in firebase
router.get("/save_products", (req, res, next) => {
    bc.saveProducts(next).then(data => {
        res.send(data)
    });
});

router.post("/add_to_cart", (req, res, next) => {
    let cartId = req.body.cartId;
    if(typeof cartId !== 'undefined'){
        bc.add_to_cart(req.body,next).then(response => {res.send(response) });
    }else{
        console.log(' == NO CART FOUNT == '.bgRed);
        bc.create_cart(req.body,next).then(response => {res.send(response) });
    }
    req.on('error', function (e) {
        console.log('ummmm...? Something is not right.'.red)
    });
});

router.get("/get_cart_urls", (req, res, next) => {
    let cartId = req.query.cart_id;
    bc.get_cart_urls(cartId,next).then(response => { res.send(response) });
});

// get cart data with id
router.get("/get_cart", (req, res, next) => {
    let cartId = req.query.cart_id;
    bc.get_cart(req, res, next);
});

// delete cart line_item
router.get("/delete_item", (req, res, next) => {
    let cartId = req.query.cartId;
    let itemId = req.query.itemId;
    bc.delete_item(cartId,itemId,next).then(response => { res.send(response) });
});

// update_cart_item
router.post('/update_cart_item', function(req,res,next){
    bc.update_cart_item(req,res,next).then(response => { res.send(response) });
});



// bc GET categories
router.get("/categories", (req, res, next) => {
    bc.getCategories(req, res, next).then(categories => {
        res.send(categories)
    });
});

// bc GET category Tree (children)
router.get("/getCategoryTree", (req, res, next) => {
    bc.getCategoryTree(req, res, next).then(data => {
        res.send(data)
    });
});

// bc GET images
router.get("/getProductImages", (req, res, next) => {
    bc.getProductImages(req, res, next).then(data => {
        res.send(data)
    });
});


// bc GET image
router.get("/getProductImage", (req, res, next) => {
    bc.getProductImage(req, res, next).then(data => {
        res.send(data)
    });
});

// bc GET image
router.get("/getProductById", (req, res, next) => {
    bc.getProductById(req, res, next).then(data => {
        res.send(data)
    });
});

// getOptionById
router.get("/getOptionById", (req, res, next) => {
    bc.getOptionById(req, res, next).then(data => {
        res.send(data)
    });
});

// getOptions
router.get("/getOptions", (req, res, next) => {
    bc.getOptions(req, res, next).then(data => {
        res.send(data)
    });
});

// getVariantsByProductId
router.get("/getVariantsByProductId", (req, res, next) => {
    bc.getVariantsByProductId(req, res, next).then(data => {
        res.send(data)
    });
});

// getBrands
router.get("/getBrands", (req, res, next) => {
    bc.getBrands(req, res, next).then(data => {
        res.send(data)
    });
});


// create_customer
router.post("/create_customer", (req, res, next) => {
    bc.create_customer(req, res, next).then(data => {
        res.send(data)
    });
});

// update_customer
router.post("/update_customer", (req, res, next) => {
    bc.update_customer(req, res, next).then(data => {
        res.send(data)
    });
});

// get_user
router.get("/get_user", (req, res, next) => {
    bc.get_user(req, res, next).then(data => {
        res.send(data)
    });
});

// get_user_address
router.get("/get_user_address", (req, res, next) => {
    bc.get_user_address(req, res, next).then(data => {
        res.send(data)
    });
});

// login
router.get("/login", (req, res, next) => {
    bc.login(req, res, next).then(data => {
        res.send(data)
    });
});


// getCustomFields
router.get("/getCustomFields", (req, res, next) => {
    bc.getCustomFields(req, res, next).then(data => {
        res.send(data)
    });
});

// makeCustomField
router.get("/makeCustomField", (req, res, next) => {
    bc.makeCustomField(req, res, next).then(data => {
        res.send(data)
    });
});

// updateCustomField
router.get("/updateCustomField", (req, res, next) => {
    bc.updateCustomField(req, res, next).then(data => {
        res.send(data)
    });
});

// getProductModifier
router.get("/getProductModifier", (req, res, next) => {
    bc.getProductModifier(req, res, next).then(data => {
        res.send(data)
    });
});

// addProductModifier
router.get("/addProductModifier", (req, res, next) => {
    bc.addProductModifier(req, res, next).then(data => {
        res.send(data)
    });
});

// removeCustomField
router.get("/removeCustomField", (req, res, next) => {
    bc.removeCustomField(req, res, next).then(data => {
        res.send(data)
    });
});


// addCoupon
router.get("/addCoupon", (req, res, next) => {
    bc.addCoupon(req, res, next).then(data => {
        res.send(data)
    });
});

// removeCoupon
router.get("/removeCoupon", (req, res, next) => {
    bc.removeCoupon(req, res, next).then(data => {
        res.send(data)
    });
});

// getShipEstimate
router.post("/getShipEstimate", (req, res, next) => {
    bc.getShipEstimate(req, res, next).then(data => {
        res.send(data)
    });
});
// getShipEstimate
router.get("/getShipEstimate", (req, res, next) => {
    bc.getShipEstimate(req, res, next).then(data => {
        res.send(data)
    });
});



// sitemap
router.get("/sitemap", sitemap);

// oauth path
// router.post('/oauth', (req,res,next) => {
//     var options = { 
//         method: 'POST',
//         url: 'https://login.bigcommerce.com/oauth2/token',
//         headers: { 
//             'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
//         },
//         formData: { 
//             secret: req.body.secret,
//             response: req.body.response
//         }
//     };
//     request(options, function (error, response, body) {
//       if (error) throw new Error(error);
//       console.log(`${body}`.yellow);
//       res.send(body);
//     });
// });

// Connect
const connection = (closure) => {
    return MongoClient.connect('mongodb://localhost:27017/fornida', (err, db) => {
        if (err) return console.log(err);

        closure(db);
    });
};

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

// get users
router.get('/users', (req,res,next) => {
    User.find({}).then( function(users){
            res.send(users);
    }).catch(next);
});


// add user
router.post('/users', function(req,res,next){
    let data = req.body;
    User.create(data).then( function(user){
        console.log(`New user:`.bgCyan.black.bold,  `\n${user}`.cyan);
        res.send(user)
    }).catch(next);
});



//  /$$                           /$$
// | $$                          | $$
// | $$$$$$$   /$$$$$$   /$$$$$$ | $$   /$$  /$$$$$$$
// | $$__  $$ /$$__  $$ /$$__  $$| $$  /$$/ /$$_____/
// | $$  \ $$| $$  \ $$| $$  \ $$| $$$$$$/ |  $$$$$$
// | $$  | $$| $$  | $$| $$  | $$| $$_  $$  \____  $$
// | $$  | $$|  $$$$$$/|  $$$$$$/| $$ \  $$ /$$$$$$$/
// |__/  |__/ \______/  \______/ |__/  \__/|_______/
router.post("/abandoned", (req, res, next) => {
    bc.abandoned(req, res, next).then(response => {
        res.send(response)
    });
});

router.post("/statusUpdated", (req, res, next) => {
    bc.statusUpdated(req, res, next).then(response => {
        res.send(response)
    });
});




function pretty(obj) {
  return JSON.stringify(obj, null, 2)
}





module.exports = router;