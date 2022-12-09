const importOrder = require("../models/ImportOrder")

const create = async ({ totalPrice, r_importOrderDetails, r_user }, session) => {
    const createdImportOrder = await importOrder.create([{ totalPrice, r_importOrderDetails, r_user }], { session })
    console.log(createdImportOrder)
    return importOrder
        .findById(createdImportOrder[0]._id)
        .populate({
            path: "r_user",
            select: "_id name"
        })
        .populate({
            path: "r_importOrderDetails",
            select: "_id quantity price",
            populate: {
                path: "r_productDetail",
                select: "_id color size",
                populate: {
                    path: "r_product",
                    select: "_id name"
                }
            }
        })
        .select("_id totalPrice")
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
            select: "_id quantity price",
            populate: {
                path: "r_productDetail",
                select: "_id color size",
                populate: {
                    path: "r_product",
                    select: "_id name"
                }
            }
        }).select("_id totalPrice")
}

module.exports = { create, getAll }
