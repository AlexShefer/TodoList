import { useState } from "react";
import { BsCheckLg } from "react-icons/bs";
import { FaRegSave, FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import Button from "./Button";
import { useRemoveTaskMutation, useSaveUpdatedTaskMutation } from "../store";
import styles from "./Task.module.css";

interface TaskProps {
    task: {
        id?: string;
        task?: string;
        done?: boolean;
        createdAt?: string;
    };
    isEditing: boolean;
    openEdit: (id: string) => void;
    closeEdit: () => void;
    onClick: () => void;
}

function Task({ task, onClick, isEditing, openEdit, closeEdit }: TaskProps) {
    const [updateTask, setUpdateTask] = useState(task);
    const [removeTask] = useRemoveTaskMutation();
    const [saveUpdatedTask] = useSaveUpdatedTaskMutation();
    const handleUpdateTask = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUpdateTask((prevState) => ({
            ...prevState,
            task: e.target.value,
        }));
    };
    const handleRemoveTask = (e: React.MouseEvent) => {
        e.stopPropagation();
        removeTask(task);
    };
    const handleSaveTask = (e: React.MouseEvent | React.KeyboardEvent) => {
        e.preventDefault();
        saveUpdatedTask(updateTask);
        closeEdit();
    };

    return (
        <li className={styles.task__item}>
            <div className={styles.task__item__checkbox} onClick={onClick}>
                {task.done && (
                    <BsCheckLg
                        style={{
                            color: "green",
                        }}
                    />
                )}
            </div>
            <div
                className={styles.task__item__text}
                onClick={() => {
                    if (!isEditing && task.id) {
                        openEdit(task.id);
                    }
                }}
            >
                {task.task}
                {/* panel to display on adit only for one task at a time */}
                {isEditing && (
                    <div className={styles.task__item__panel}>
                        <input
                            type="text"
                            value={updateTask.task}
                            onChange={handleUpdateTask}
                            className={styles.task__item__panel__input}
                            onKeyPress={(
                                e: React.KeyboardEvent<HTMLInputElement>
                            ) => {
                                // Listen for Enter key press to save the task
                                if (e.key === "Enter") {
                                    handleSaveTask(e);
                                }
                            }}
                        />

                        <Button success rounded onClick={() => closeEdit()}>
                            <FaRegEdit />
                        </Button>
                        <Button warning rounded onClick={handleSaveTask}>
                            <FaRegSave />
                        </Button>
                        <Button danger rounded onClick={handleRemoveTask}>
                            <FaRegTrashAlt />
                        </Button>
                    </div>
                )}
            </div>
        </li>
    );
}

export default Task;
