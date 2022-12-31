const rate = require("../models/RateModel");

const create = ({ comment, star, r_products, r_user},session) => {
  return rate.create([{ comment, star, r_products, r_user }],{session});
};

const getByProductId = (productId) => {
  return rate.find({r_products: productId, active: true }).populate({
    path: "r_user",
    select: "name"
  });
};

module.exports = { create, getByProductId };
