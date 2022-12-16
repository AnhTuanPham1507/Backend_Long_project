const { validateString, validateObjectId, validateNumber } = require("../validation/validation")
function createProductDto(reqBody) {
    const input = reqBody
    const errMessages = []

    if (validateString(input.name))
        errMessages.push("trường 'name' chưa hợp lệ")
    if (validateString(input.price))
        errMessages.push("trường 'price' chưa hợp lệ")
    if (validateString(input.description))
        errMessages.push("trường 'description' chưa hợp lệ")
    if (validateObjectId(input.r_category))
        errMessages.push("trường 'category' chưa hợp lệ")
    if (validateObjectId(input.r_trademark))
        errMessages.push("trường 'trademark' chưa hợp lệ")
    if (errMessages.length > 0)
        return { errMessage: errMessages.reduce((total, err) => `${total} ${err} ---`, "") }


    return { data: { name: input.name, price: input.price, description: input.description, r_category: input.r_category, r_trademark: input.r_trademark } }
}

function updateProductDto(id, reqBody) {
    const input = reqBody
    const errMessages = []
    if (input.name != undefined && validateString(input.name))
        errMessages.push("trường 'name' chưa hợp lệ")
    if (input.price != undefined && validateNumber(input.price))
        errMessages.push("trường 'price' chưa hợp lệ")
    if (input.r_category != undefined && validateObjectId(input.r_category))
        errMessages.push("trường 'category' chưa hợp lệ")
    if (input.r_trademark != undefined && validateObjectId(input.r_trademark))
        errMessages.push("trường 'trademark' chưa hợp lệ")
    if (input.description != undefined && validateString(input.description))
        errMessages.push("trường 'description' chưa hợp lệ")
    if (validateObjectId(id))
        errMessages.push("Id không hợp lệ")

    if (errMessages.length > 0)
        return { errMessage: errMessages.reduce((total, err) => `${total} ${err}---`, "") }

    const data = { id, name: input.name, price: input.price, description: input.description, r_category: input.r_category, r_trademark: input.r_trademark }

    return { data }
}

function getProductByIdDto(id) {
    const errMessages = []

    if (validateObjectId(id))
        errMessages.push("trường 'id' chưa hợp lệ")

    if (errMessages.length > 0)
        return { errMessage: errMessages.reduce((total, err) => `${total} ${err} ---`, "") }


    return { data: { id } }
}

module.exports = { createProductDto, updateProductDto, getProductByIdDto }
