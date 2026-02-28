import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getStatistics(): Promise<{
        totalJobs: number;
        totalUsers: number;
        employerCount: number;
        seekerCount: number;
        totalApplications: number;
    }>;
    getAllUsers(): Promise<import("../database/entities/user.entity").User[]>;
    suspendUser(id: string): Promise<{
        message: string;
    }>;
    deleteJob(id: string): Promise<{
        message: string;
    }>;
}
