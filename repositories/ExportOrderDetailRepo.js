const exportOrderDetail = require("../models/ExportOrderDetailModel")

const createMany = (creatingDetails,session) => {
    return exportOrderDetail.insertMany(creatingDetails,{session})
}

module.exports = { createMany }
