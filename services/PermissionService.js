const permissionRepo = require("../repositories/PermissionRepo");

function getAll() {
  return permissionRepo.getAll();
}

function create(permissionDTO,session) {
  return permissionRepo.create(permissionDTO,session);
}

module.exports = { getAll, create};
