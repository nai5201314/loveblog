import { Button, Divider } from 'antd';
import React from 'react';
import styles from './css/Index.module.css'; 
import { useNavigate } from 'react-router-dom';
import { useGlobalSpin } from '../../stores/spinStore';
import {useState ,useEffect} from 'react';
import api from '../../utils/api';
import { htmlToSummary } from '../../utils/htmlsummary.js';
import { formatDateTimeWithSeconds } from '../../utils/dateFormat';
export default function IndexContent() {
    const nav = useNavigate();
    const { setSpinning } = useGlobalSpin();
const [maleName, setMaleName] = useState('');
const [femaleName, setFemaleName] = useState('');

    const[togetherDays,setTogether] = useState(0);
    const[recentDynamicList, setRecentDynamicList] = useState([]);
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
      const fetchTogetherDays = async () => {
        try {
          const response = await api.getTogetherDays();
          if (response.success) {
            setTogether(response.data.togetherDays);
          }
        } catch (error) {
          console.error('获取在一起天数失败:', error);
          const startDate = new Date('2025-07-01');
          const today = new Date();
          const diffTime = today - startDate;
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 *24));
          setTogether(diffDays);
        }
      };
      fetchTogetherDays();
    }, []);
    useEffect(() => {
      const fetchHomeData = async () => {
        setSpinning(true);
        try {
          const response = await api.getHomeData();
          if (response.success && response.data.recentDynamicList) {
            const formattedList = response.data.recentDynamicList.map(item => ({
              id: item.id,
              type: item.type,
              title: item.title,
              content: item.content || '',
              time: item.time || item.date,
              author: item.author || 'male',
              cover: item.cover || '/cover/1.png',
              path: item.path || `/${item.type.toLowerCase()}/${item.id}`
            }));
            setRecentDynamicList(formattedList);
          }
        } catch (error) {
          console.error('获取首页数据失败:', error);
          setRecentDynamicList([
            {
              id: 1,
              type: '日记',
              title: '小猫小狗视频',
              content: '和小猫小狗视频',
              time: '2026-01-19',
              cover: 'https://s41.ax1x.com/2026/01/21/pZcpMgP.jpg',
              path: '/diary/1'
            }
          ]);
        } finally {
          setSpinning(false);
        }
      };
      fetchHomeData();
    }, [setSpinning]);
    const go = (path) => {
        setSpinning(true);
        setTimeout(() => nav(path)); 
    };
    const binList = [
        {text :'猫狗日记', icon:'http://image.naiblog.cn/icons/jinmao.png',path:'/diary'},
        {text :'猫狗时光', icon:'http://image.naiblog.cn/icons/bianmu.png',path:'/time'},
        {text :'猫狗照片', icon:'http://image.naiblog.cn/icons/sanhua.png',path:'/photo'},
        {text :'猫狗音乐', icon:'http://image.naiblog.cn/icons/keji.png',path:'/music'},
        {text :'猫狗留言', icon:'http://image.naiblog.cn/icons/tianyuan.png',path:'/talk'},
        {text :'猫狗计划', icon:'http://image.naiblog.cn/icons/jumao.png',path:'/plan'}, 
    ];

  return (<>
    <div className={styles.safeCard}>
        <div className={styles.headerGroup}>
  <div className={styles.userItem}>
    <img className={styles.avatar} src='https://q1.qlogo.cn/g?b=qq&nk=11814064&s=640' />
    <span className={styles.userName}>{maleName}</span>
  </div>
  <img className={styles.heartIcon} src='http://image.naiblog.cn/icons/loving.png' alt='love' />
  <div className={styles.userItem}>
    <img className={styles.avatar} src='https://q1.qlogo.cn/g?b=qq&nk=1474904466&s=640' />
    <span className={styles.userName}>{femaleName}</span>
  </div>
</div>

        <div className={styles.btnGroup}>
            {binList.map((item)=>(
                <Button 
                    key={item.text}
                    onClick={()=>go(item.path)}
                    icon={<img src={item.icon} 
                        alt={item.text}
                        className={styles.icon} />}
                    className={styles.btn}
                >
                    {item.text}
                </Button>
            ))}
        </div>
        <div className={styles.togetherDays}>
          <img src='/icons/love.png'
            alt = 'ilove'
            className={styles.lovetogether}/>
             我们已经在一起 <span className={styles.daysNum}>{togetherDays}</span> 天啦 <img src='http://image.naiblog.cn/icons/love.png'
            alt = 'ilove'
            className={styles.lovetogether}/>
            !
        </div>
        <Divider style={{ 
            margin: '16px 0 12px', 
            borderColor: 'rgba(255,255,255,0.4)',
            color: '#ff8aab',
            fontWeight: 500
        }}> 近期动态</Divider>

        <div className={styles.dynamicContainer}>
            {recentDynamicList.slice(0, 4).map(item => (
                <div 
                    key={item.id}
                    className={styles.dynamicCard}
                    onClick={() => go(item.path)}
                >

                    <div className={styles.cardHeader}>
                        <span className={`${styles.typeTag} ${styles[`tag_${item.type}`]}`}>
                            {item.type}
                        </span>
                        <img alt={item.title} src={item.cover} className={styles.cardCover} />
                    </div>
                  
                    <div className={styles.cardContent}>
                        <h3 className={styles.cardTitle}>{item.title}</h3>
                        <p className={styles.cardDesc}>
  {htmlToSummary(item.content, 50)}
</p>

                        <div className={styles.cardMeta}>
                            <span className={styles.cardAuthor}>
                                {item.author === 'male' ? ` ${maleName}` : ` ${femaleName}`}
                            </span>
                            <span className={styles.cardTime}>
                              <i className='bi bi-alarm me-0'></i>
                              {formatDateTimeWithSeconds(item.time)}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
   </>
  );
}