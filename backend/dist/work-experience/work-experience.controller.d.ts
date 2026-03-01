import { WorkExperienceService } from './work-experience.service';
import { CreateWorkExperienceDto } from './dto/create-work-experience.dto';
export declare class WorkExperienceController {
    private readonly service;
    constructor(service: WorkExperienceService);
    findAll(req: any): Promise<import("../database/entities/work-experience.entity").WorkExperience[]>;
    create(req: any, dto: CreateWorkExperienceDto): Promise<import("../database/entities/work-experience.entity").WorkExperience>;
    update(req: any, id: string, dto: Partial<CreateWorkExperienceDto>): Promise<import("../database/entities/work-experience.entity").WorkExperience>;
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
}
