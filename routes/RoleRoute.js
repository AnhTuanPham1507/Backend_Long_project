const { Router } = require("express");
const router = Router({ mergeParams: true });
const roleService = require("../services/RoleService");
const test = require("../repositories/RoleRepo")
const permissionService = require("../services/PermissionService");
const { default: mongoose } = require("mongoose");

router
  .get("/", async (req, res) => {
    try {
      const roles = await roleService.getAll()
      return res.status(200).json(roles)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Server has something wrong!!" })
    }
  })
  // .get("/a", async (req, res) => {
  //   try {
  //     const permissions = await permissionService.getAll()
  //     const roles = await test.create({title: "customer", r_permissions:[
  //       mongoose.Types.ObjectId("63b84bf7281bdd59cca9be9a"),
  //       mongoose.Types.ObjectId("63b84bf9281bdd59cca9bea4"),
  //       mongoose.Types.ObjectId("63b84bfd281bdd59cca9bec1"),
  //       mongoose.Types.ObjectId("63b84bff281bdd59cca9beca"),
  //       mongoose.Types.ObjectId("63b84c00281bdd59cca9bed3"),
  //       mongoose.Types.ObjectId("63b84c00281bdd59cca9bed5"),
  //       mongoose.Types.ObjectId("63b84c02281bdd59cca9bee1"),
  //       mongoose.Types.ObjectId("63b84bfe281bdd59cca9bec3"),
  //       mongoose.Types.ObjectId("63b84c01281bdd59cca9bedc"),
  //     ], description: "Đây là chức vụ bạn có toàn quyền trên trang khách hàng"})
  //     return res.status(200).json(roles)
  //   } catch (error) {
  //     console.log(error)
  //     res.status(500).json({ message: "Server has something wrong!!" })
  //   }
  // })
 
module.exports = { router };
