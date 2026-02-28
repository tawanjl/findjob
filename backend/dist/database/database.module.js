"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const user_entity_1 = require("./entities/user.entity");
const company_entity_1 = require("./entities/company.entity");
const job_entity_1 = require("./entities/job.entity");
const resume_entity_1 = require("./entities/resume.entity");
const skill_entity_1 = require("./entities/skill.entity");
const application_entity_1 = require("./entities/application.entity");
const bookmark_entity_1 = require("./entities/bookmark.entity");
const post_entity_1 = require("./entities/post.entity");
const comment_entity_1 = require("./entities/comment.entity");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'mysql',
                    host: configService.get('DB_HOST', 'localhost'),
                    port: configService.get('DB_PORT', 3306),
                    username: configService.get('DB_USER', 'root'),
                    password: configService.get('DB_PASSWORD', 'root'),
                    database: configService.get('DB_NAME', 'job_portal'),
                    entities: [user_entity_1.User, company_entity_1.Company, job_entity_1.Job, resume_entity_1.Resume, skill_entity_1.Skill, application_entity_1.Application, bookmark_entity_1.Bookmark, post_entity_1.Post, comment_entity_1.Comment],
                    synchronize: true,
                }),
            }),
        ],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map