export const config = {
  db: {
    connectionString:
      process.env.EZ_ENROLL_PCC_DB_URL ||
      'mssql://sa:Denali123!@localhost:1433/ez-enroll-pcc?encrypt=false&trustServerCertificate=true',
    ssl: process.env.EZ_ENROLL_PCC_DB_SSL === 'true',
  },
};
