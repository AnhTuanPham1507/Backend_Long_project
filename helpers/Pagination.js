function getPaginationOptions(req) {
    const {reqPage, reqLimit} = req.query
    const page = reqPage && reqPage >= 0 ? Number(reqPage) : 1
    const limit = reqLimit && reqLimit >= 6 ? Number(reqLimit) : 1
    return { page, limit }
}

module.exports = getPaginationOptions