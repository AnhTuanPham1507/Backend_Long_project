const payment = require("../models/PaymentModel")

const create = ({type, r_exportOrder},session) => {
    return payment.create([{type, r_exportOrder }],{session})
}

const getAll = () => {
    return payment.find({ active: true })
}

const updateStatus = ({id, momoId, status},session) => {
    return payment.findOneAndUpdate({_id:id},{momoId,status,updatedAt: new Date()},{new:true}).session(session)
}

module.exports = { create, getAll, updateStatus }
