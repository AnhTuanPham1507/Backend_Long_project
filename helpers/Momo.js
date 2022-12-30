const crypto = require('crypto')
const { CustomError } = require('../errors/CustomError')
const https = require('https');

async function sendRequestMomo({ exportOrderId, paymentId, totalBill }) {
    try {
        const partnerCode = process.env.PARTNER_CODE
        const accessKey = process.env.ACCESS_KEY
        const secretkey = process.env.SECRET_KEY
        const requestId = exportOrderId
        const orderId = exportOrderId
        const orderInfo = "pay with MoMo"
        const ipnUrl = process.env.IPN_URL
        const redirectUrl = process.env.REDIRECT_URL
        const amount = totalBill.toString()
        const requestType = "captureWallet"
        const extraData = paymentId //pass empty value if your merchant does not have stores

        //before sign HMAC SHA256 with format
        //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
        const rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType
        //puts raw signature

        //signature
        const signature = crypto.createHmac('sha256', secretkey)
            .update(rawSignature)
            .digest('hex')
        //json object send to MoMo endpoint
        const requestBody = JSON.stringify({
            partnerCode: partnerCode,
            accessKey: accessKey,
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            extraData: extraData,
            requestType: requestType,
            signature: signature,
            lang: 'en',
        })
        //Create the HTTPS objects
        const options = {
            hostname: 'test-payment.momo.vn',
            port: 443,
            path: '/v2/gateway/api/create',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody)
            }
        }
        
        //Send the request and get the response
        const requestMomo = await new Promise((resolve, reject) => {
            const req = https.request(options, res => {
                res.setEncoding('utf8');
                res.on('data', (body) => {
                    resolve(JSON.parse(body));
                });
            })

            req.on('error', (e) => {
                reject(`problem with request: ${e.message}`);
            });
            // write data to request body
            req.write(requestBody);
            req.end();
        })
        return Promise.resolve(requestMomo.payUrl)
    } catch (error) {
        console.log(error)
        return Promise.reject(new CustomError(error.toString(), 500))
    }
}

module.exports = { sendRequestMomo }