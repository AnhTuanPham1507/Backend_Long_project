const user  = require("../models/UserModel")

const create = ({username, password, name, phone, email, address, birthday, r_role, r_permissions},session)=>{
   return user.create([{username, password, name, phone, email, address, birthday, r_role, r_permissions}],{session})
}

const getAll = () => {
    return user.find({}).populate([
        {
          path: "r_role",
          select: "_id title"
        },
        {
          path: "r_permissions",
          select: "_id type"
        }
      ])
}

const getByEmail = (email) => {
    return user.findOne({email}).populate([
        {
          path: "r_role",
          select: "_id title"
        },
        {
          path: "r_permissions",
          select: "_id type"
        }
      ])
}

const getByUsername = (username) => {
    return user.findOne({username}).populate([
        {
          path: "r_role",
          select: "_id title"
        },
        {
          path: "r_permissions",
          select: "_id type"
        }
      ])
}

const deleteOne = (id,session) => {
    return user.findOneAndUpdate({_id: id},{active:false},{ new: true }).session(session)
}

const updateOne = ({id, name, phone, email, address},session) =>{
    return user.findOneAndUpdate({_id: id},{name, phone, email, address, updatedAt: new Date()}, {new:true}).session(session)
}

const updatePassword = ({id, password},session) =>{
    return user.findOneAndUpdate({_id: id},{password, updatedAt: new Date()}, {new:true}).session(session)
}

const getById = (id) => {
    return user.findOne({_id:id, active:true}).select("_id name email phone address")
  }

module.exports = {  getById, create , getAll, getByEmail, getByUsername, deleteOne, updateOne, updatePassword}
