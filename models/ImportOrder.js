const mongoose = require('mongoose')
const abstractModel = require('./AbstractModel')

const importOrderSchema = new mongoose.Schema({
    ...abstractModel,
    totalPrice: {
        type: Number,
        require: "trướng 'totalPrice' bắt buộc phải truyển",
        min: 0
    },
    r_importOrderDetails: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "importOrderDetail"
    }],
    r_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
})

const importOrder = mongoose.model("importOrder",importOrderSchema)

module.exports = importOrder