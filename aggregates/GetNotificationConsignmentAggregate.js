const NOTIFICATIONTYPE = require("../enums/NotificationType")
module.exports = () => {
    const aggregate = [
        {
            $match: {
                active: true,
                type: NOTIFICATIONTYPE.COMMING_OUT_OF_STOCK
            }
        },
        {
            $lookup: {
                from: "consignments",
                localField: "r_consignment",
                foreignField: "_id",
                as: "r_consignment",
                pipeline: [
                    {

                        $lookup: {
                            from: "products",
                            localField: "r_product",
                            foreignField: "_id",
                            as: "r_product"
                        },
                    },
                    {
                        $unwind: { path: "$r_product" }
                    },

                ],
            },
        },
        {
            $unwind: { path: "$r_consignment" }
        },
        {
            $sort: {
                "createdAt": 1,
            }
        },
    ]
    return aggregate
}


