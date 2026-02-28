import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
export declare class CompanyController {
    private readonly companyService;
    constructor(companyService: CompanyService);
    create(req: any, createCompanyDto: CreateCompanyDto): Promise<import("../database/entities/company.entity").Company>;
    findOne(req: any): Promise<import("../database/entities/company.entity").Company | null>;
    update(req: any, updateCompanyDto: UpdateCompanyDto): Promise<import("../database/entities/company.entity").Company>;
    uploadLogo(req: any, file: Express.Multer.File): Promise<import("../database/entities/company.entity").Company>;
    uploadBanner(req: any, file: Express.Multer.File): Promise<import("../database/entities/company.entity").Company>;
}
