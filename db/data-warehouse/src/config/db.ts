export const config = {
  db: {
    connectionString:
      process.env.DATA_WAREHOUSE_DB_URL ||
      'mssql://sa:Denali123!@localhost:1433/DataWarehouse?encrypt=false&trustServerCertificate=true',
    ssl: process.env.DATA_WAREHOUSE_DB_SSL === 'true',
  },
};
