const product = require("../models/ProductModel")
const getProductAggregate = require("../aggregates/GetProductAggregate")
const { default: mongoose } = require("mongoose")
const GetProductAdminAggregate = require("../aggregates/GetProductAdminAggregate")
const GetProductAggregate = require("../aggregates/GetProductAggregate")

const create = async ({ price, name, description, r_category, r_trademark, imgs }, session) => {
    const createdProduct = await product.create([{ price, name, description, r_category, r_trademark, imgs }], { session })
    return product.findById(createdProduct[0]._id).populate([
        "r_trademark",
        "r_category",
    ]).session(session)
}

const getById = (id) => {
    const aggregate = getProductAggregate({ _id: mongoose.Types.ObjectId(id) })
    return product.aggregate(aggregate)
}

const getByCategoryId = (id) => {
    const aggregate = getProductAggregate({ "r_category._id": mongoose.Types.ObjectId(id) })
    return product.aggregate(aggregate)
}

const getAll = (isAdminSide, filter) => {
    if (isAdminSide) {
        const myAggregate = GetProductAdminAggregate(filter)
        return product.aggregate(myAggregate)
    } else {
        const myAggregate = GetProductAggregate(filter)
        return product.aggregate(myAggregate)
    }
};

const pushOneProductDetail = ({ id, r_productDetail }, session) => {
    return product.findOneAndUpdate(
        { _id: id },
        { $push: { r_productDetails: r_productDetail }, updatedAt: new Date() },
        { new: true }
    ).session(session)
}

const updateOne = ({ id, name, price, description, r_category, r_trademark, imgs }, session) => {
    return product
        .findOneAndUpdate({ _id: id }, { name, price, description, r_category, r_trademark, imgs, updatedAt: new Date() }, { new: true })
        .populate([
            "r_trademark",
            "r_category",
        ])
        .session(session)
}

const deleteOne = (id, session) => {
    return product.findOneAndUpdate({ _id: id }, { active: false }, { new: true }).session(session)
}

module.exports = {
    create,
    getAll,
    pushOneProductDetail,
    getById,
    getByCategoryId,
    updateOne,
    deleteOne
}