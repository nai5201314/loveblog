import React from 'react';
import styles from './CrossFadeBg.module.css';
import { useState } from 'react';
const pics = [
  'http:///image.naiblog.cn/images/bg0.png',
  'http:///image.naiblog.cn/images/bg1.png',
];
export default function CrossFadeBg({ children }) {
  const [index, setIndex] = useState(0);
  return (
    <div className={styles.container}>
      {pics.map((src, i) => (
        <div
          key={src}
          className={styles.layer}
          style={{
            backgroundImage: `url(${src})`,
            animationDelay: `${i * 5}s`, 
          }}
        />
      ))}
      <div className={styles.content}>{children}</div>
    </div>
  );
}