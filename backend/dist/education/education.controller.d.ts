import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
export declare class EducationController {
    private readonly service;
    constructor(service: EducationService);
    findAll(req: any): Promise<import("../database/entities/education.entity").Education[]>;
    create(req: any, dto: CreateEducationDto): Promise<import("../database/entities/education.entity").Education>;
    update(req: any, id: string, dto: Partial<CreateEducationDto>): Promise<import("../database/entities/education.entity").Education>;
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
}
