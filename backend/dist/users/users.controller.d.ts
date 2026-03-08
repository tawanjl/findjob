import { UsersService } from './users.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersController {
    private readonly usersService;
    private readonly cloudinaryService;
    constructor(usersService: UsersService, cloudinaryService: CloudinaryService);
    getMyProfile(req: any): Promise<import("../database/entities/user.entity").User>;
    updateProfile(req: any, dto: UpdateProfileDto): Promise<import("../database/entities/user.entity").User>;
    uploadAvatar(req: any, file: Express.Multer.File): Promise<{
        avatarUrl: string;
    }>;
}
