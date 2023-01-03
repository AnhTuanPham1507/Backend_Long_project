const { getNowMonth } = require("../helpers/moment")
const CONSIGNMENTSTATUS = require("../enums/ConsignmentStatus")

module.exports = () => {
    const aggregate = [
        {
            $match: {
                status: {
                    $in: [CONSIGNMENTSTATUS.IN_STOCK, CONSIGNMENTSTATUS.COMMING_OUT_OF_STOCK]
                }
            }
        },
        {
            $lookup: {
                from: "products",
                localField: "r_product",
                foreignField: "_id",
                as: "r_product",
                pipeline: [
                    {
                        $project: {
                            "r_product.name": 1,
                            "r_product._id": 1
                        }
                    }
                ],
            },
        },
        {
            $unwind: { path: "$r_product" }
        },
        {
            $group: {
                _id: {
                    "r_product": "$r_product._id",
                },
                "r_product": { $first: "$r_product" },
                "quantity": { $sum: '$quantity' },
            }
        },
        {
            $project: {
                _id: 0,
                r_product: 1,
                quantity: 1
            }
        },
    ]
    return aggregate
}