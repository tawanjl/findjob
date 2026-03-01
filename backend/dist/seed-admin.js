"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = __importStar(require("mysql2/promise"));
const bcrypt = __importStar(require("bcrypt"));
async function seedAdmin() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '0123456789',
        database: 'job_portal',
    });
    console.log('✅ เชื่อมต่อ database สำเร็จ');
    const adminEmail = 'admin@jobsdb.com';
    const adminPassword = 'Admin@1234';
    const adminFirstName = 'Super';
    const adminLastName = 'Admin';
    const [existing] = await connection.execute('SELECT id FROM users WHERE email = ?', [adminEmail]);
    if (existing.length > 0) {
        console.log(`⚠️  Admin "${adminEmail}" มีอยู่ในระบบแล้ว (id: ${existing[0].id})`);
        await connection.end();
        return;
    }
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const [result] = await connection.execute(`INSERT INTO users (email, password, role, firstName, lastName, approvalStatus, createdAt, updatedAt)
         VALUES (?, ?, 'ADMIN', ?, ?, NULL, NOW(), NOW())`, [adminEmail, hashedPassword, adminFirstName, adminLastName]);
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
//# sourceMappingURL=seed-admin.js.map