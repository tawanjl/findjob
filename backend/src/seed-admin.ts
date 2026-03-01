/**
 * Seed script: สร้าง Admin account ใน database
 * Run: npx ts-node src/seed-admin.ts
 */
import * as mysql from 'mysql2/promise';
import * as bcrypt from 'bcrypt';

async function seedAdmin() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '0123456789',
        database: 'job_portal',
    });

    console.log('✅ เชื่อมต่อ database สำเร็จ');

    // ข้อมูล Admin ที่ต้องการสร้าง
    const adminEmail = 'admin@jobsdb.com';
    const adminPassword = 'Admin@1234';
    const adminFirstName = 'Super';
    const adminLastName = 'Admin';

    // ตรวจสอบว่ามี admin อยู่แล้วหรือไม่
    const [existing]: any = await connection.execute(
        'SELECT id FROM users WHERE email = ?',
        [adminEmail]
    );

    if (existing.length > 0) {
        console.log(`⚠️  Admin "${adminEmail}" มีอยู่ในระบบแล้ว (id: ${existing[0].id})`);
        await connection.end();
        return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Insert admin
    const [result]: any = await connection.execute(
        `INSERT INTO users (email, password, role, firstName, lastName, approvalStatus, createdAt, updatedAt)
         VALUES (?, ?, 'ADMIN', ?, ?, NULL, NOW(), NOW())`,
        [adminEmail, hashedPassword, adminFirstName, adminLastName]
    );

    console.log('');
    console.log('🎉 สร้าง Admin account สำเร็จ!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 Email    : ${adminEmail}`);
    console.log(`🔑 Password : ${adminPassword}`);
    console.log(`🆔 User ID  : ${result.insertId}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  กรุณาเปลี่ยนรหัสผ่านหลังจาก login ครั้งแรก');

    await connection.end();
}

seedAdmin().catch(err => {
    console.error('❌ เกิดข้อผิดพลาด:', err.message);
    process.exit(1);
});
