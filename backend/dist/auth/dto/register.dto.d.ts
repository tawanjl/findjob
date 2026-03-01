import { UserRole } from '../../database/entities/user.entity';
export declare class RegisterDto {
    email: string;
    password: string;
    role?: UserRole;
    firstName?: string;
    lastName?: string;
    employerPhone?: string;
    companyNameRequest?: string;
    businessType?: string;
    employerNote?: string;
}
