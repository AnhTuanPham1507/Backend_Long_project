const mongoose = require("mongoose")
const abstractModel  = require("./AbstractModel")
const EXPORTORDERSTATUSENUM = require("../enums/ExportOrderStatus")

const exportOrderSchema = new mongoose.Schema({
    ...abstractModel,
    totalBill: {
        type: Number,
        required: "trướng 'totalBill' bắt buộc phải truyển",
        min: 0
    },
    status: {
        type: String,
        enum: Object.values(EXPORTORDERSTATUSENUM).map(v => v),
        default: 'new'
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    r_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    address: {
        type: String,
        required: "trướng 'address' bắt buộc phải truyển",
    },
    name: {
        type: String,
        required: "trướng 'name' bắt buộc phải truyển"
    },
    phone: {
        type: String,
        required: "trướng 'phone' bắt buộc phải truyển",
        maxLength: 11
    },
    email: {
        type: String,
        required: "trướng 'email' bắt buộc phải truyển"
    },
    r_exportOrderDetails :[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "exportOrderDetail"
    }]
})

const exportOrder = mongoose.model("exportOrder", exportOrderSchema)

module.exports = exportOrder