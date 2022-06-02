import styles from "./styles.module.scss";

export const ProgressBar = ({
  current,
  bgColor = "#ffc107",
  label = "done",
}: {
  current: number;
  bgColor?: string;
  label?: string;
}) => {
  const customBar = {
    backgroundColor: bgColor,
    width: `${current}%`,
  };

  return (
    <div className={styles.barOuter}>
      <div className={styles.progress}>
        <div className={styles.bar} style={customBar}></div>
      </div>
      {label && (
        <span className="progress-info">
          {current}%&nbsp;{label}
        </span>
      )}
    </div>
  );
};
