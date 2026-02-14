import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGlobalSpin } from '../../stores/spinStore';
import styles from './css/DiaryDetail.module.css';
import api from '../../utils/api';
import { formatDate, formatDateTimeWithSeconds } from '../../utils/dateFormat';

export default function DiaryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setSpinning } = useGlobalSpin();

  const [diary, setDiary] = useState(null);
  const [authorName, setAuthorName] = useState('');
  const [authorQQ, setAuthorQQ] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setSpinning(true);
      try {
        const [diaryRes, settingRes] = await Promise.all([
          api.getDiaryById(id),
          api.getSettings(),
        ]);

        if (diaryRes.success && settingRes.success) {
          const diaryData = diaryRes.data;
          const setting = settingRes.data;

          // ⭐ 根据 male / female 映射
          if (diaryData.author === 'male') {
            setAuthorName(setting.male_name);
            setAuthorQQ(setting.male_qq);
          } else {
            setAuthorName(setting.female_name);
            setAuthorQQ(setting.female_qq);
          }

          setDiary(diaryData);
        } else {
          setDiary(null);
        }
      } catch (err) {
        console.error('获取数据失败', err);
        setDiary(null);
      } finally {
        setSpinning(false);
      }
    };

    fetchData();
  }, [id, setSpinning]);

  if (!diary) {
    return (
      <div className={styles.notFound}>
        <button onClick={() => navigate('/diary')} className={styles.backBtn}>
          返回日记列表
        </button>
        <h2>日记不存在</h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button onClick={() => navigate('/diary')} className={styles.backBtn}>
        ← 返回日记列表
      </button>

      <div className={styles.letterCard}>
        <div className={styles.header}>

          
          <img
            src={`https://q1.qlogo.cn/g?b=qq&nk=${authorQQ}&s=640`}
            alt={authorName}
            className={styles.coverImg}
          />

          
          <p
            className={
              diary.author === 'male'
                ? styles.authorMale
                : styles.authorFemale
            }
          >
           作者：{authorName}
          </p>

          <h1 className={styles.title}>{diary.title}</h1>

          <p className={styles.date}>
            {diary.created_at
              ? formatDateTimeWithSeconds(diary.created_at)
              : formatDate(diary.date)}
          </p>
        </div>

        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: diary.content }}
        />
      </div>
    </div>
  );
}
