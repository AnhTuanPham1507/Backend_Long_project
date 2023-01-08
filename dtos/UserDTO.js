const {
    validateString,
    validateEmail,
    validatePhone,
    validateObjectId,
    validateArray
  } = require("../validation/validation");
  
  function createUserDto(reqBody) {
    const input = reqBody;
    const errMessages = []
  
    if (validateString(input.username))
      errMessages.push("trường username chưa hợp lệ")
      if (validateString(input.name))
      errMessages.push("trường name chưa hợp lệ")
    if (validateString(input.password))
      errMessages.push("trường password chưa hợp lệ");
    if (validatePhone(input.phone))
      errMessages.push("trường phone chưa hợp lệ")
    if (validateEmail(input.email))
      errMessages.push("trường email chưa hợp lệ")
    if (validateString(input.address))
      errMessages.push("trường address chưa hợp lệ")
  
    if (input.r_permissions !== undefined && validateArray(input.r_permissions)) {
      input.r_permissions.forEach((p, index) => {
        errMessages.push(`trường permission tại index ${index} chưa hợp lệ`);
      })
    }
  
    if (errMessages.length > 0)
      return { errMessage: errMessages.reduce((total, err) => `${total} ${err} ---`, "") };
    return {
      data: {
        username: input.username,
        password: input.password,
        name: input.name,
        phone: input.phone,
        address: input.address,
        email: input.email,
      },
    };
  }
  function updateUserDTO(reqBody) {
    const input = reqBody;
    const errMessages = []
  
    if (validateString(input.name))
      errMessages.push("trường name chưa hợp lệ")
    if (validatePhone(input.phone))
      errMessages.push("trường username chưa hợp lệ")
    if (validateEmail(input.email))
      errMessages.push("trường username chưa hợp lệ")
    if (validateString(input.address))
      errMessages.push("trường username chưa hợp lệ")
  
    if (errMessages.length > 0)
      return { errMessage: errMessages.reduce((total, err) => `${total} ${err} ---`, "") }
    
    return {
      data: {
        name: input.name,
        phone: input.phone,
        address: input.address,
        email: input.email,
      },
    };
  }
  function loginUserDto(reqBody) {
    const input = reqBody;
    const errMessages = [];
  
    if (validateString(input.username))
      errMessages.push("trường 'username' chưa hợp lệ");
    if (validateString(input.password))
      errMessages.push("trường 'password' chưa hợp lệ");
  
    if (errMessages.length > 0)
      return {
        errMessage: errMessages.reduce((total, err) => `${total} ${err} ---`, ""),
      };
    return {
      data: {
        username: input.username,
        password: input.password,
      },
    };
  }
  
  function forgotPasswordUserDto(reqBody) {
    const input = reqBody
    const errMessages = []
  
    if (validateEmail(input.email))
      errMessages.push("trường 'email' chưa hợp lệ")
    if (errMessages.length > 0)
      return { errMessage: errMessages.reduce((total, err) => `${total} ${err} ---`, "") }
    return {
      data: {
        email: input.email
      }
    }
  }
  
  function updateNewPasswordDto(reqBody) {
    const input = reqBody
    const errMessages = []
  
    if (validateString(input.password))
      errMessages.push("trường 'password' chưa hợp lệ")
    if (validateObjectId(input.token))
      errMessages.push("trường 'token' chưa hợp lệ")
    if (errMessages.length > 0)
      return { errMessage: errMessages.reduce((total, err) => `${total} ${err} ---`, "") }
    return {
      data: {
        password: input.password,
        token: input.token
      }
    }
  }
  module.exports = { createUserDto, updateUserDTO, loginUserDto, forgotPasswordUserDto, updateNewPasswordDto };
  