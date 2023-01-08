const { default: mongoose } = require("mongoose")
const GetConsignmentAggregate = require("../aggregates/GetConsignmentAggregate")
const GetStockProductAggregate = require("../aggregates/GetStockProductAggregate")
const ConsignmentStatus = require("../enums/ConsignmentStatus")
const consignment = require("../models/ConsignmentModel")


const createMany = (creatingConsignments, session) => {
    return consignment.create(creatingConsignments, { session })
}

const getAll = () => {
    const myAggregate = GetConsignmentAggregate()
    return consignment.aggregate(myAggregate)
}

const findByProductAndSize = ({ r_product, size }, session) => {
    return consignment.find({ r_product, size, status: { $in: ["in_stock", "comming_out_of_stock"] } }).session(session)
}

const groupByProduct = () => {
    const myAggregate = GetStockProductAggregate()
    return consignment.aggregate(myAggregate)
}

const getStockConsignment = (session) => {
    return consignment.find({ active: true, status: ConsignmentStatus.IN_STOCK }).session(session)
}

const getById = (id,session) => {
    const myAggregate = GetConsignmentAggregate({_id: mongoose.Types.ObjectId(id)})
    return consignment.aggregate(myAggregate).session(session)
  }
  
  const updateStatus = async ({id, status},session) => {
    const updatedConsignment = await consignment.findOneAndUpdate({_id: id},{status, updatedAt: Date.now()}).session(session)
    const myAggregate = GetConsignmentAggregate({_id: mongoose.Types.ObjectId(updatedConsignment._id)})
    return consignment.aggregate(myAggregate).session(session)
  }

  
module.exports = { getAll, createMany, findByProductAndSize, groupByProduct,getStockConsignment, getById, updateStatus }
