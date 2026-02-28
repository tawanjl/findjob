import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
export declare class ApplicationController {
    private readonly applicationService;
    constructor(applicationService: ApplicationService);
    apply(req: any, createApplicationDto: CreateApplicationDto): Promise<import("../database/entities/application.entity").Application>;
    findMyApplications(req: any): Promise<import("../database/entities/application.entity").Application[]>;
    findApplicantsForJob(req: any, jobId: string): Promise<import("../database/entities/application.entity").Application[]>;
    updateStatus(req: any, id: string, updateStatusDto: UpdateApplicationStatusDto): Promise<import("../database/entities/application.entity").Application>;
}
