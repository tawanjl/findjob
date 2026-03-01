import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    findByEmail(email: string): Promise<User | null>;
    findById(id: number): Promise<User | null>;
    create(userData: Partial<User>): Promise<User>;
    getMyProfile(userId: number): Promise<User>;
    updateProfile(userId: number, dto: UpdateProfileDto): Promise<User>;
    updateAvatar(userId: number, avatarUrl: string): Promise<{
        avatarUrl: string;
    }>;
}
