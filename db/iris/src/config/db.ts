export const config = {
  db: {
    connectionString:
      process.env.IRIS_DB_URL ||
      'mssql://sa:Denali123!@localhost:1433/iris?encrypt=false&trustServerCertificate=true',
    ssl: process.env.IRIS_DB_SSL === 'true',
  },
};
