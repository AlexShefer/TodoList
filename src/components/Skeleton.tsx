import styles from "./Skeleton.module.css"; // Import your CSS module

interface SkeletonProps {
    times: number;
    width?: string;
    height?: string;
}

function Skeleton({ times, width, height }: SkeletonProps) {
    const boxes = Array(times)
        .fill(0)
        .map((_, i) => {
            return (
                <div
                    key={i}
                    className={styles.skeleton_box} // Use the imported CSS module
                    style={{
                        width: `${width || ""}`,
                        height: `${height || ""}`,
                    }}
                >
                    <div className={styles.skeleton_shimmer}></div>
                </div>
            );
        });

    return <div className={styles.skeleton_container}>{boxes}</div>;
}

export default Skeleton;
