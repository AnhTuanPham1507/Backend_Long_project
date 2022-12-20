const CONSIGNMENTSTATUS = require("../enums/ConsignmentStatus")

module.exports = (startFilter, endFilter) => {
    const aggregate = [
        {
            $match: {
                active: true,
                ...startFilter
            }
        },
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
                from: "consignments",
                localField: "_id",
                foreignField: "r_product",
                as: "r_consignments",
                pipeline: [
                    {
                        $match: {
                            status: {
                                $in: [CONSIGNMENTSTATUS.IN_STOCK, CONSIGNMENTSTATUS.COMMING_OUT_OF_STOCK]
                            }
                        }
                    },
                    {
                        $group: {
                            "_id": "$size",
                            "size": {$first: "$size"},
                            "quantity": { $sum: '$quantity' },
                        },
                    },
                    {
                        $project: {
                            "size":1,
                            "quantity":1
                        }
                    }
                ],
            }
        },
        {
            $match: {
                "r_consignments.0": {
                    $exists: true
                },
                ...endFilter
            }
        }
    ]
    return aggregate
}
