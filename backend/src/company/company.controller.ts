import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CompanyService } from './company.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../database/entities/user.entity';

@Controller('company')
export class CompanyController {
    constructor(
        private readonly companyService: CompanyService,
        private readonly cloudinaryService: CloudinaryService,
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.EMPLOYER)
    create(@Request() req, @Body() createCompanyDto: CreateCompanyDto) {
        return this.companyService.create(req.user.userId, createCompanyDto);
    }

    @Get('my-profile')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.EMPLOYER)
    findOne(@Request() req) {
        return this.companyService.findOneByEmployerId(req.user.userId);
    }

    // สถิติ Employer Dashboard
    @Get('my-stats')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.EMPLOYER)
    getStats(@Request() req) {
        return this.companyService.getEmployerStats(req.user.userId);
    }

    // Public: ดูโปรไฟล์บริษัทโดย id (ผู้หางานสามารถดูได้)
    @Get(':id')
    findById(@Param('id') id: string) {
        return this.companyService.findOneById(+id);
    }

    @Patch()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.EMPLOYER)
    update(@Request() req, @Body() updateCompanyDto: UpdateCompanyDto) {
        return this.companyService.update(req.user.userId, updateCompanyDto);
    }

    @Post('logo')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.EMPLOYER)
    @UseInterceptors(FileInterceptor('file', {
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
                return cb(new BadRequestException('Only JPG and PNG image files are allowed!'), false);
            }
            cb(null, true);
        },
        limits: { fileSize: 5 * 1024 * 1024 }
    }))
    async uploadLogo(@Request() req, @UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException('File is required');

        const uploadResult = await this.cloudinaryService.uploadFile(file, 'jobportal/logos');
        return this.companyService.updateLogo(req.user.userId, uploadResult.secure_url);
    }

    @Post('banner')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.EMPLOYER)
    @UseInterceptors(FileInterceptor('file', {
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
                return cb(new BadRequestException('Only JPG and PNG image files are allowed!'), false);
            }
            cb(null, true);
        },
        limits: { fileSize: 5 * 1024 * 1024 }
    }))
    async uploadBanner(@Request() req, @UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException('File is required');

        const uploadResult = await this.cloudinaryService.uploadFile(file, 'jobportal/banners');
        return this.companyService.updateBanner(req.user.userId, uploadResult.secure_url);
    }
}
