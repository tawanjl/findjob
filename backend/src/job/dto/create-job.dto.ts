import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { JobType } from '../../database/entities/job.entity';

export class CreateJobDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsOptional()
    @IsNumber()
    salaryMin?: number;

    @IsOptional()
    @IsNumber()
    salaryMax?: number;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsEnum(JobType)
    jobType?: JobType;

    @IsOptional()
    @IsString()
    experience?: string;

    @IsOptional()
    @IsBoolean()
    active?: boolean;
}
