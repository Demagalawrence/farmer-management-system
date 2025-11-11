const { MongoClient } = require('mongodb');

(async () => {
  const client = new MongoClient('mongodb://127.0.0.1:27017');
  await client.connect();
  const db = client.db('fmis');
  
  const codes = await db.collection('access_codes').find({}).toArray();
  console.log('\n=== Access Codes ===');
  codes.forEach(c => {
    console.log(`\nCode: ${c.code}`);
    console.log(`Role: ${c.role}`);
    console.log(`Status: ${c.status}`);
    console.log(`Expires: ${c.expires_at}`);
  });
  
  await client.close();
})().catch(console.error);
