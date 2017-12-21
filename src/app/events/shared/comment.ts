import { User } from '../../ui/shared/user';

export class Comment {
    id?: string;
    userId: string;
    text: string;
    createdAt: Date;
    user?: User;
}