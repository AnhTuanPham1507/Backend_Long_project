const { default: mongoose } = require("mongoose")
const exportOrder = require("../models/ExportOrderModel")

const create = ({ totalBill, r_user, address, name, phone, email, r_exportOrderDetails }, session) => {
    return exportOrder.create([{ totalBill, r_user, address, name, phone, email, r_exportOrderDetails }], { session })
}

const updateStatus = ({ id, status, isPaid, isRated }, session) => {
    return exportOrder.findOneAndUpdate({ _id: id }, { status, isPaid, isRated, updatedAt: new Date() }, { new: true })
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
const getById = (id, session) => {
    return exportOrder.findById(id).session(session)
}

const getByUserId = (id) => {
    return exportOrder.find({r_user: id, active: true })
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

module.exports = { create, updateStatus, getAll, getById, getByUserId}
