export const config = {
  db: {
    connectionString:
      process.env.CRESCENT_VIEW_DB_URL ||
      'mssql://sa:Denali123!@localhost:1433/crescent-view?encrypt=false&trustServerCertificate=true',
    ssl: process.env.CRESCENT_VIEW_DB_SSL === 'true',
  },
};
