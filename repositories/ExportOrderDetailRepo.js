const GetTopSoldProductsAggregate = require("../aggregates/GetTopSoldProductsAggregate")
const exportOrderDetail = require("../models/ExportOrderDetailModel")

const createMany = (creatingDetails,session) => {
    return exportOrderDetail.insertMany(creatingDetails,{session})
}

const groupAndGetTopSoldProduct = () => {
    const myAggregate = GetTopSoldProductsAggregate()
    return exportOrderDetail.aggregate(myAggregate)
  }

module.exports = { createMany, groupAndGetTopSoldProduct }
