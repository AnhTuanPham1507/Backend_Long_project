const notification = require("../models/NotificationModel")

const create = ({ type, content, r_order, r_consignment }, session) => {
    return notification.create([{ type, content, r_order, r_consignment }], { session })
}

const getAll = () => {
    return notification.find({ active: true })
        .populate([
            {
                path: "r_order",
            },
            {
                path: 'r_consignment'
            }
        ])
}

const getByOrderIdAndType = ({r_order, type}) => {
    return notification.findOne({r_order,type})
}
module.exports = { create, getAll,getByOrderIdAndType }
