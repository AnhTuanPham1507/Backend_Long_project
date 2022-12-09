const mongoose = require("mongoose")
module.exports = (filter) => {
    const aggregate = [
        {
            $lookup: {
                from: "categories",
                localField: "r_category",
                foreignField: "_id",
                as: "r_category",
            },
        },
        {
            $unwind: { path: "$r_category" },
        },
        {
            $lookup: {
                from: "trademarks",
                localField: "r_trademark",
                foreignField: "_id",
                as: "r_trademark",
            },
        },
        {
            $unwind: { path: "$r_trademark" },
        },
        {
            $lookup: {
                from: "productdetails",
                localField: "r_productDetails",
                foreignField: "_id",
                as: "r_productDetails",
                pipeline: [
                    {
                        $lookup: {
                            from: "consignments",
                            localField: "_id",
                            foreignField: "r_productDetail",
                            as: "r_consignment",
                            pipeline: [
                                {
                                    $group: {
                                        "_id": "$r_productDetail",
                                        "quantity": { $sum: '$quantity' },
                                    },

                                }
                            ]
                        },
                    },
                    {
                        $unwind: { path: "$r_consignment" },
                    }
                ],
            },
        },

    ]

    if (filter) {
        aggregate.unshift({
            $match: filter
        })
    }
    return aggregate
}