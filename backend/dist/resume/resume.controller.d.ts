import { ResumeService } from './resume.service';
export declare class ResumeController {
    private readonly resumeService;
    constructor(resumeService: ResumeService);
    uploadFile(req: any, file: Express.Multer.File): Promise<import("../database/entities/resume.entity").Resume>;
    getResume(req: any): Promise<import("../database/entities/resume.entity").Resume>;
}
