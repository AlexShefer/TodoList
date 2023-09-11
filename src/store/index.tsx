import { configureStore } from "@reduxjs/toolkit";
import { todoListApi } from "./api/todoListApi";

export const store = configureStore({
    reducer: {
        [todoListApi.reducerPath]: todoListApi.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(todoListApi.middleware);
    },
});
export {
    useFetchTasksQuery,
    useAddNewTaskMutation,
    useRemoveTaskMutation,
    useSaveUpdatedTaskMutation,
    useSetTaskStatusMutation,
    useRemoveCompletedTasksMutation,
} from "./api/todoListApi";
