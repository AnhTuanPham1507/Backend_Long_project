const mongoose = require("mongoose")
const abstractModel  = require("./AbstractModel")

const categorySchema = new mongoose.Schema({
    ...abstractModel,
    name: {
        type: String,
        required: 'trường "name" phải được truyền vào',
    },
    img: {
        type: String
    },
})

const category = mongoose.model("category", categorySchema)

module.exports = category