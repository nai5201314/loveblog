import styles from './Header.module.css';
import { Button } from 'antd';
import { Navigate, useNavigate } from 'react-router-dom';
import { useGlobalSpin } from '../../stores/spinStore'; 
export default function IndexHeader() {
  const navigate = useNavigate();
  const { setSpinning } = useGlobalSpin();
  const go = (path) => {
    setSpinning(true); 
    setTimeout(() => {
      try {
        navigate(path);
      } catch (error) {
        console.error('路由跳转失败:', error); 
      } finally {
        setSpinning(false);
      }
    }, 300); 
  };
  const handleClick = () => {
    go('/');
  };
  return (
    <div className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.title} >
          <span  onClick={handleClick} className={styles.titlespan}>
          <img 
          src='http://image.naiblog.cn/icons/maozhua.png'
          alt='home'
          className={styles.home}
          />
          <h2  className={styles.titletext}>小猫小狗的窝</h2>
          </span>
        </div>

      </div>
    </div>
  );
}