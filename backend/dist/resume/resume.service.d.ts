import { Repository } from 'typeorm';
import { Resume } from '../database/entities/resume.entity';
export declare class ResumeService {
    private readonly resumeRepository;
    constructor(resumeRepository: Repository<Resume>);
    uploadResume(userId: number, fileUrl: string): Promise<Resume>;
    getResume(userId: number): Promise<Resume>;
}
