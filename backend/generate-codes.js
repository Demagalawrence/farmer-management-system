const { MongoClient } = require('mongodb');

function generateAccessCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

(async () => {
  const client = new MongoClient('mongodb://127.0.0.1:27017');
  await client.connect();
  const db = client.db('fmis');
  
  console.log('\n🔑 Generating fresh access codes...\n');
  
  const roles = ['field_officer', 'finance'];
  const newCodes = [];
  
  for (const role of roles) {
    const code = generateAccessCode();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48); // 48 hours validity
    
    await db.collection('access_codes').insertOne({
      code: code,
      role: role,
      status: 'active',
      created_at: new Date(),
      expires_at: expiresAt,
      created_by: 'system_admin',
      used_count: 0
    });
    
    newCodes.push({ code, role, expiresAt });
    console.log(`✅ ${role.toUpperCase()}: ${code}`);
    console.log(`   Expires: ${expiresAt.toLocaleString()}\n`);
  }
  
  console.log('📌 For Manager role, use the admin secret: admin123\n');
  
  await client.close();
})().catch(console.error);
