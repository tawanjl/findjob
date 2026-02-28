import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../database/entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
    constructor(
        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>,
    ) { }

    async create(employerId: number, createCompanyDto: CreateCompanyDto): Promise<Company> {
        const existing = await this.companyRepository.findOne({ where: { employerId } });
        if (existing) {
            throw new ConflictException('Company profile already exists for this employer');
        }
        const newCompany = this.companyRepository.create({
            ...createCompanyDto,
            employerId,
        });
        return this.companyRepository.save(newCompany);
    }

    async findOneByEmployerId(employerId: number): Promise<Company | null> {
        return this.companyRepository.findOne({ where: { employerId } });
    }

    async update(employerId: number, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
        const company = await this.findOneByEmployerId(employerId);
        if (!company) {
            throw new NotFoundException('Company profile not found');
        }

        Object.assign(company, updateCompanyDto);
        return this.companyRepository.save(company);
    }

    async updateLogo(employerId: number, logoUrl: string): Promise<Company> {
        const company = await this.findOneByEmployerId(employerId);
        if (!company) {
            throw new NotFoundException('Company profile not found');
        }

        company.logoUrl = logoUrl;
        return this.companyRepository.save(company);
    }

    async updateBanner(employerId: number, bannerUrl: string): Promise<Company> {
        const company = await this.findOneByEmployerId(employerId);
        if (!company) {
            throw new NotFoundException('Company profile not found');
        }

        company.bannerUrl = bannerUrl;
        return this.companyRepository.save(company);
    }
}
