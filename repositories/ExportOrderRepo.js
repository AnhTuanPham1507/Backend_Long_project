const exportOrder = require("../models/ExportOrderModel")

const create = ({totalBill, r_user, address, name, phone, email, r_exportOrderDetails},session) => {
    return exportOrder.create([{ totalBill, r_user, address, name, phone, email, r_exportOrderDetails }],{session})
}

const updateStatus = ({id, status},session) => {
    return exportOrder.findOneAndUpdate({_id: id}, {status,updatedAt: new Date()},{new: true})
    .populate({
        path: "r_user",
        select: "_id name"
    })
    .populate({
        path: "r_exportOrderDetails",
        select: "_id quantity price size",
        populate: {
            path: "r_product",
        }
    })
    .select("_id totalBill address status isPaid name phone email createdAt")
    .session(session)
}
const getAll = () => {
    return exportOrder.find({ active: true })
        .populate({
            path: "r_user",
            select: "_id name"
        })
        .populate({
            path: "r_exportOrderDetails",
            select: "_id quantity price size",
            populate: {
                path: "r_product",
            }
        })
        .select("_id totalBill address status isPaid name phone email createdAt")
}
const getById = (id,session) => {
    // const filter = { _id: mongoose.Types.ObjectId(id) }
    // const myAggregate = GetOrderAggregate(filter)
    // return order.aggregate(myAggregate).session(session)
    return exportOrder.findById(id).session(session)
  }
module.exports = { create, updateStatus, getAll, getById }
