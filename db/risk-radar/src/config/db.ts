export const config = {
  db: {
    connectionString:
      process.env.RISK_RADAR_DB_URL ||
      'mssql://sa:Denali123!@localhost:1433/Connector?encrypt=false&trustServerCertificate=true',
    ssl: process.env.RISK_RADAR_DB_SSL === 'true',
  },
};
