const { validateString, validateObjectId, validateNumber, validateEnum, validatePhone, validateEmail, validateArray } = require("../validation/validation")
const { createExportOrderDetailDto } = require("./ExportOrderDetailDTO")
const PAYMENTTYPEENUM = require("../enums/PaymentType")
const ORDERSTATUS = require('../enums/ExportOrderStatus.js')

function createExportOrderDto(reqBody) {
    const input = reqBody
    const errMessages = []
    const details = []
    if (validateNumber(input.totalBill))
        errMessages.push("trường 'totalBill' chưa hợp lệ")

    if (validateString(input.address))
        errMessages.push("trường 'address' không hợp lệ")

    if (validateString(input.name))
        errMessages.push("trường 'name' không hợp lệ")

    if (validatePhone(input.phone))
        errMessages.push("trường 'phone' không hợp lệ")

    if (validateEmail(input.email))
        errMessages.push("trường 'email' không hợp lệ")

    if (validateEnum(PAYMENTTYPEENUM, input.paymentType))
        errMessages.push("trường 'paymentType' không hợp lệ")

    if (validateArray(input.r_exportOrderDetails)) {
        errMessages.push("array 'r_exportOrderDetails' chưa hợp lệ")
        input.details = []
    } else
        input.r_exportOrderDetails.forEach((detail, index) => {
            const exportOrderDetailDto = createExportOrderDetailDto(detail, index)
            if (exportOrderDetailDto.hasOwnProperty("errMessage")) {
                errMessages.push(`${exportOrderDetailDto.errMessage}`)
            }
            else
                details.push(exportOrderDetailDto.data)
        })

    if (errMessages.length > 0)
        return { errMessage: errMessages.reduce((total, err) => `${total} ${err}---`, "") }

    return { data: { totalBill: input.totalBill, r_user: input.r_user, address: input.address, name: input.name, phone: input.phone, email: input.email, r_exportOrderDetails: details, paymentType: input.paymentType } }
}

function updateExportOrderDto(id, reqBody) {
    const input = reqBody;
    const errMessages = [];

    if (validateEnum(ORDERSTATUS, input.status))
        errMessages.push("trường 'status' không hợp lệ");

    if (validateObjectId(id))
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

module.exports = { createExportOrderDto, updateExportOrderDto }