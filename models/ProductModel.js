const mongoose = require('mongoose')
const abstractModel = require('./AbstractModel')

const productSchema = new mongoose.Schema({
    ...abstractModel,
    name: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true,
        min: 0,
        default: 0
    },
    r_category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category"
    },
    r_trademark: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "trademark"
    }
})

const product = mongoose.model("product",productSchema)

module.exports = product