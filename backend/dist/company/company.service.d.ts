import { Repository } from 'typeorm';
import { Company } from '../database/entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
export declare class CompanyService {
    private readonly companyRepository;
    constructor(companyRepository: Repository<Company>);
    create(employerId: number, createCompanyDto: CreateCompanyDto): Promise<Company>;
    findOneByEmployerId(employerId: number): Promise<Company | null>;
    update(employerId: number, updateCompanyDto: UpdateCompanyDto): Promise<Company>;
    updateLogo(employerId: number, logoUrl: string): Promise<Company>;
    updateBanner(employerId: number, bannerUrl: string): Promise<Company>;
}
