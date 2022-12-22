const forgotPassword = require("../models/ForgotPasswordModel")

const create = ({r_user,status},session) => {
    return forgotPassword.create([{ r_user,status }],{session})
}

const updateStatus = ({id, status},session) => {
    return forgotPassword.findOneAndUpdate({ _id: id }, {status, updatedAt: new Date()}, { new: true }).session(session)

}
module.exports = { create, updateStatus }
