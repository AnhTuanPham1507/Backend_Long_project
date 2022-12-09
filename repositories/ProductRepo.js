const product = require("../models/ProductModel")
const getProductAggregate = require("../aggregates/GetProductAggregate")
const { default: mongoose } = require("mongoose")

const create = async ({ price, name, description, r_category, r_trademark }, session) => {
    const createdProduct = await product.create([{ price, name, description, r_category, r_trademark }], { session })
    return product.findById(createdProduct[0]._id).populate([
        "r_trademark",
        "r_category",
    ]).session(session)
}

const getById = (id) => {
    const aggregate = getProductAggregate({_id: mongoose.Types.ObjectId(id)})
    console.log(aggregate)
    return product.aggregate(aggregate)
}

const getByCategoryId = (id) => {
    const aggregate = getProductAggregate({r_category: mongoose.Types.ObjectId(id)})
    console.log(aggregate)
    return product.aggregate(aggregate)
}

const getAll = () => {
    const aggregate = getProductAggregate()
    console.log(aggregate)
    return product.aggregate(aggregate);
}

const pushOneProductDetail = ({ id, r_productDetail }, session) => {
    return product.findOneAndUpdate(
        { _id: id },
        { $push: { r_productDetails: r_productDetail }, updatedAt: new Date() },
        { new: true }
    ).session(session)
}

const updateOne = ({id, name, price,description,r_category,r_trademark },session) => {
    return product.findOneAndUpdate({ _id: id }, { name,price,description,r_category,r_trademark, updatedAt: new Date()}, { new: true }).session(session)
}

module.exports = {
    create,
    getAll,
    pushOneProductDetail,
    getById,
    getByCategoryId,
    updateOne
}