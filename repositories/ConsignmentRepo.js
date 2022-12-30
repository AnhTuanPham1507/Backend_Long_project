const consignment = require("../models/ConsignmentModel")


const createMany = (creatingConsignments, session) => {
    return consignment.create(creatingConsignments, { session })
}

const getAll = () => {
    return consignment.find({ active: true })
}

const findByProductAndSize = ({r_product,size}, session) => {
    return consignment.find({r_product,size, status: {$in : ["in_stock", "comming_out_of_stock"]}}).session(session)
}


module.exports = {  getAll, createMany, findByProductAndSize }
