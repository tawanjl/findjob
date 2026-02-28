import { Controller, Get, Post, Body, Patch, UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../database/entities/user.entity';

@Controller('company')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompanyController {
    constructor(private readonly companyService: CompanyService) { }

    @Post()
    @Roles(UserRole.EMPLOYER)
    create(@Request() req, @Body() createCompanyDto: CreateCompanyDto) {
        return this.companyService.create(req.user.userId, createCompanyDto);
    }

    @Get('my-profile')
    @Roles(UserRole.EMPLOYER)
    findOne(@Request() req) {
        return this.companyService.findOneByEmployerId(req.user.userId);
    }

    @Patch()
    @Roles(UserRole.EMPLOYER)
    update(@Request() req, @Body() updateCompanyDto: UpdateCompanyDto) {
        return this.companyService.update(req.user.userId, updateCompanyDto);
    }

    @Post('logo')
    @Roles(UserRole.EMPLOYER)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/logos',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, `company-${(req as any).user['userId']}-${uniqueSuffix}${extname(file.originalname)}`);
            }
        }),
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
                return cb(new BadRequestException('Only JPG and PNG image files are allowed!'), false);
            }
            cb(null, true);
        },
        limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
    }))
    uploadLogo(@Request() req, @UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('File is required');
        }
        const fileUrl = `/uploads/logos/${file.filename}`;
        return this.companyService.updateLogo(req.user.userId, fileUrl);
    }

    @Post('banner')
    @Roles(UserRole.EMPLOYER)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/banners',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, `banner-${(req as any).user['userId']}-${uniqueSuffix}${extname(file.originalname)}`);
            }
        }),
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
                return cb(new BadRequestException('Only JPG and PNG image files are allowed!'), false);
            }
            cb(null, true);
        },
        limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
    }))
    uploadBanner(@Request() req, @UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('File is required');
        }
        const fileUrl = `/uploads/banners/${file.filename}`;
        return this.companyService.updateBanner(req.user.userId, fileUrl);
    }
}
