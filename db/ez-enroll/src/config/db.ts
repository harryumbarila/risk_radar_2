export const config = {
  db: {
    connectionString:
      process.env.EZ_ENROLL_DB_URL ||
      'mssql://sa:Denali123!@localhost:1433/EZEnroll?encrypt=false&trustServerCertificate=true',
    ssl: process.env.EZ_ENROLL_DB_SSL === 'true',
  },
};
