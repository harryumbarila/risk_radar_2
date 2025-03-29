-- Create databases
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