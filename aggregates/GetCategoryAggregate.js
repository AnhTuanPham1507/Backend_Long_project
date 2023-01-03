
module.exports = () => {
    const aggregate = [
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "r_category",
                as: "r_products",
                pipeline:[
                    {
                        $group: {
                            "_id": "r_products",
                            "totalQuantity": {
                                $sum: 1
                            }
                        }
                    },
                ]
            },
        },
        {
            $match:{
                active: true
            }
        }
    ]
    return aggregate
}
