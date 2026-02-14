import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import styles from './css/Diary.module.css';
import { useGlobalSpin } from '../../stores/spinStore';
import api from '../../utils/api'; 
import { formatDate, formatDateTimeWithSeconds } from '../../utils/dateFormat';
const PAGE_SIZE = 8;

export default function Music() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSpinning } = useGlobalSpin();
const [maleName, setMaleName] = useState('');
const [femaleName, setFemaleName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [musicList, setMusicList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const isDetailPage = location.pathname !== '/music' && location.pathname.includes('/music/');
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
    const fetchMusics = async () => {
      setSpinning(true);
      try {
        const response = await api.getMusics(currentPage, PAGE_SIZE);
        if (response.success) {
          setMusicList(response.data.list);
          setTotalPages(response.data.pagination.totalPages);
        }
      } catch (error) {
        console.error('获取音乐列表失败:', error);
      } finally {
        setSpinning(false);
      }
    };
    fetchMusics();
  }, [currentPage, setSpinning]);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleCardClick = (id) => {
    setSpinning(true);
    setTimeout(() => {
      navigate(`/music/${id}`);
      setSpinning(false);
    }, 300);
  };

  return (
    <div className={styles.container}>
      <Outlet /> 

      {!isDetailPage && (
        <>
          <h1 className={styles.title}>猫狗音乐墙</h1>

          
          <div className={styles.cardGrid}>
            {musicList.map((music) => (
              <div
                key={music.id}
                className={styles.card}
                onClick={() => handleCardClick(music.id)}
              >
                <div className={styles.cover}>
                  
                  <img 
                    src={music.cover || 'https://via.placeholder.com/300x200?text=暂无封面'} 
                    alt={music.title} 
                  />
                </div>
                <div className={styles.content}>
                  <h3 className={styles.cardTitle}>{music.title || '未知标题'}</h3>
                  
                  <div className={styles.authordate}>
                    <p className={styles.date}>
                      <i className="bi bi-person-circle me-1"></i>
                      {music.singer || '未知歌手'} • {music.duration || '未知时长'}
                    </p>
                    <p className={styles.date}>
                      <i className="bi bi-clock me-1"></i>
                      {music.created_at ? formatDateTimeWithSeconds(music.created_at) : formatDate(music.date)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          
          <div className={styles.pagination}>
            <button
              className={styles.pageBtn}
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
            >
              首页
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`${styles.pageBtn} ${currentPage === i + 1 ? styles.active : ''}`}
                onClick={() => goToPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              className={styles.pageBtn}
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              尾页
            </button>
          </div>
        </>
      )}
    </div>
  );
}