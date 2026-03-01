import { IsString, IsOptional, IsBoolean, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateEducationDto {
    @IsString()
    institution: string;

    @IsString()
    degree: string;

    @IsOptional()
    @IsString()
    fieldOfStudy?: string;

    @Transform(({ value }) => Number(value))
    @IsInt()
    @Min(1950)
    @Max(2100)
    startYear: number;

    @IsOptional()
    @Transform(({ value }) => value != null && value !== '' ? Number(value) : undefined)
    @IsInt()
    @Min(1950)
    @Max(2100)
    endYear?: number;

    @IsOptional()
    @IsBoolean()
    isCurrent?: boolean;
}
