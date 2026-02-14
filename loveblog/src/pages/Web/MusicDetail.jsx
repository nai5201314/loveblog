import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './css/Diary.module.css';
import { useGlobalSpin } from '../../stores/spinStore';
import api from '../../utils/api';
import { formatDate, formatDateTimeWithSeconds } from '../../utils/dateFormat';
import { Tooltip, Space } from 'antd';

export default function MusicDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setSpinning } = useGlobalSpin();
  const [music, setMusic] = useState(null);
  const [error, setError] = useState('');
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchMusicDetail = async () => {
      setSpinning(true);
      try {
        const response = await api.getMusicById(id);
        if (response.success) {
          setMusic(response.data);
          setError('');
        } else {
          setError(response.message || '获取音乐详情失败');
        }
      } catch (err) {
        setError(err.message || '网络异常');
      } finally {
        setSpinning(false);
      }
    };
    id && fetchMusicDetail();
  }, [id, setSpinning]);
  const togglePlay = () => {
    if (!music?.url) {
      return alert('暂无播放链接');
    }
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.error('播放失败:', err);
        alert('浏览器限制自动播放，请手动点击播放');
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleBack = () => navigate('/music');

  if (error) return (
    <div className={styles.container} style={{ color: '#fff', textAlign: 'center', padding: '40px 0' }}>
      <p>{error}</p>
      <button className={styles.pageBtn} onClick={handleBack} style={{ marginTop: '20px' }}>返回列表</button>
    </div>
  );
  if (!music) return (
    <div className={styles.container} style={{ color: '#fff', textAlign: 'center', padding: '40px 0' }}>
      <p>加载中...</p>
    </div>
  );

  return (
    <div className={styles.container} style={{ color: '#fff', maxWidth: '800px' }}>
      

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '30px' }}>
        <h1 className={styles.title} style={{ margin: 0 }}>音乐详情</h1>
        <button className={styles.pageBtn} onClick={handleBack}>返回列表</button>
      </div>

      

      <div style={{ 
        width: '100%', 
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(8px)',
        border: '2px solid rgba(255,255,255,0.8)',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
      }}>
        

        <div style={{ 
          width: '100%', 
          maxWidth: '400px', 
          height: '300px', 
          margin: '0 auto 20px',
          borderRadius: '10px',
          overflow: 'hidden',
          border: '2px solid rgba(255,255,255,0.5)'
        }}>
          <img 
            src={music.cover || 'https://via.placeholder.com/400x300?text=暂无封面'} 
            alt={music.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '24px', margin: '0 0 10px', color: '#fff' }}>{music.title}</h2>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', margin: '0 0 5px' }}>歌手：{music.singer}</p>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', margin: '0 0 5px' }}>时长：{music.duration}</p>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', margin: '0 0 5px' }}>日期：{formatDate(music.date)}</p>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', margin: '0 0 20px' }}>录入者：{music.author}</p>

          
          {music.url ? (
            <div style={{ 
              width: '100%', 
              maxWidth: '500px', 
              margin: '0 auto',
              padding: '10px 15px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              
              <audio 
                ref={audioRef} 
                src={music.url} 
                preload="metadata"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                style={{ display: 'none' }}
              />
              
              
              <Space align="center" style={{ width: '100%', justifyContent: 'center' }}>
                <Tooltip title={isPlaying ? "暂停" : "播放"}>
                  <button 
                    className="btn btn-light btn-sm"
                    onClick={togglePlay}
                    style={{ borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <i className={`bi ${isPlaying ? 'bi-pause' : 'bi-play-fill'}`} style={{ fontSize: '18px' }}></i>
                  </button>
                </Tooltip>
                
                
                <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '3px', margin: '0 15px' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: '0%', 
                      background: '#fff',
                      borderRadius: '3px'
                    }}
                  />
                </div>
                
                
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>{music.duration}</span>
              </Space>
            </div>
          ) : (
            <button className={styles.pageBtn} disabled style={{ padding: '8px 20px', fontSize: '16px' }}>暂无播放链接</button>
          )}
        </div>

        
        <div style={{ 
          textAlign: 'center',
          fontSize: '12px', 
          color: 'rgba(255,255,255,0.6)',
          marginBottom: '10px'
        }}>
          创建时间：{formatDateTimeWithSeconds(music.created_at)}
        </div>
      </div>
    </div>
  );
}