import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGlobalSpin } from '../../stores/spinStore';
import styles from './css/TimeDetail.module.css';
import api from '../../utils/api';
import { formatDate, formatDateTimeWithSeconds } from '../../utils/dateFormat';
export default function TimeDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { setSpinning } = useGlobalSpin();
  const [time, setTime] = useState(null);

  useEffect(() => {
    const fetchTime = async () => {
      setSpinning(true);
      try {
        const response = await api.getTimeById(id);
        if (response.success) {
          setTime(response.data);
        } else {
          setTime(null);
        }
      } catch (error) {
        console.error('获取时光详情失败:', error);
        setTime(null);
      } finally {
        setSpinning(false);
      }
    };
    fetchTime();
  }, [id, setSpinning]);

  if (!time) {
    return (
      <div className={styles.notFound}>
        <button onClick={() => {
          setSpinning(true);
          setTimeout(
            () => {
              navigate('/time');
              setSpinning(false);
            }, 300
          );
        }} className={styles.backBtn}>返回时光机</button>
        <h2>时光记录不存在</h2>
        <p>可能是记录编号错误，返回列表看看吧～</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button onClick={() => {
        setSpinning(true);
        setTimeout(
          () => {
            navigate('/time');
            setSpinning(false);
          }, 300
        );
      }} className={styles.backBtn}>
        ← 返回时光机
      </button>

      {/* 时光详情卡片 */}
      <div className={styles.timeCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>{time.title}</h1>
          <div className={styles.meta}>
            <span className={styles.date}>{time.created_at ? formatDateTimeWithSeconds(time.created_at) : formatDate(time.date)}</span>
            {time.location && (
              <span className={styles.location}> {time.location}</span>
            )}
          </div>
          {time.tag && (
            <div className={`${styles.tag} ${styles[`${time.tag}Tag`]}`}>
              {time.tag} {time.emotion && `| ${time.emotion}`}
            </div>
          )}
        </div>
        <div className={styles.content}>
          {time.desc && time.desc.split('\n').map((line, idx) => (
            <p key={idx} className={styles.contentLine}>{line || <br />}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
