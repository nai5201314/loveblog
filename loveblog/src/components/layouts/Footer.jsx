import { useEffect } from 'react';
import styles from './Footer.module.css';

export default function IndexFooter() {
  useEffect(() => {
    if (document.getElementById('LA-DATA-WIDGET')) return;

    const script = document.createElement('script');
    script.id = 'LA-DATA-WIDGET';
    script.crossOrigin = 'anonymous';
    script.src = 'https://v6-widget.51.la/v6/KvkkVi2X0nV51Cjk/quote.js?theme=1&f=12';
    script.async = true; 
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
<div className={styles.footer}>
  <div className={styles.icpGroup}>
    <img src="/icons/icp.png" alt="ICP备案" className={styles.icp} />
    <span className={styles.icpname}>桂ICP备202543610号-1</span>
  </div>
  <p className={styles.copyright}>Copyright © 2025 奈 All Rights Reserved.</p>
</div>
  );
}