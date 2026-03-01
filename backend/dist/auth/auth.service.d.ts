import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserRole, EmployerStatus } from '../database/entities/user.entity';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<User | null>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            role: UserRole;
            firstName: string;
            lastName: string;
            approvalStatus: EmployerStatus | null;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        pending: boolean;
        message: string;
        access_token?: undefined;
        user?: undefined;
    } | {
        pending: boolean;
        access_token: string;
        user: {
            id: number;
            email: string;
            role: UserRole.USER | UserRole.ADMIN;
            firstName: string;
            lastName: string;
            approvalStatus: EmployerStatus | null;
        };
        message?: undefined;
    }>;
}
