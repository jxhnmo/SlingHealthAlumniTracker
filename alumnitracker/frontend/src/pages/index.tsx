import React from "react";
import styles from '@/styles/index.module.css';

const IndexPage: React.FC = () => {
  return (
    <div className={styles.background}>
      <header className={styles.header}>
        <h1>AlumniTracker</h1>
      </header>
    </div>
  );
};

export default IndexPage;
