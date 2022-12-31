const { validateString, validateNumber, validateArray, validateObjectId } = require("../validation/validation");

function createRateDto(reqBody) {
  const input = reqBody;
  const errMessages = [];

  if (validateString(input.comment))
    errMessages.push("trường 'comment' chưa hợp lệ");
  if (validateNumber(input.star) || input.star < 1 || input.star > 5)
    errMessages.push("trường 'star' chưa hợp lệ");
  if (validateObjectId(input.r_order))
    errMessages.push("trường 'r_order' chưa hợp lệ");
    if (validateObjectId(input.r_user))
    errMessages.push("trường 'r_user' chưa hợp lệ");
  if (validateArray(input.r_products)) {
    errMessages.push("hãy chọn ít nhất một sản phẩm để đánh giá")
  } else {
    input.r_products.forEach(element => {
      if (validateObjectId(element))
        errMessage.push(`product ${element} chưa hợp lệ`)
    });
  }
  if (errMessages.length > 0)
    return { errMessage: errMessages.reduce((total, err) => `${total} ${err} ---`, "") }

  return { data: { comment: input.comment, star: input.star, r_products: input.r_products, r_order: input.r_order, r_user: input.r_user } };
}

module.exports = { createRateDto };
