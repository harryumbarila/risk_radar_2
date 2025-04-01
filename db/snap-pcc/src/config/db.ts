export const config = {
  db: {
    connectionString:
      process.env.SNAP_PCC_DB_URL ||
      'mssql://sa:Denali123!@localhost:1433/SNAP_pcc?encrypt=false&trustServerCertificate=true',
    ssl: process.env.SNAP_PCC_DB_SSL === 'true',
  },
};
