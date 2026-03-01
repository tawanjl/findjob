"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.EmployerStatus = exports.UserRole = void 0;
const typeorm_1 = require("typeorm");
const resume_entity_1 = require("./resume.entity");
const company_entity_1 = require("./company.entity");
const application_entity_1 = require("./application.entity");
const skill_entity_1 = require("./skill.entity");
const post_entity_1 = require("./post.entity");
const comment_entity_1 = require("./comment.entity");
const bookmark_entity_1 = require("./bookmark.entity");
const work_experience_entity_1 = require("./work-experience.entity");
const education_entity_1 = require("./education.entity");
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "USER";
    UserRole["EMPLOYER"] = "EMPLOYER";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
var EmployerStatus;
(function (EmployerStatus) {
    EmployerStatus["PENDING"] = "PENDING";
    EmployerStatus["APPROVED"] = "APPROVED";
    EmployerStatus["REJECTED"] = "REJECTED";
})(EmployerStatus || (exports.EmployerStatus = EmployerStatus = {}));
let User = class User {
    id;
    email;
    password;
    role;
    approvalStatus;
    employerPhone;
    companyNameRequest;
    businessType;
    employerNote;
    firstName;
    lastName;
    phone;
    bio;
    location;
    desiredJobTitle;
    expectedSalary;
    avatarUrl;
    portfolioUrl;
    linkedinUrl;
    availableFrom;
    createdAt;
    updatedAt;
    resume;
    company;
    skills;
    applications;
    posts;
    comments;
    bookmarks;
    workExperiences;
    educations;
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: UserRole, default: UserRole.USER }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: EmployerStatus, nullable: true, default: null }),
    __metadata("design:type", Object)
], User.prototype, "approvalStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 20 }),
    __metadata("design:type", String)
], User.prototype, "employerPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "companyNameRequest", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "businessType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "employerNote", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 20 }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "bio", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "desiredJobTitle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "expectedSalary", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "avatarUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "portfolioUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "linkedinUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "availableFrom", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => resume_entity_1.Resume, (resume) => resume.user),
    __metadata("design:type", resume_entity_1.Resume)
], User.prototype, "resume", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => company_entity_1.Company, (company) => company.employer),
    __metadata("design:type", company_entity_1.Company)
], User.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => skill_entity_1.Skill, (skill) => skill.users),
    (0, typeorm_1.JoinTable)({ name: 'user_skills' }),
    __metadata("design:type", Array)
], User.prototype, "skills", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => application_entity_1.Application, (application) => application.user),
    __metadata("design:type", Array)
], User.prototype, "applications", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => post_entity_1.Post, (post) => post.user),
    __metadata("design:type", Array)
], User.prototype, "posts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => comment_entity_1.Comment, (comment) => comment.user),
    __metadata("design:type", Array)
], User.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => bookmark_entity_1.Bookmark, (bookmark) => bookmark.user),
    __metadata("design:type", Array)
], User.prototype, "bookmarks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => work_experience_entity_1.WorkExperience, (we) => we.user, { cascade: true }),
    __metadata("design:type", Array)
], User.prototype, "workExperiences", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => education_entity_1.Education, (edu) => edu.user, { cascade: true }),
    __metadata("design:type", Array)
], User.prototype, "educations", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
//# sourceMappingURL=user.entity.js.map