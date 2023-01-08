const { Router } = require("express");
const router = Router({ mergeParams: true });
const { verifyToken, verifyByRole } = require("../middlewares/VerifyToken");
const ROLE = require("../enums/Role")
const roleService = require("../services/RoleService");
const { checkPermissionDto } = require("../dtos/PermissionDTO");
const { CustomError } = require("../errors/CustomError");

router
  .get("/route/admin", verifyToken, verifyByRole([ROLE.ADMIN]), (req, res) => {
    return res.status(200).json({ message: "Chào mừng admin" })
  })

  .get("/action", verifyToken, async (req, res) => {
    try {
      const grant = {}
      const permissionDTO = checkPermissionDto(req.query.permissions)
      if (permissionDTO.hasOwnProperty("errMessage"))
        throw new CustomError(permissionDTO.errMessage, 400)

      const myRole = await roleService.getById(req.user.role.id)
      permissionDTO.data.permissions.forEach(p => {
        if ([...req.user.permissions, ...myRole.r_permissions.map(i => i.type)].includes(p))
          grant[p] = true
        else 
          grant[p] = false
      })
      return res.status(200).json(grant)
    } catch (error) {
      console.log(error)
      if (error instanceof CustomError)
        res.status(error.code).json({ message: error.message })
      else
        res.status(500).json({ message: "Server has something wrong!!" })
    }
  })
module.exports = { router };
