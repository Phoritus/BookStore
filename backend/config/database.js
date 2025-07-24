const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'book_cafe_user',
  password: process.env.DB_PASSWORD || 'secure_password_123',
  database: process.env.DB_NAME || 'book_cafe',
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Execute query function
const executeQuery = async (query, params = []) => {
  try {
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Get single row
const getOne = async (query, params = []) => {
  const results = await executeQuery(query, params);
  return results[0] || null;
};

// Get multiple rows
const getMany = async (query, params = []) => {
  return await executeQuery(query, params);
};

// Insert data
const insert = async (query, params = []) => {
  const result = await executeQuery(query, params);
  return result.insertId;
};

// Update data
const update = async (query, params = []) => {
  const result = await executeQuery(query, params);
  return result.affectedRows;
};

// Delete data
const remove = async (query, params = []) => {
  const result = await executeQuery(query, params);
  return result.affectedRows;
};

module.exports = {
  pool,
  testConnection,
  executeQuery,
  getOne,
  getMany,
  insert,
  update,
  remove
};
