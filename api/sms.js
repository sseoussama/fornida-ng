const express = require('express');
const router = express.Router();
const jwtDecode = require('jwt-decode');
const request = require("request");
const fb = require("./firebase");

const sms = {};
const accountSid = 'AC1f3db32a0bf1150b9425a37769a003f9';
const authToken = 'b69a081a554f55e97d1cc45d3c04db28';

const client = require('twilio')(accountSid,authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

// sms.receive = (req, res, next) => {
//  return "Message Received"
// };


router.post("/inbound", (req, res, next) => {
    const body = req.body;
    console.log(`/inbound from ${body.From}`.bgCyan, body.Body);
    return reply(res,'my reply works');
});


router.post("/query", (req, res, next) => {
    const query = req.body.Body;
    return get_build_string(query, (respond) => {
        //   res.send(respond);
        return reply(res, respond);
    });
});


get_build = (query, callback) => {
    return fb.subscribe(`stashed/${query}`).on('value', function (snapshot) {
        const data = snapshot.val();
        if (!data) {
            return callback('Build Not Found');
        }
        const respond = {
            buildQty: data.buildQty,
            build_id: data.build_id,
            count: data.components.length,
            components: data.components.map(b => {
                let set = (b.set !== undefined) ? b.set.key : 'parent';
                return {
                    0: `x${b.quantity} ${b.sku}`,
                    set: set
                };
            })
        }
        return callback(respond);
    });
}

get_build_string = (query, callback) => {
    return fb.subscribe(`stashed/${query}`).on('value', function (snapshot) {
        const data = snapshot.val();
        
        // if no data
        if (!data) {
          return callback('Build\n Not\n Found\n');
        }
        
        // stringify components
        const respond = data.components.map(b => {
            let set = (b.set !== undefined) ? b.set.key : 'parent';
            return ` x${b.quantity} ${b.sku}\n ${set}\n\n`
        })

        // form final string
        const send = `- \n\n buildQty: ${data.buildQty}\n build_id: ${data.build_id}\n status: ${data.status||"null"}\n order_id: ${data.order_id||"null"}\n\n ${respond.join().trim().replaceAll(',', '')} `
        // const send = `${respond.join().trim().replaceAll(',', '')} `.cyan
    
        console.log(send)
        return callback(send);
    });
}
    
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

reply = (res,msg) => {
    console.log(' Reply => '.bgCyan, typeof msg);
    const twiml = new MessagingResponse();
    twiml.message(msg)
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
}

sms.send = () => {
    client.messages.create({
        to: '+12144705176',
        from: '+12149722890',
        body: 'this is a test'
    }).then( (message) => console.log(message.sid) );
}


function pretty(obj) {
    return JSON.stringify(obj, null, 2)
}
module.exports = router;
