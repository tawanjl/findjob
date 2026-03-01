import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
            role: import("../database/entities/user.entity").UserRole.USER | import("../database/entities/user.entity").UserRole.ADMIN;
            firstName: string;
            lastName: string;
            approvalStatus: import("../database/entities/user.entity").EmployerStatus | null;
        };
        message?: undefined;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            role: import("../database/entities/user.entity").UserRole;
            firstName: string;
            lastName: string;
            approvalStatus: import("../database/entities/user.entity").EmployerStatus | null;
        };
    }>;
}
