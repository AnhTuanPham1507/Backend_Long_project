const notificationRepo = require("../repositories/NotificationRepo");

function getAllForAdmin() {
  return notificationRepo.getAllByConsignment();
}
function getAllForCustomer(userId) {
  return notificationRepo.getAllByOrder(userId);
}
function UpdateIsRead(id,session) {
    return notificationRepo.updateIsRead(id,session)
}
module.exports = { getAllForAdmin, UpdateIsRead, getAllForCustomer};
