require('dotenv').config()
const jwt = require("jsonwebtoken")
const verifyToken = (req,res,next) => {
    const token = req.headers["x-access-token"]
    if (!token)
        return res.status(403).json({ message: "chưa truyền token" })
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(!decoded.id)
            return res.status(401).json({ message: "token hết hạn, xin đăng nhập lại" })
        req.user = decoded
        return next()
    } catch (error) {
        return res.status(401).json({ message: "token không hợp lệ" })
    }
}

function verifyByPermission(permissions, isCombine = false) {
    return async (req, res, next) => {
  
      if (!permissions)
        permissions = req.query.permissions ? req.query.permissions : []
  
      const myRole = await roleService.getById(req.user.role.id)
      const checkPermission  = [...req.user.permissions, myRole && myRole?.r_permissions.map(p => p.type)].every(userPermission =>
          permissions.includes(userPermission)
        )
      if (!checkPermission)
        return res.status(401).json('Bạn không có quyền thực hiện chức năng này')
      next()
    }
  }
  
  function verifyByRole(roles) {
    return (req, res, next) => {
      if (!roles)
        roles = req.query.roles ? req.query.roles : []
      if (!roles.includes(req.user.role.title))
        return res.status(401).json('Bạn không có quyền thực hiện chức năng này')
      next()
    }
  }

module.exports = {verifyToken, verifyByPermission, verifyByRole}