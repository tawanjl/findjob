import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserRole, EmployerStatus } from '../database/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<User | null> {
        const user = await this.usersService.findByEmail(email);
        if (user && user.password && await bcrypt.compare(pass, user.password)) {
            return user;
        }
        return null;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        }

        // ตรวจสอบสถานะการอนุมัติสำหรับนายจ้าง
        if (user.role === UserRole.EMPLOYER) {
            if (user.approvalStatus === EmployerStatus.PENDING) {
                throw new ForbiddenException('บัญชีของคุณยังรอการอนุมัติจากผู้ดูแลระบบ กรุณารอสักครู่');
            }
            if (user.approvalStatus === EmployerStatus.REJECTED) {
                throw new ForbiddenException('บัญชีของคุณถูกปฏิเสธ กรุณาติดต่อผู้ดูแลระบบ');
            }
        }

        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                approvalStatus: user.approvalStatus,
            }
        };
    }

    async register(registerDto: RegisterDto) {
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new UnauthorizedException('อีเมลนี้ถูกใช้งานแล้ว');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        // นายจ้างต้องรอการอนุมัติก่อน
        const approvalStatus = registerDto.role === UserRole.EMPLOYER
            ? EmployerStatus.PENDING
            : null;

        const user = await this.usersService.create({
            ...registerDto,
            password: hashedPassword,
            approvalStatus,
        });

        // นายจ้างที่รอการอนุมัติ ไม่คืน token
        if (user.role === UserRole.EMPLOYER) {
            return {
                pending: true,
                message: 'สมัครสมาชิกสำเร็จ บัญชีของคุณอยู่ระหว่างรอการอนุมัติจากผู้ดูแลระบบ',
            };
        }

        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            pending: false,
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                approvalStatus: user.approvalStatus,
            }
        };
    }
}
