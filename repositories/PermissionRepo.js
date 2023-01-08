const permission = require("../models/PermissionModel");

const create = (
  { description, type },
  session
) => {
  return permission.create(
    [{ description, type  }],
    { session }
  );
};

const getAll = () => {
    return permission.find({active: true})
}

module.exports = { create, getAll }
