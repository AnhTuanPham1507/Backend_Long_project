const permissionRepo = require("../repositories/PermissionRepo");
const roleRepo = require("../repositories/Rolerepo");

function getAll() {
    return roleRepo.getAll();
}

function getById(id) {
    return roleRepo.getById(id);
}

// async function create() {
//     const foundP = await permissionRepo.getAll()
//     console.log(foundP)
//     await roleRepo.create({ description: "Bạn có toàn quyền thực thi với Chức vụ này", title: "admin", r_permissions: foundP })
// }

module.exports = { getAll, getById };
