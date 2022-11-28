const productDetail = require("../models/productDetailModel");

const create = ({ color, size, img, r_product},session) => {
    return productDetail.create([{ color, size, img, r_product }],{session});
}

const update = ({id,color, size, img, r_product, r_consignment},session) => {
    return productDetail.findOneAndUpdate({_id: id},{color, size, img, r_product, r_consignment}, {new:true}).session(session);
}

const updateNullConsignment = ({id, r_consignment},session) => {
    return productDetail.findOneAndUpdate({_id: id, r_consignment: null},{r_consignment}).session(session);
}

module.exports = {
    create,
    update,
    updateNullConsignment
};