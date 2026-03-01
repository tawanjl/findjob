import { User } from './user.entity';
export declare class Education {
    id: number;
    userId: number;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startYear: number;
    endYear: number | null;
    isCurrent: boolean;
    createdAt: Date;
    updatedAt: Date;
    user: User;
}
