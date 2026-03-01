import { User } from './user.entity';
export declare class WorkExperience {
    id: number;
    userId: number;
    company: string;
    position: string;
    startDate: Date;
    endDate: Date | null;
    isCurrent: boolean;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
}
