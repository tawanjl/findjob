import { Repository } from 'typeorm';
import { Education } from '../database/entities/education.entity';
import { CreateEducationDto } from './dto/create-education.dto';
export declare class EducationService {
    private readonly repo;
    constructor(repo: Repository<Education>);
    findAllByUser(userId: number): Promise<Education[]>;
    create(userId: number, dto: CreateEducationDto): Promise<Education>;
    update(userId: number, id: number, dto: Partial<CreateEducationDto>): Promise<Education>;
    remove(userId: number, id: number): Promise<{
        message: string;
    }>;
}
