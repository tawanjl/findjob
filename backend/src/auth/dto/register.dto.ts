import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../database/entities/user.entity';

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    // ข้อมูลเพิ่มเติมสำหรับนายจ้าง
    @IsOptional()
    @IsString()
    employerPhone?: string;

    @IsOptional()
    @IsString()
    companyNameRequest?: string;

    @IsOptional()
    @IsString()
    businessType?: string;

    @IsOptional()
    @IsString()
    employerNote?: string;
}
