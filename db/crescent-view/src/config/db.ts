import { env } from './env';

export const config = {
  db: {
    connectionString:
      'mssql://code-user:STG7W>&!9Sy_gH@10.9.220.66/CrescentView?encrypt=true&trustServerCertificate=true&validateConnection=false',
    ssl: false,
  },
};



/*
IRIS_SERVER=STG-VM-DB01
IRIS_USER=code-user
IRIS_PASSWORD=STG7W>&!9Sy_gH
IRIS_DATABASE_NAME=MarketPlace
IRIS_SSL=
*/
