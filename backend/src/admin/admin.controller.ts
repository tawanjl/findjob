import { Controller, Get, Delete, Patch, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../database/entities/user.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('statistics')
    getStatistics() {
        return this.adminService.getStatistics();
    }

    @Get('users')
    getAllUsers() {
        return this.adminService.getAllUsers();
    }

    // รายชื่อนายจ้างที่รออนุมัติ
    @Get('employers/pending')
    getPendingEmployers() {
        return this.adminService.getPendingEmployers();
    }

    // อนุมัตินายจ้าง
    @Patch('employers/:id/approve')
    approveEmployer(@Param('id') id: string) {
        return this.adminService.approveEmployer(+id);
    }

    // ปฏิเสธนายจ้าง
    @Patch('employers/:id/reject')
    rejectEmployer(@Param('id') id: string) {
        return this.adminService.rejectEmployer(+id);
    }

    @Delete('user/:id')
    suspendUser(@Param('id') id: string) {
        return this.adminService.suspendUser(+id);
    }

    @Delete('job/:id')
    deleteJob(@Param('id') id: string) {
        return this.adminService.deleteJob(+id);
    }
}
