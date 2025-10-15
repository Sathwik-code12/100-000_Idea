import { Client } from 'pg';

const client = new Client({
  connectionString: "postgresql://postgres:1234@localhost:5432/10000ideas"
});

async function testConnection() {
  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL successfully!');
    
    const result = await client.query('SELECT current_database(), version()');
    console.log('Database:', result.rows[0]);
    
    await client.end();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();