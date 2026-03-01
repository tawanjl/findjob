import { Controller, Get, Post, Patch, Body, UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

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
        storage: diskStorage({
            destination: './uploads/avatars',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `avatar-${(req as any).user['userId']}-${uniqueSuffix}${extname(file.originalname)}`);
            },
        }),
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
        return this.usersService.updateAvatar(req.user.userId, `/uploads/avatars/${file.filename}`);
    }
}
