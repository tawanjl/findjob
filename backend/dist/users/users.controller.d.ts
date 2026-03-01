import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMyProfile(req: any): Promise<import("../database/entities/user.entity").User>;
    updateProfile(req: any, dto: UpdateProfileDto): Promise<import("../database/entities/user.entity").User>;
    uploadAvatar(req: any, file: Express.Multer.File): Promise<{
        avatarUrl: string;
    }>;
}
