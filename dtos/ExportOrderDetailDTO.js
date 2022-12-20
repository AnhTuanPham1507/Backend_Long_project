const { validateObjectId } = require("../validation/validation")
const { validateNumber } = require("../validation/validation")

function createExportOrderDetailDto(reqBody, index) {
    const input = reqBody

    const errMessages = []

    if (validateNumber(input.quantity) && input.quantity < 0) {
        errMessages.push(`trường 'details.quantity' tại index ${index} chưa hợp lệ`)
    }
    if (validateNumber(input.price) && input.price < 0) {
        errMessages.push(`trường 'details.price' tại index ${index} chưa hợp lệ`)
    }
    if (validateObjectId(input.r_product)) {
        errMessages.push(`trường 'details.r_product' tại index ${index} chưa hợp lệ`)
    }
    if (validateObjectId(input.size)) {
        errMessages.push(`trường 'details.size' tại index ${index} chưa hợp lệ`)
    }
    if (errMessages.length > 0)
        return { errMessage: errMessages.reduce((total, err) => `${total} ${err} ---`, "") }


    return { data: { quantity: input.quantity, price: input.price, r_product: input.r_product, size: input.size } }
}

module.exports = { createExportOrderDetailDto }
