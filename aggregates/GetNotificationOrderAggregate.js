const { default: mongoose } = require("mongoose")
const NOTIFICATIONTYPE = require("../enums/NotificationType")
module.exports = (userId) => {
    const aggregate = [
        {
            $match: {
                active: true,
                type: {
                    $in: [NOTIFICATIONTYPE.FAILED_ORDER, NOTIFICATIONTYPE.SHIPPING_ORDER, NOTIFICATIONTYPE.SUCCESS_ORDER]
                }
            }
        },
        {
            $lookup: {
                from: "exportorders",
                localField: "r_order",
                foreignField: "_id",
                as: "r_order",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "r_user",
                            foreignField: "_id",
                            as: "r_user",
                            pipeline: [
                                {
                                    $project: {
                                        _id: 1,
                                        name: 1,                                    
                                    }
                                },
                            ],
                        },
                    },
                    {
                        $unwind: { path: "$r_user" }
                    },
                    {
                        $lookup: {
                            from: "exportorderdetails",
                            localField: "r_exportOrderDetails",
                            foreignField: "_id",
                            as: "r_exportOrderDetails",
                            pipeline: [
                                {
                                    $lookup: {
                                        from: "products",
                                        localField: "r_product",
                                        foreignField: "_id",
                                        as: "r_product",
                                    }
                                },
                                {
                                    $unwind: "$r_product"
                                },
                            ]
                        }
                    }
                ]
            }
        },
        {
            $unwind: { path: "$r_order" }
        },
        {
            $match: {
                "r_order.r_user._id": mongoose.Types.ObjectId(userId)
            }
        },
        {
            $sort: {
                "createdAt": 1,
            }
        },
    ]
    return aggregate
}

