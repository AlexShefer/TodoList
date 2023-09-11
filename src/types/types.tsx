export interface Task {
    id?: string;
    done?: boolean;
    createdAt?: string;
    task?: string;
}
export interface NewTask {
    done: boolean;
    task: string;
}
