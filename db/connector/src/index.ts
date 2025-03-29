import { DataSource } from 'typeorm';

import { SnapShotvwLeadsStatusActive } from './entities/SnapShotvwLeadsStatusActive.entity';
import { SnapShotvwNetSettlementBalanceActive } from './entities/SnapShotvwNetSettlementBalanceActive.entity';

// Define the entities for the connector database
const entities = [
  SnapShotvwLeadsStatusActive,
  SnapShotvwNetSettlementBalanceActive,
];

// Initialize and configure the data source
const connectorDataSource = new DataSource({
  type: 'mssql',
  host: process.env.CONNECTOR_DB_HOST,
  port: parseInt(process.env.CONNECTOR_DB_PORT || '1433', 10),
  username: process.env.CONNECTOR_DB_USERNAME,
  password: process.env.CONNECTOR_DB_PASSWORD,
  database: process.env.CONNECTOR_DB_NAME,
  entities,
  synchronize: false, // Set to false for production
  logging: ['error', 'warn'],
});

// Export all the necessary components
export {
  connectorDataSource,
  SnapShotvwLeadsStatusActive,
  SnapShotvwNetSettlementBalanceActive,
};
