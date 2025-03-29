#!/bin/bash
set -e

# Wait for SQL Server to be ready
until /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "Denali123!" -Q "SELECT 1" &> /dev/null
do
  echo "Waiting for SQL Server to be ready..."
  sleep 1
done

echo "SQL Server is ready. Creating databases..."

# Create databases
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "Denali123!" -Q "
CREATE DATABASE [connector];
CREATE DATABASE [crescent-view];
CREATE DATABASE [data-warehouse];
CREATE DATABASE [iris];
CREATE DATABASE [finance];

-- Set recovery model to simple for development
ALTER DATABASE [connector] SET RECOVERY SIMPLE;
ALTER DATABASE [crescent-view] SET RECOVERY SIMPLE;
ALTER DATABASE [data-warehouse] SET RECOVERY SIMPLE;
ALTER DATABASE [iris] SET RECOVERY SIMPLE;
ALTER DATABASE [finance] SET RECOVERY SIMPLE;
"

echo "Databases created successfully." 