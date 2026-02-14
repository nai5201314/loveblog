import React, { useState } from 'react';
import { Outlet, useNavigate ,useLocation} from 'react-router-dom';
import styles from './css/Diary.module.css';
import { useGlobalSpin } from '../../stores/spinStore';
import { useEffect } from 'react';
import api from '../../utils/api';
import { formatDate, formatDateTimeWithSeconds } from '../../utils/dateFormat';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const PAGE_SIZE = 8;

export default function Diary() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSpinning } = useGlobalSpin();
const [maleName, setMaleName] = useState('');
const [femaleName, setFemaleName] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [diaryList, setDiaryList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

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
    const fetchDiaries = async () => {
      setSpinning(true);
      try {
        const response = await api.getDiaries(currentPage, PAGE_SIZE);
        if (response.success) {
          setDiaryList(response.data.list);
          setTotalPages(response.data.pagination.totalPages);
        }
      } catch (error) {
        console.error('获取日记列表失败:', error);
      } finally {
        setSpinning(false);
      }
    };
    fetchDiaries();
  }, [currentPage, setSpinning]);
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleCardClick = (id) => {
    setSpinning(true);
    setTimeout(() => {
      navigate(`/diary/${id}`);
      setSpinning(false);
    }, 300);
  };
  
  const isDetailPage = location.pathname !== '/diary' && location.pathname.includes('/diary/');

 return (
    <div className={styles.container}>
      
      <Outlet />

      
      {!isDetailPage && (
        <>
          <h1 className={styles.title}>猫狗日记</h1>
          
          
          <div className={styles.cardGrid}>
            {diaryList.map((diary) => (
              <div
                key={diary.id}
                className={styles.card}
                onClick={() => handleCardClick(diary.id)}
              >
                <div className={styles.cover}>
                  <img src={diary.cover} 
                  alt={diary.title} 
                  loading="lazy"/>
                </div>
                <div className={styles.content}>
                  <h3 className={styles.cardTitle}>{diary.title}</h3>
        <span className={styles.authordate}>
          
          <p className={styles.author}>
            <i className="bi bi-person-circle me-1"></i>
           {diary.author === 'male' ? maleName : diary.author === 'female' ? femaleName : ''}
          </p>
          
          <p className={styles.date}>
            <i className="bi bi-clock me-1"></i>
            {diary.created_at ? formatDateTimeWithSeconds(diary.created_at) : (diary.date ? formatDateTimeWithSeconds(diary.date) : '')}
          </p>
                  </span>

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
          </div>
        </>
      )}
    </div>
  );
}
