/**
 * Retrieves the name of the database from the environment variables.
 *
 * @returns {string} The name of the database.
 */
process.env.DATABASE_NAME = process.env.DATABASE_TEST_NAME || 'test';
