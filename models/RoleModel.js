const mongoose = require("mongoose");
const abstractModel = require("./AbstractModel");
const ROLE = require("../enums/Role")

const roleSchema = new mongoose.Schema({
  ...abstractModel,
  description: {
    type: String,
    default: ""
  },
  title: {
    type: String,
    enum: Object.values(ROLE)
  },
  r_permissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "permission",
  }]
});

// roleSchema.plugin(mongoosePaginate);
const role = mongoose.model("role", roleSchema);

module.exports = role;
