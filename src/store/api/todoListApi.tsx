import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { QueryReturnValue } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import {
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    collection,
} from "firebase/firestore";
import { db } from "../../firebase";
import { tasksCollection } from "../../firebase";
import { Task, NewTask } from "../../types/types";

type QueryResponse = Task[] | undefined;

type MutationResponse = {
    success?: boolean;
    error?: string;
};
type CustomErrorType = { error?: string };

const todoListApi = createApi({
    reducerPath: "todoListApi",
    baseQuery: fakeBaseQuery<CustomErrorType>(),
    tagTypes: ["tasks"],
    endpoints: (build) => ({
        fetchTasks: build.query<QueryResponse, string>({
            providesTags: ["tasks"],
            queryFn: async (
                key
            ): Promise<QueryReturnValue<QueryResponse, CustomErrorType>> => {
                try {
                    const snapshot = await getDocs(collection(db, key));

                    const tasks = snapshot.docs.map((doc) => {
                        const data = doc.data();

                        return {
                            ...data,
                            id: doc.id,
                        };
                    });

                    return { data: tasks as QueryResponse };
                } catch (error) {
                    return { error: error as CustomErrorType };
                }
            },
        }),
        addNewTask: build.mutation<MutationResponse, NewTask>({
            invalidatesTags: ["tasks"],
            queryFn: async (
                task
            ): Promise<QueryReturnValue<MutationResponse, CustomErrorType>> => {
                try {
                    const taskWithTimestamp = {
                        ...task,
                        createdAt: new Date().toISOString(),
                    };
                    await addDoc(tasksCollection, taskWithTimestamp);
                    return { data: { success: true } };
                } catch (error) {
                    return {
                        error: "Error adding new task" as CustomErrorType,
                    };
                }
            },
        }),
        setTaskStatus: build.mutation<MutationResponse, Task>({
            invalidatesTags: ["tasks"],
            queryFn: async (
                task
            ): Promise<QueryReturnValue<MutationResponse, CustomErrorType>> => {
                try {
                    if (task.id) {
                        const taskRef = doc(db, "tasks", task.id);

                        await updateDoc(taskRef, {
                            done: !task.done,
                        });
                    }
                    return { data: { success: true } };
                } catch (error) {
                    return {
                        error: "Error changing statue of the task ..." as CustomErrorType,
                    };
                }
            },
        }),
        removeTask: build.mutation<MutationResponse, Task>({
            invalidatesTags: ["tasks"],
            queryFn: async (
                task
            ): Promise<QueryReturnValue<MutationResponse, CustomErrorType>> => {
                try {
                    if (task.id) {
                        await deleteDoc(doc(db, "tasks", task.id));
                    }
                    return { data: { success: true } };
                } catch (error) {
                    return {
                        error: "Error removing task: " as CustomErrorType,
                    };
                }
            },
        }),
        saveUpdatedTask: build.mutation<MutationResponse, Task>({
            invalidatesTags: ["tasks"],
            queryFn: async (
                task
            ): Promise<QueryReturnValue<MutationResponse, CustomErrorType>> => {
                try {
                    if (task.id) {
                        const taskRef = doc(db, "tasks", task.id);

                        await updateDoc(taskRef, {
                            ...task,
                            createdAt: new Date().toISOString(),
                        });
                    }
                    return { data: { success: true } };
                } catch (error) {
                    return {
                        error: "Error updating task..." as CustomErrorType,
                    };
                }
            },
        }),
        removeCompletedTasks: build.mutation<MutationResponse, Task[]>({
            invalidatesTags: ["tasks"],
            queryFn: async (
                tasks
            ): Promise<QueryReturnValue<MutationResponse, CustomErrorType>> => {
                try {
                    const completedTask = tasks.filter((task) => task.done);
                    await Promise.all(
                        completedTask.map((task) => {
                            if (task.id) {
                                deleteDoc(doc(db, "tasks", task.id));
                            }
                        })
                    );
                    return { data: { success: true } };
                } catch (error) {
                    return {
                        error: "Error removing completed tasks..." as CustomErrorType,
                    };
                }
            },
        }),
    }),
});
export const {
    useFetchTasksQuery,
    useAddNewTaskMutation,
    useRemoveTaskMutation,
    useSaveUpdatedTaskMutation,
    useSetTaskStatusMutation,
    useRemoveCompletedTasksMutation,
} = todoListApi;
export { todoListApi };
