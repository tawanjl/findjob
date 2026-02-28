import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateApplicationDto {
    @IsNumber()
    @IsNotEmpty()
    jobId: number;

    @IsOptional()
    @IsString()
    coverLetter?: string;
}
