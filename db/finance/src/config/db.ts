export const config = {
  db: {
    connectionString:
      process.env.FINANCE_DB_URL ||
      'mssql://sa:Denali123!@localhost:1433/Finance?encrypt=false&trustServerCertificate=true',
    ssl: process.env.FINANCE_DB_SSL === 'true',
  },
};
