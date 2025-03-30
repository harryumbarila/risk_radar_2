#!/bin/bash
set -e

echo "Starting database initialization..."

# Function to execute SQL commands with retries
function execute_sql() {
    local retries=5
    local wait_time=5
    local command=$1
    
    for ((i=1; i<=retries; i++)); do
        echo "Executing SQL command (attempt $i of $retries)..."
        if /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "Denali123!" -Q "$command" -b; then
            return 0
        else
            echo "Command failed. Waiting $wait_time seconds before retry..."
            sleep $wait_time
        fi
    done
    return 1
}

# Create each database with retries
databases=("connector" "crescent-view" "data-warehouse" "iris" "finance", "ez-enroll", 'ez-enroll-pcc', "dsm", "snap-pcc")

for db in "${databases[@]}"; do
    echo "Creating database: $db"
    execute_sql "
    IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = '$db')
    BEGIN
        CREATE DATABASE [$db];
        ALTER DATABASE [$db] SET RECOVERY SIMPLE;
        PRINT 'Database $db created successfully';
    END
    ELSE
    BEGIN
        PRINT 'Database $db already exists';
    END"
    
    if [ $? -ne 0 ]; then
        echo "Failed to create database $db after multiple retries"
        exit 1
    fi
done

# Verify all databases were created
echo "Verifying database creation..."
execute_sql "
SELECT name, state_desc, recovery_model_desc 
FROM sys.databases 
WHERE name IN ('connector', 'crescent-view', 'data-warehouse', 'iris', 'finance')
ORDER BY name;"

echo "Database initialization completed successfully!" 