import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../database/entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } });
    }

    async findById(id: number): Promise<User | null> {
        return this.userRepository.findOne({ where: { id } });
    }

    async create(userData: Partial<User>): Promise<User> {
        const newUser = this.userRepository.create(userData);
        return this.userRepository.save(newUser);
    }

    async getMyProfile(userId: number) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['workExperiences', 'educations', 'skills', 'resume'],
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                role: true,
                bio: true,
                location: true,
                desiredJobTitle: true,
                expectedSalary: true,
                avatarUrl: true,
                portfolioUrl: true,
                linkedinUrl: true,
                availableFrom: true,
                createdAt: true,
            },
        });
        if (!user) throw new NotFoundException('ไม่พบผู้ใช้งาน');
        return user;
    }

    async updateProfile(userId: number, dto: UpdateProfileDto) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('ไม่พบผู้ใช้งาน');
        Object.assign(user, dto);
        return this.userRepository.save(user);
    }

    async updateAvatar(userId: number, avatarUrl: string) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('ไม่พบผู้ใช้งาน');
        user.avatarUrl = avatarUrl;
        await this.userRepository.save(user);
        return { avatarUrl };
    }
}
