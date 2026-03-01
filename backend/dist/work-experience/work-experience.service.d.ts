import { Repository } from 'typeorm';
import { WorkExperience } from '../database/entities/work-experience.entity';
import { CreateWorkExperienceDto } from './dto/create-work-experience.dto';
export declare class WorkExperienceService {
    private readonly repo;
    constructor(repo: Repository<WorkExperience>);
    findAllByUser(userId: number): Promise<WorkExperience[]>;
    create(userId: number, dto: CreateWorkExperienceDto): Promise<WorkExperience>;
    update(userId: number, id: number, dto: Partial<CreateWorkExperienceDto>): Promise<WorkExperience>;
    remove(userId: number, id: number): Promise<{
        message: string;
    }>;
}
