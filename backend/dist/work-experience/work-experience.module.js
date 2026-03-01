"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkExperienceModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const work_experience_service_1 = require("./work-experience.service");
const work_experience_controller_1 = require("./work-experience.controller");
const work_experience_entity_1 = require("../database/entities/work-experience.entity");
let WorkExperienceModule = class WorkExperienceModule {
};
exports.WorkExperienceModule = WorkExperienceModule;
exports.WorkExperienceModule = WorkExperienceModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([work_experience_entity_1.WorkExperience])],
        controllers: [work_experience_controller_1.WorkExperienceController],
        providers: [work_experience_service_1.WorkExperienceService],
    })
], WorkExperienceModule);
//# sourceMappingURL=work-experience.module.js.map