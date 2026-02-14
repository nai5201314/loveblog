import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import styles from './css/Diary.module.css';
import { useGlobalSpin } from '../../stores/spinStore';
import api from '../../utils/api';
import { formatDate, formatDateTimeWithSeconds } from '../../utils/dateFormat';

const PAGE_SIZE = 8;

export default function Photo() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSpinning } = useGlobalSpin();
const [maleName, setMaleName] = useState('');
const [femaleName, setFemaleName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [photoList, setPhotoList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const isDetailPage = location.pathname !== '/photo' && location.pathname.includes('/photo/');
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
    const fetchPhotos = async () => {
      setSpinning(true);
      try {
        const response = await api.getPhotos(currentPage, PAGE_SIZE);
        if (response.success) {
          setPhotoList(response.data.list);
          setTotalPages(response.data.pagination.totalPages);
        }
      } catch (error) {
        console.error('获取照片列表失败:', error);
      } finally {
        setSpinning(false);
      }
    };
    fetchPhotos();
  }, [currentPage, setSpinning]);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleCardClick = (id) => {
    setSpinning(true);
    setTimeout(() => {
      navigate(`/photo/${id}`);
      setSpinning(false);
    }, 300);
  };

  return (
    <div className={styles.container}>
      <Outlet /> 

      {!isDetailPage && (
        <>
          <h1 className={styles.title}>猫狗照片墙</h1>

          
          <div className={styles.cardGrid}>
            {photoList.map((photo) => (
              <div
                key={photo.id}
                className={styles.card}
                onClick={() => handleCardClick(photo.id)}
              >
                <div className={styles.cover}>
                  <img src={photo.cover} alt={photo.title} />
                </div>
                <div className={styles.content}>
                  <h3 className={styles.cardTitle}>{photo.title}</h3>
                  

                  <span className={styles.authordate}>        
                              <p className={styles.author}>
                               <i className="bi bi-person-circle me-1"></i> 
                                {photo.author === 'male' ? maleName : photo.author === 'female' ? femaleName : ''}</p>
                  <p className={styles.date}>
                    <i className="bi bi-clock me-1"></i>
                    {photo.created_at ? formatDateTimeWithSeconds(photo.created_at) : (photo.date ? formatDateTimeWithSeconds(photo.date) : '')}</p>
                  </span>
          
                  {photo.desc && (
                    <p className={styles.desc} style={{ fontSize: '12px', color: '#666' }}>
                      {photo.desc}
                    </p>
                  )}
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