const constants = require("../constants");

const subscriptions = [
  {
    chanel: constants.CHANEL_USERS,
    keyBuilder: ({userId}) => [
        `invalidate:users:${userId}`,
        `invalidate:users:profiles:${userId}`
    ]
  },
  {
    chanel: constants.CHANEL_EXPERTS,
    keyBuilder: ({businessId}) => [
        `experts:business:${businessId}`
    ]
  }
];

module.exports = subscriptions
