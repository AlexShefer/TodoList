import { useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import {
    useFetchTasksQuery,
    useAddNewTaskMutation,
    useSetTaskStatusMutation,
    useRemoveCompletedTasksMutation,
} from "../store";

import styles from "./TodoList.module.css";
import Skeleton from "./Skeleton";
import TaskComponent from "./Task";
import { Task, NewTask } from "../types/types";

export default function TodoList() {
    const { data, isLoading, error } = useFetchTasksQuery("tasks");

    // State for the new task input
    const [newTask, setNewTask] = useState<NewTask>({
        task: "",
        done: false,
    });

    const [editingTaskId, setEditingTaskId] = useState<null | string>(null);

    const [addNewTask] = useAddNewTaskMutation();
    const [setTaskStatus] = useSetTaskStatusMutation();
    const [removeCompletedTasks] = useRemoveCompletedTasksMutation();

    // State for filtering tasks
    const [filterTask, setFilterTask] = useState<string>("All");

    // Function to open the edit mode for a task
    const openEdit = (taskId: string) => {
        setEditingTaskId(taskId);
    };

    // Function to close the edit mode for the currently open task
    const closeEdit = () => {
        setEditingTaskId(null);
    };
    // Handle changes in the new task input field
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setNewTask((prevState) => ({
            ...prevState,
            task: event.target.value,
        }));
    }

    // Handle the submission of a new task
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        addNewTask(newTask);
        setNewTask((prevState) => ({
            ...prevState,
            task: "",
        }));
    }

    // Handle the change of task status
    function handleChangeStatus(task: Task) {
        setTaskStatus(task);
    }

    // Handle clearing completed tasks
    function handleClearTaskList() {
        removeCompletedTasks(data || []);
    }

    const filteredTasks = (tasks: Task[]) =>
        tasks?.filter((task) => {
            if (filterTask === "Active") {
                return !task.done;
            } else if (filterTask === "Completed") {
                return task.done;
            } else {
                return task;
            }
        });

    let content;

    if (isLoading) {
        content = <Skeleton times={3} width="100%" height="25px" />;
    } else if (error) {
        <li className={styles.todos__item}>Error fetching tasks...</li>;
    } else if (data) {
        const sortedData = data?.slice().sort((a: Task, b: Task) => {
            if (a.createdAt && b.createdAt) {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return dateB.getTime() - dateA.getTime();
            }
            // Handle cases where createdAt is not defined for some tasks
            return 0; // You can modify this to suit your sorting criteria
        });

        content = filteredTasks(sortedData ?? []).map((task) => {
            const isEditing = editingTaskId === task.id;

            return (
                <TaskComponent
                    onClick={() => handleChangeStatus(task)}
                    key={task.id}
                    task={task}
                    isEditing={isEditing}
                    openEdit={openEdit}
                    closeEdit={closeEdit}
                />
            );
        });
    } else {
        content = <li className={styles.todos__item}>No tasks available.</li>;
    }

    const description = (filterRequest: string) => {
        switch (filterRequest) {
            case "All":
            case "Active":
                // return `${data.filter((task: Task) => !task.done)} left task`;
                return "All";
            case "Completed":
                // return `${
                //     data.filter((task: Task) => task.done).length
                // } completed task`;
                return "Completed";
            default:
                return "0 tasks";
        }
    };

    return (
        <div className={styles.todos}>
            <h1 className={styles.todos__header}>todos</h1>
            <div className={styles.todos__container}>
                <form
                    onSubmit={handleSubmit}
                    className={styles.todos__container__form}
                >
                    <label htmlFor="todo">
                        <BsChevronDown />
                    </label>
                    <input
                        className={styles.todos__container__form__input}
                        type="text"
                        name="todo"
                        value={newTask.task}
                        onChange={handleChange}
                        placeholder="What need to be done?"
                    />
                </form>
                <ul>
                    <li>Tasks will be here</li>
                    {content}
                </ul>

                <div className={styles.todos__container__footer}>
                    <p> {description(filterTask)}</p>
                    <div className={styles.todos__container__footer__filter}>
                        <button
                            className={styles.todos__container__footer_button}
                            onClick={() => setFilterTask("All")}
                        >
                            All
                        </button>
                        <button
                            className={styles.todos__container__footer_button}
                            onClick={() => setFilterTask("Active")}
                        >
                            Active
                        </button>
                        <button
                            className={styles.todos__container__footer_button}
                            onClick={() => setFilterTask("Completed")}
                        >
                            Completed
                        </button>
                    </div>
                    <button
                        className={styles.todos__container__footer_button}
                        onClick={handleClearTaskList}
                    >
                        Clear Completed
                    </button>
                </div>
            </div>
        </div>
    );
}
