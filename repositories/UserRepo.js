const user  = require("../models/UserModel")

const create = ({username, password, name, phone, email, address, birthday, role},session)=>{
   return user.create([{username, password, name, phone, email, address, birthday, role}],{session})
}

const getAll = () => {
    return user.find({active:true})
}

const getAllInActive = () => {
    return user.find({active:false})
}

const getByEmail = (email) => {
    return user.findOne({email})
}

const getByUsername = (username) => {
    return user.findOne({username})
}

const deleteOne = (id,session) => {
    return user.findOneAndUpdate({_id: id},{active:false},{ new: true }).session(session)
}

const updateOne = ({id, name, phone, email, address},session) =>{
    return user.findOneAndUpdate({_id: id},{name, phone, email, address, updatedAt: new Date()}, {new:true}).session(session)
}

module.exports = {create , getAll, getByEmail, getAllInActive, getByUsername, deleteOne, updateOne}
