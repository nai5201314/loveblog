import { useEffect } from 'react';
import {useNavigate} from 'react-router-dom'
import { useGlobalSpin } from '../../stores/spinStore';
import {Button} from 'antd';
import styles from './css/NotFound.module.css'
export default function NotFound() {
  const nav = useNavigate ();
  const {setSpinning} = useGlobalSpin();


  const go =() => {
    setSpinning(false);
    nav('/');
  }

  return (
    <div className={styles.notfoundbox}>
      <h1 className={styles.h1}>404 Not Found</h1>
      <h2 className={styles.h2}>小猫小狗不见了？</h2>
      <p className={styles.p}>去首页找找吧</p>
      <Button 
      onClick = {go}
      type='primary' ghost>
        返回首页</Button>
    </div>
  );
}