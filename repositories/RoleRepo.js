const role = require("../models/RoleModel");

const create = ({ description, title, r_permissions }, session) => {
  return role.create([{description, title, r_permissions }], { session });
}

const getAll = () => {
  return role.find({active: true}).populate({
    path: "r_permissions",
    select: "_id type"
  })
}

const getById = (id) => {
  return role.findOne({_id: id, active: true}).populate({
    path: "r_permissions",
    select: "_id type"
  })
}
const getByTitle = (title) => {
  return role.findOne({title}).populate({
    path: "r_permissions",
    select: "_id type"
  })
}
module.exports = {
  create,
  getAll,
  getById,
  getByTitle
};
