export const config = {
  db: {
    connectionString:
      process.env.DSM_DB_URL ||
      'mssql://sa:Denali123!@localhost:1433/dsm?encrypt=false&trustServerCertificate=true',
    ssl: process.env.DSM_DB_SSL === 'true',
  },
};
