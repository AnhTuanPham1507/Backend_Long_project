const CONSIGNMENTSTATUS = require("../enums/ConsignmentStatus");
const { validateEnum, validateObjectId } = require("../validation/validation");

function updateConsignmentDto(reqBody) {
    const input = reqBody;
    const errMessages = [];

    if (validateEnum(CONSIGNMENTSTATUS, input.status))
        errMessages.push("trường 'status' không hợp lệ");

    if (validateObjectId(input.id))
        errMessages.push("trường 'id' không hợp lệ");

    if (errMessages.length > 0)
        return {
            errMessage: errMessages.reduce((total, err) => `${total} ${err}---`, ""),
        };

    return {
        data: {
            status: input.status,
            id: input.id
        },
    };
}

module.exports = { updateConsignmentDto }