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
    vinDecoded: 'VinDecoded',
    decodeVin: 'DecodeVin',
    decodeVinFailed: 'DecodeVinFailed',
  },
  indexes: {
    vehicles: 'vehicles',
  },
  vinDecodeUrl: (vin: string) =>
    `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvaluesextended/${vin}?format=json`,
}
