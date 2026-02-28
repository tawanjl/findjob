import { Controller, Post, Get, UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ResumeService } from './resume.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../database/entities/user.entity';

@Controller('resume')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ResumeController {
    constructor(private readonly resumeService: ResumeService) { }

    @Roles(UserRole.USER)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, `${(req as any).user['userId']}-${uniqueSuffix}${extname(file.originalname)}`);
            }
        }),
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(pdf)$/)) {
                return cb(new BadRequestException('Only PDF files are allowed!'), false);
            }
            cb(null, true);
        },
        limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
    }))
    uploadFile(@Request() req, @UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('File is required');
        }
        // We store the relative path for serving later or DB reference
        const fileUrl = `/uploads/${file.filename}`;
        return this.resumeService.uploadResume(req.user.userId, fileUrl);
    }

    @Roles(UserRole.USER)
    @Get()
    getResume(@Request() req) {
        return this.resumeService.getResume(req.user.userId);
    }
}
