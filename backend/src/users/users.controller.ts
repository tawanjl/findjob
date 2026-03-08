import { Controller, Get, Post, Patch, Body, UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersService } from './users.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly cloudinaryService: CloudinaryService,
    ) { }

    @Get('profile')
    getMyProfile(@Request() req: any) {
        return this.usersService.getMyProfile(req.user.userId);
    }

    @Patch('profile')
    updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
        return this.usersService.updateProfile(req.user.userId, dto);
    }

    @Post('avatar')
    @UseInterceptors(FileInterceptor('file', {
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/i)) {
                return cb(new BadRequestException('Only JPG, PNG, WEBP files are allowed!'), false);
            }
            cb(null, true);
        },
        limits: { fileSize: 5 * 1024 * 1024 },
    }))
    async uploadAvatar(@Request() req: any, @UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException('File is required');

        const uploadResult = await this.cloudinaryService.uploadFile(file, 'jobportal/avatars');
        return this.usersService.updateAvatar(req.user.userId, uploadResult.secure_url);
    }
}
