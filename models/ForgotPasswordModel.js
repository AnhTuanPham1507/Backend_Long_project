const mongoose = require("mongoose")
const abstractModel  = require("./AbstractModel")
const FORGOTPASSWORDSTATUS = require('../enums/ForgotPasswordStatus')

const forgotPasswordSchema = new mongoose.Schema({
    ...abstractModel,
    r_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    status: {
        type: String,
        enum: Object.values(FORGOTPASSWORDSTATUS).map(v => v),
        default: "new"
    }
})

const forgotPassword = mongoose.model("forgotPassword", forgotPasswordSchema)

module.exports = forgotPassword