const importOrderDetail = require("../models/ImportOrderDetailModel")


const createMany = (creatingDetails,session) => {
    return importOrderDetail.insertMany(creatingDetails,{session})
}


module.exports = { createMany }
