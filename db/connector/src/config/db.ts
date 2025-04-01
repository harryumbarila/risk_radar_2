export const config = {
  db: {
    connectionString:
      process.env.CONNECTOR_DB_URL ||
      'mssql://sa:Denali123!@localhost:1433/Connector?encrypt=false&trustServerCertificate=true',
    ssl: process.env.CONNECTOR_DB_SSL === 'true',
  },
};
