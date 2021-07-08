export const vehicleConstants = {
  streamNames: {
    vehicle: {
      category: 'vehicle',
      commandCategory: 'vehicle:command',
      entity: (vehicleId: string) =>
        `${vehicleConstants.streamNames.vehicle.category}-${vehicleId}`,
      commandEntity: (vehicleId: string) =>
        `${vehicleConstants.streamNames.vehicle.commandCategory}-${vehicleId}`,
    },
  },
  subscriberIds: {
    aggregates: {
      vehicle: 'aggregates:vehicle:v1',
    },
    components: {
      vehicleCommand: 'components:vehicle:command:v1',
    },
  },
  eventTypes: {
    addVehicle: 'AddVehicle',
    vehicleAdded: 'VehicleAdded',
  },
  indexes: {
    vehicles: 'vehicles',
  },
}
