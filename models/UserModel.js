const mongoose = require("mongoose")
const abstractModel  = require("./AbstractModel")
const USERROLEENUM = require('../enums/UserRole')

const userSchema = new mongoose.Schema({
    ...abstractModel,
    username: {
        type: String,
        required: "trướng 'username' bắt buộc phải truyển",
        unique: "trướng 'username' đã tồn tại"
    },
    password: {
        type: String,
        required: "trướng 'password' bắt buộc phải truyển",
    },
    email: {
        type: String,
        required: "trướng 'email' bắt buộc phải truyển",
    },
    phone: {
        type: String,
        required: "trướng 'phone' bắt buộc phải truyển",
        maxLength: 11
    },
    address: {
        type: String,
    },
    birthday: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        enum: Object.values(USERROLEENUM).map(v => v),
        default: 'Customer'
    },
    name: {
        type: String,
        required: "trướng 'name' bắt buộc phải truyển",
    },
})

const user = mongoose.model("user", userSchema)

module.exports = user