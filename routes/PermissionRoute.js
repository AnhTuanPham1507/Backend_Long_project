const { Router } = require("express");
// const PermissionType = require("../enums/PermissionType");
const router = Router({ mergeParams: true });
const permissionService = require("../services/PermissionService");

router
  .get("/", async (req, res) => {
    try {
      const permissions = await permissionService.getAll()
      return res.status(200).json(permissions)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Server has something wrong!!" })
    }
  })
  // .get("/a",async (req, res) => {
  //   try {
  //     for(const p of Object.values(PermissionType)){
  //       await permissionService.create({type: p, description: `Bạn có thể ${p} với quyền này`})
  //     }
  //     return res.status(200).json()
  //   } catch (error) {
  //     console.log(error)
  //     res.status(500).json({ message: "Server has something wrong!!" })
  //   }
  // })
 
module.exports = { router };
