const { validateObjectId } = require("../validation/validation")

function updateNotificationDto(id) {
    const errMessages = []

    if (validateObjectId(id))
        errMessages.push("Id không hợp lệ")

    if (errMessages.length > 0)
        return { errMessage: errMessages.reduce((total, err) => `${total} ${err}---`, "") }

    const data = { id}

    return { data }
}

module.exports = { updateNotificationDto }