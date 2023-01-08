const mongoose = require("mongoose");
const abstractModel = require("./AbstractModel");
const PERMISSIONTYPE = require("../enums/PermissionType")

const permissionSchema = new mongoose.Schema({
  ...abstractModel,
  description: {
    type: String,
    default: ""
  },
  type: {
    type: String,
    enum: Object.values(PERMISSIONTYPE)
  }
});

// permissionSchema.plugin(mongoosePaginate);
const permission = mongoose.model("permission", permissionSchema);

module.exports = permission;
