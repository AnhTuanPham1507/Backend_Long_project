const trademarkRepo = require('../repositories/TrademarkRepo')

function getAll(){
    return trademarkRepo.getAll()
}

function create(trademarkDTO, session){
    return trademarkRepo.create(trademarkDTO, session)
}

function getById(id){
    return trademarkRepo.getById(id)
}

function update(trademarkDTO, session) {
    return trademarkRepo.updateOne(trademarkDTO,session)
}

function getByName(name){
    return trademarkRepo.getByName(name)
}
function deleteOne(id,session) {
    return trademarkRepo.deleteOne(id,session)
}

module.exports = {getAll,create,getById,getByName,deleteOne,update}