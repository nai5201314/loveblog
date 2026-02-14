import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import styles from './css/Time.module.css';
import { useGlobalSpin } from '../../stores/spinStore';
import api from '../../utils/api';
import { formatDate, formatDateTimeWithSeconds } from '../../utils/dateFormat';

export default function Time() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSpinning } = useGlobalSpin();
  const [maleName, setMaleName] = useState('');
const [femaleName, setFemaleName] = useState('');
  const [activeTag, setActiveTag] = useState('all');
  const [timeList, setTimeList] = useState([]);
  const [filteredTimes, setFilteredTimes] = useState([]);

  const isDetailPage = location.pathname !== '/time' && location.pathname.includes('/time/');
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.getSettings();
        if (res.success) {
          setMaleName(res.data.male_name || '');
          setFemaleName(res.data.female_name || '');
        }
      } catch (e) {
        console.error('获取设置失败', e);
      }
    };
  
    fetchSettings();
  }, []);
  useEffect(() => {
    const fetchTimes = async () => {
      setSpinning(true);
      try {
        const response = await api.getTimes('all');
        if (response.success) {
          setTimeList(response.data);
        }
      } catch (error) {
        console.error('获取时光列表失败:', error);
      } finally {
        setSpinning(false);
      }
    };
    fetchTimes();
  }, [setSpinning]);
  useEffect(() => {
    if (activeTag === 'all') {
      setFilteredTimes(timeList);
    } else {
      setFilteredTimes(timeList.filter(item => item.tag === activeTag));
    }
  }, [activeTag, timeList]);

  const handleTimeClick = (id) => {
    setSpinning(true);
    setTimeout(() => {
      navigate(`/time/${id}`);
      setSpinning(false);
    }, 300);
  };

  return (
    <div className={styles.timeContainer}>
      <Outlet />

      {!isDetailPage && (
        <>
          <h1 className={styles.timeTitle}>我们的时光机</h1>
          <div className={styles.tagContainer}>
            {['all', '初见', '告白', '纪念日', '旅行', '日常'].map(tag => (
              <button
                key={tag}
                className={`${styles.tagBtn} ${activeTag === tag ? styles.activeTag : ''}`}
                onClick={() => setActiveTag(tag)}
              >
                {tag === 'all' ? '全部时光' : tag}
              </button>
            ))}
          </div>

          <div className={styles.timelineContainer}>
            {filteredTimes.length === 0 ? (
              <div className={styles.emptyTip}>暂无相关时光记录～</div>
            ) : (
              <div className={styles.timeline}>
                <div className={styles.timelineLine}></div>
                {filteredTimes.map((item, index) => (
                  <div 
                    key={item.id}
                    className={`${styles.timelineItem} ${
                      index % 2 === 0 ? styles.leftItem : styles.rightItem
                    }`}
                    onClick={() => handleTimeClick(item.id)}
                  >
                    <div className={styles.timeNode}>
                      <span className={styles.nodeIcon}>❤️</span>
                    </div>
                    
                    <div className={styles.timeCard}>
                      <div className={styles.timeDate}>{item.created_at ? formatDateTimeWithSeconds(item.created_at) : formatDate(item.date)}</div>
                      <h3 className={styles.timeTitle}>{item.title}</h3>
                      <div className={`${styles.timeTag} ${styles[`${item.tag}Tag`]}`}>
                        {item.tag} | {item.emotion}
                      </div>
                      <p className={styles.timeDesc}>{item.desc.substring(0, 50)}...</p>
                      <button className={styles.detailBtn}>查看详情</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}