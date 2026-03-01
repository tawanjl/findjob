import { IsString, IsOptional, IsInt, IsDateString, IsUrl, Min } from 'class-validator';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsString()
    desiredJobTitle?: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    expectedSalary?: number;

    @IsOptional()
    @IsString()
    avatarUrl?: string;

    @IsOptional()
    @IsString()
    portfolioUrl?: string;

    @IsOptional()
    @IsString()
    linkedinUrl?: string;

    @IsOptional()
    @IsDateString()
    availableFrom?: string;
}
