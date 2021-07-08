export const userConstants = {
  streamNames: {
    user: {
      category: 'user',
      commandCategory: 'user:command',
      entity: (userId: string) =>
        `${userConstants.streamNames.user.category}-${userId}`,
      commandEntity: (userId: string) =>
        `${userConstants.streamNames.user.commandCategory}-${userId}`,
    },
  },
  subscriberIds: {
    aggregates: {
      user: 'aggregates:user:v1',
    },
    components: {
      userCommand: 'components:user:command:v1',
    },
  },
  eventTypes: {
    addUser: 'AddUser',
    userAdded: 'UserAdded',
  },
  indexes: {
    users: 'users',
  },
}
