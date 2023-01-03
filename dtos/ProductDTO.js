const { default: mongoose } = require("mongoose")
const { validateString, validateObjectId, validateNumber } = require("../validation/validation")
function createProductDto(reqBody) {
    const input = reqBody
    const errMessages = []

    if (validateString(input.name))
        errMessages.push("trường 'name' chưa hợp lệ")
    if (input.price !== undefined && validateString(input.price))
        errMessages.push("trường 'price' chưa hợp lệ")
    if (input.description != undefined && validateString(input.description))
        errMessages.push("trường 'description' chưa hợp lệ")
    if (validateObjectId(input.r_category))
        errMessages.push("trường 'category' chưa hợp lệ")
    if (validateObjectId(input.r_trademark))
        errMessages.push("trường 'trademark' chưa hợp lệ")
    if (input.name != undefined && errMessages.length > 0)
        return { errMessage: errMessages.reduce((total, err) => `${total} ${err} ---`, "") }

    return { data: { name: input.name, price: input.price, description: input.description, r_category: input.r_category, r_trademark: input.r_trademark, imgs: input.imgs } }
}

function updateProductDto(id, reqBody) {
    const input = reqBody
    const errMessages = []
    if (input.name != undefined && validateString(input.name))
        errMessages.push("trường 'name' chưa hợp lệ")
    if (input.price != undefined && validateNumber(parseInt(input.price)))
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
    if(input.imgs.length > 0)
        data["imgs"] = input.imgs
    return { data }
}

function getProductByIdDto(id) {
    const errMessages = []

    if (validateObjectId(id))
        errMessages.push("trường 'id' chưa hợp lệ")

    if (errMessages.length > 0)
        return { errMessage: errMessages.reduce((total, err) => `${total} ${err} ---`, "") }


    return { data: { id } }

    if (errMessages.length > 0)
        return { errMessage: errMessages.reduce((total, err) => `${total} ${err}---`, "") }

    const data = { id, name: input.name, price: input.price, description: input.description, r_category: input.r_category, r_trademark: input.r_trademark }

    return { data }
}

function deleteProductDto(id) {
    const errMessages = []

    if (validateObjectId(id))
        errMessages.push("Id không hợp lệ")

    if (errMessages.length > 0)
        return { errMessage: errMessages.reduce((total, err) => `${total} ${err}---`, "") }

    return { data: { id } }

}

function productFilterDto(filter) {
    const myFilter = {}
    Object.entries(filter).forEach(([key, value]) => {
      switch (key) {
        case "r_category":
          if(!validateObjectId(value)){
            myFilter["r_category._id"] = mongoose.Types.ObjectId(value)
          }
          break
        case "name":
          if (!validateString(value)) {
            const queryName = value.trim()
            const queryNameArr = queryName.split(' ').map(word => ({
              'name': { $regex: `.*${word}.*`, $options: 'si' }
            }))
            myFilter['$or'] = [
              { 'name': { $regex: `.*${queryName}.*`, $options: 'si' } },
              { $and: queryNameArr }
            ]
          }
          break;
        case "r_brand":
          if (!validateArray(value))
            myFilter['r_brand.name'] = {
              $in: value.reduce((arr, v) => {
                if (!validateString(v))
                  return [...arr, v]
                return arr
              }, [])
            }
          break
        case "size":
          if (!validateArray(value))
            myFilter['r_consignments.size'] = {
              $in: value.reduce((arr, v) => {
                if (!validateEnum(SIZEENUM, v))
                  return [...arr, v]
                return arr
              },[])
            }
          break
      }
    })
    return myFilter
  }
module.exports = { createProductDto, updateProductDto, getProductByIdDto, deleteProductDto, productFilterDto }
