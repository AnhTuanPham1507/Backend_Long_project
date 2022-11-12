const trademarkRepo = require('../repositories/TrademarkRepo')

function getAll(){
    return trademarkRepo.getAll()
}

function create(trademarkDTO){
    return trademarkRepo.create(trademarkDTO)
}

function getById(id){
    return trademarkRepo.getById(id)
}

function getByName(name){
    return trademarkRepo.getByName(name)
}

module.exports = {getAll,create,getById,getByName}