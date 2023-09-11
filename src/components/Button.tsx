import React from "react";
import classNames from "classnames";
import { GoSync } from "react-icons/go";
import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    primary?: boolean;
    secondary?: boolean;
    success?: boolean;
    warning?: boolean;
    danger?: boolean;
    outline?: boolean;
    rounded?: boolean;
    loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    primary,
    secondary,
    success,
    warning,
    danger,
    outline,
    rounded,
    loading,
    ...rest
}) => {
    const classes = classNames(styles.button, {
        [styles.loading]: loading,
        [styles.primary]: primary,
        [styles.secondary]: secondary,
        [styles.success]: success,
        [styles.warning]: warning,
        [styles.danger]: danger,
        [styles.rounded]: rounded,
        [styles.outline]: outline,
    });

    return (
        <button {...rest} disabled={loading} className={classes}>
            {loading ? <GoSync className={styles.spin} /> : children}
        </button>
    );
};

export default Button;
