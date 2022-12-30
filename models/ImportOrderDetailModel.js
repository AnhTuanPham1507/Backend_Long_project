const mongoose = require('mongoose')
const SIZEENUM = require("../enums/Size")
const abstractModel = require('./AbstractModel')

const importOrderDetailSchema = new mongoose.Schema({
    ...abstractModel,
    quantity: {
        type: Number,
        require: "trướng 'quantity' bắt buộc phải truyển",
        min: 0
    },
    price: {
        type: Number,
        require: "trướng 'price' bắt buộc phải truyển",
        min: 0
    },
    r_product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    },
    size: {
        type: Number,
        enum: SIZEENUM
    }
})

const importOrder = mongoose.model("importOrderDetail", importOrderDetailSchema)

module.exports = importOrder