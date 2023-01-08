module.exports = (filter) => {
    const aggregate = [
        {
            $lookup: {
                from: "products",
                localField: "r_product",
                foreignField: "_id",
                as: "r_product",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            imgs: 1,

                        }
                    }
                ]
            }
        },
        {
            $unwind: { path: "$r_product" }
        },

        {
            $sort: {
                "status": 1,
                "r_product._id": 1,
                "size": 1,
            }
        },
        {
            $match: {
                active: true,
                ...filter
            }
        }
    ]
    return aggregate
}

