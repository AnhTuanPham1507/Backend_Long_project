const { getNowMonth } = require("../helpers/moment")

module.exports = (month) => {
    const aggregate = [
        {
            $match: {
                active: true,
                $expr: { 
                    $eq: [getNowMonth(), { $month: "$createdAt" }] 
                }
            }
        },
        {
            $lookup: {
                from: "products",
                localField: "r_product",
                foreignField: "_id",
                as: "r_product",
            },
        },
        {
            $unwind: { path: "$r_product" }
        },
        {
            $group: {
                _id: {
                    "month": {
                        $month: "$createdAt"
                    },
                    "r_product": "$r_product._id",
                },
                "r_product": { $first: "$r_product" },
                "quantity": { $sum: '$quantity' },
            }
        },
        {
            $project: {
                _id: 0,
                "r_product._id": 1,
                "r_product.name": 1,
                quantity: 1
            }
        },
        {
            $sort: {
                quantity: -1
            }
        },
    ]
    return aggregate
}