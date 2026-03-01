import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, EmployerStatus } from '../database/entities/user.entity';
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
        const pendingEmployerCount = await this.userRepository.count({
            where: { role: UserRole.EMPLOYER, approvalStatus: EmployerStatus.PENDING },
        });

        return {
            totalJobs,
            totalUsers,
            employerCount,
            seekerCount,
            totalApplications,
            pendingEmployerCount,
        };
    }

    async getAllUsers() {
        return this.userRepository.find({
            select: ['id', 'email', 'firstName', 'lastName', 'role', 'approvalStatus', 'createdAt'],
        });
    }

    // ดึงรายชื่อนายจ้างที่รออนุมัติ
    async getPendingEmployers() {
        return this.userRepository.find({
            where: { role: UserRole.EMPLOYER, approvalStatus: EmployerStatus.PENDING },
            select: ['id', 'email', 'firstName', 'lastName', 'role', 'approvalStatus', 'createdAt',
                'employerPhone', 'companyNameRequest', 'businessType', 'employerNote'],
            order: { createdAt: 'ASC' },
        });
    }

    // อนุมัตินายจ้าง
    async approveEmployer(id: number) {
        const user = await this.userRepository.findOne({ where: { id, role: UserRole.EMPLOYER } });
        if (!user) throw new NotFoundException('ไม่พบบัญชีนายจ้างนี้');

        await this.userRepository.update(id, { approvalStatus: EmployerStatus.APPROVED });
        return { message: 'อนุมัตินายจ้างเรียบร้อยแล้ว' };
    }

    // ปฏิเสธนายจ้าง
    async rejectEmployer(id: number) {
        const user = await this.userRepository.findOne({ where: { id, role: UserRole.EMPLOYER } });
        if (!user) throw new NotFoundException('ไม่พบบัญชีนายจ้างนี้');

        await this.userRepository.update(id, { approvalStatus: EmployerStatus.REJECTED });
        return { message: 'ปฏิเสธนายจ้างเรียบร้อยแล้ว' };
    }

    async suspendUser(id: number) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException('ไม่พบผู้ใช้งานนี้');

        await this.userRepository.delete(id);
        return { message: 'ลบ/ระงับผู้ใช้งานเรียบร้อยแล้ว' }
    }

    async deleteJob(id: number) {
        const job = await this.jobRepository.findOne({ where: { id } });
        if (!job) throw new NotFoundException('ไม่พบงานนี้');

        await this.jobRepository.delete(id);
        return { message: 'ลบงานเรียบร้อยแล้ว' }
    }
}
