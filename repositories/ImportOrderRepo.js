const importOrder = require("../models/ImportOrder")

const create = async ({ totalPrice, r_importOrderDetails, r_user }, session) => {
    const createdImportOrder = await importOrder.create([{ totalPrice, r_importOrderDetails, r_user }], { session })
    return importOrder
        .findById(createdImportOrder[0]._id)
        .populate({
            path: "r_user",
            select: "_id name"
        })
        .populate({
            path: "r_importOrderDetails",
            select: "_id quantity price size",
            populate: {
                path: "r_product",
            }
        })
        .session(session)

}

const getAll = () => {
    return importOrder.find({ active: true })
        .populate({
            path: "r_user",
            select: "_id name"
        })
        .populate({
            path: "r_importOrderDetails",
            select: "_id quantity price size",
            populate: {
                path: "r_product",
            }
        })
}

module.exports = { create, getAll }
