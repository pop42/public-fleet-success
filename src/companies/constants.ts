export const companyConstants = {
  streamNames: {
    company: {
      category: 'company',
      commandCategory: 'company:command',
      entity: (companyId: string) =>
        `${companyConstants.streamNames.company.category}-${companyId}`,
      commandEntity: (companyId: string) =>
        `${companyConstants.streamNames.company.commandCategory}-${companyId}`,
    },
  },
  subscriberIds: {
    aggregates: {
      company: 'aggregates:company:v1',
    },
    components: {
      companyCommand: 'components:company:command:v1',
    },
  },
  eventTypes: {
    addCompany: 'AddCompany',
    companyAdded: 'CompanyAdded',
  },
  indexes: {
    companies: 'companies',
  },
}
