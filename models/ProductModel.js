const mongoose = require('mongoose')
const abstractModel = require('./AbstractModel')
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const productSchema = new mongoose.Schema({
    ...abstractModel,
    name: {
        type: String,
        require: "trướng 'name' bắt buộc phải truyển"
    },
    price: {
        type: Number,
        min: 0,
        require: "trướng 'price' bắt buộc phải truyển"
    },
    description: {
        type: String,
        default: ""
    },
    imgs: [{
        type: String,
        default: ""
    }],
    r_category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category"
    },
    r_trademark: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "trademark"
    }
})
productSchema.plugin(aggregatePaginate);


const product = mongoose.model("product", productSchema)

module.exports = product