const forgotPasswordRepo = require('../repositories/ForgotPasswordRepo')


function create(forgotPasswordDTO, session) {
    return forgotPasswordRepo.create(forgotPasswordDTO,session)
}

module.exports = {create}