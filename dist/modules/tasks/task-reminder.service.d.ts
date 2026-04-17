import { Model } from 'mongoose';
import { TaskDocument } from './schema/task.schema';
import { UserDocument } from '../users/schema/user.entity';
export declare class TaskReminderService {
    private taskModel;
    private userModel;
    private readonly logger;
    constructor(taskModel: Model<TaskDocument>, userModel: Model<UserDocument>);
    handleTaskReminders(): Promise<void>;
}
