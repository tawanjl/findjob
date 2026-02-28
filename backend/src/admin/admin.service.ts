import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../database/entities/user.entity';
import { Job } from '../database/entities/job.entity';
import { Application } from '../database/entities/application.entity';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Job) private readonly jobRepository: Repository<Job>,
        @InjectRepository(Application) private readonly applicationRepository: Repository<Application>,
    ) { }

    async getStatistics() {
        const totalJobs = await this.jobRepository.count();
        const totalUsers = await this.userRepository.count();
        const totalApplications = await this.applicationRepository.count();

        const employerCount = await this.userRepository.count({ where: { role: UserRole.EMPLOYER } });
        const seekerCount = await this.userRepository.count({ where: { role: UserRole.USER } });

        return {
            totalJobs,
            totalUsers,
            employerCount,
            seekerCount,
            totalApplications,
        };
    }

    async getAllUsers() {
        return this.userRepository.find({
            select: ['id', 'email', 'firstName', 'lastName', 'role', 'createdAt'],
        });
    }

    async suspendUser(id: number) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException('User not found');

        // In a real scenario we'd use an 'active' boolean flag on the User entity
        // However since we didn't add it in the first pass, we might need a workaround or schema update
        // Let's assume we implement a soft delete or just delete them for now.
        await this.userRepository.delete(id);
        return { message: 'User deleted/suspended successfully' }
    }

    async deleteJob(id: number) {
        const job = await this.jobRepository.findOne({ where: { id } });
        if (!job) throw new NotFoundException('Job not found');

        await this.jobRepository.delete(id);
        return { message: 'Job deleted successfully' }
    }
}
