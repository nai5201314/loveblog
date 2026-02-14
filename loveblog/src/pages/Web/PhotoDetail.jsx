import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGlobalSpin } from '../../stores/spinStore';
import styles from './css/PhotoDetail.module.css';
import api from '../../utils/api';
import { formatDate, formatDateTimeWithSeconds } from '../../utils/dateFormat';

export default function PhotoDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { setSpinning } = useGlobalSpin();
  const [photo, setPhoto] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const fetchPhoto = async () => {
      setSpinning(true);
      try {
        const response = await api.getPhotoById(id);
        if (response.success) {
          setPhoto(response.data);
        } else {
          setPhoto(null);
        }
      } catch (error) {
        console.error('获取照片详情失败:', error);
        setPhoto(null);
      } finally {
        setSpinning(false);
      }
    };
    fetchPhoto();
  }, [id, setSpinning]);

  if (!photo) {
    return (
      <div className={styles.notFound}>
        <button onClick={() => {
          setSpinning(true);
          setTimeout(
            () => {
              navigate('/photo');
              setSpinning(false);
            }, 300
          );
        }} className={styles.backBtn}>返回照片墙</button>
        <h2> 照片不存在</h2>
        <p>可能是照片编号错误，返回列表看看吧～</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button onClick={() => {
        setSpinning(true);
        setTimeout(
          () => {
            navigate('/photo');
            setSpinning(false);
          }, 300
        );
      }} className={styles.backBtn}>
        ← 返回照片墙
      </button>
      <div className={styles.photoCard}>
        <div className={styles.header}>
          {photo.title && <h1 className={styles.title}>{photo.title}</h1>}
          <p className={styles.date}>
            <i className="bi bi-calendar-date me-1"></i>
            {photo.created_at ? formatDateTimeWithSeconds(photo.created_at) : formatDate(photo.date)}</p>
        </div>
        
        <div className={styles.photoWrapper}>
          {!imageLoaded && (
            <div className={styles.loadingPlaceholder}>
              <div className={styles.loadingSpinner}></div>
              <p>加载中...</p>
            </div>
          )}
          <img 
            src={photo.cover} 
            alt={photo.title || '照片'} 
            className={`${styles.photoImg} ${isZoomed ? styles.zoomed : ''}`}
            onLoad={() => setImageLoaded(true)}
            onClick={() => setIsZoomed(!isZoomed)}
            style={{ display: imageLoaded ? 'block' : 'none' }}
          />
        </div>
        
        
        {isZoomed && (
          <div 
            className={styles.zoomOverlay}
            onClick={() => setIsZoomed(false)}
          >
            <img 
              src={photo.cover} 
              alt={photo.title || '照片'} 
              className={styles.zoomImg}
              onClick={(e) => e.stopPropagation()}
            />
            <button 
              className={styles.closeBtn}
              onClick={() => setIsZoomed(false)}
            >
              ✕
            </button>
          </div>
        )}

        
        {photo.desc && (
          <div className={styles.desc}>
            <p>{photo.desc}</p>
          </div>
        )}
      </div>
    </div>
  );
}
