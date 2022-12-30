const mongoose = require('mongoose')
const abstractModel = require('./AbstractModel')
const PAYMENTSTATUSENUM = require("../enums/PaymentStatus")
const PAYMENTTYPEENUM = require("../enums/PaymentType")

const paymentSchema = new mongoose.Schema({
    ...abstractModel,
    momoId: {
        type: Number,
        require: "trướng 'momoId' bắt buộc phải truyển",
        min: 0
    },
    status: {
        type: String,
        enum: Object.values(PAYMENTSTATUSENUM).map(v => v),
        default: 'pending'
    },
    type: {
        type: String,
        enum: Object.values(PAYMENTTYPEENUM).map(v => v),
        default: 'inperson'
    },
    r_exportOrder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "exportOrder"
    },
})

const payment = mongoose.model("payment", paymentSchema)

module.exports = payment