const { validateString, validateNumber } = require("../validation/Validation")

function notificationMoMoDto(reqBody) {
    const input = reqBody
    const errMessages = []
    if (validateString(input.orderId))
        errMessages.push("trường 'orderId' chưa hợp lệ")

    if (validateString(input.requestId))
        errMessages.push("trường 'requestId' chưa hợp lệ")
    if (validateString(input.orderInfo))
        errMessages.push("trường 'orderInfo' chưa hợp lệ")
    if (validateNumber(input.amount))
        errMessages.push("trường 'amount' chưa hợp lệ")
    if (validateString(input.orderType))
        errMessages.push("trường 'orderType' chưa hợp lệ")
    if (validateNumber(input.transId))
        errMessages.push("trường 'transId' chưa hợp lệ")
    if (validateNumber(input.resultCode))
        errMessages.push("trường 'resultCode' chưa hợp lệ")
    if (validateString(input.message))
        errMessages.push("trường 'message' chưa hợp lệ")
    if (validateString(input.payType))
        errMessages.push("trường 'payType' chưa hợp lệ")
    if (validateNumber(input.responseTime))
        errMessages.push("trường 'responseTime' chưa hợp lệ")
    if (validateString(input.extraData))
        errMessages.push("trường 'extraData' chưa hợp lệ")
        if (validateString(input.signature))
        errMessages.push("trường 'signature' chưa hợp lệ")

    if (errMessages.length > 0)
        return { errMessage: errMessages.reduce((total, err) => `${total} ${err} ---`, "") }

    return {
        data: {
            orderId: input.orderId,
            requestId: input.requestId,
            orderInfo: input.orderInfo,
            amount: input.amount,
            orderType: input.orderType,
            transId: input.transId,
            resultCode: input.resultCode,
            message: input.message,
            payType: input.payType,
            responseTime: input.responseTime,
            extraData: input.extraData,
            signature:input.signature,
            partnerCode: process.env.PARTNER_CODE,
            accessKey: process.env.ACCESS_KEY,
            secretKey: process.env.SECRET_KEY,
        }
    }
}



module.exports = { notificationMoMoDto }
