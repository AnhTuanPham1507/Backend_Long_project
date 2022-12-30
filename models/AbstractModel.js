const abstractModel = {
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    active: {
        type: Boolean,
        default: true
    },
}

module.exports = abstractModel
