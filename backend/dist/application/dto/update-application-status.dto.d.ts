import { ApplicationStatus } from '../../database/entities/application.entity';
export declare class UpdateApplicationStatusDto {
    status: ApplicationStatus;
    employerReply?: string;
}
