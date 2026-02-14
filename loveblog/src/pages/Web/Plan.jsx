import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import styles from './css/Plan.module.css';
import { useGlobalSpin } from '../../stores/spinStore';
import api from '../../utils/api';
import { formatDate, formatDateTimeWithSeconds } from '../../utils/dateFormat';

export default function Plan() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSpinning } = useGlobalSpin();
    const [maleName, setMaleName] = useState('');
  const [femaleName, setFemaleName] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [planList, setPlanList] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);

  const isDetailPage = location.pathname !== '/plan' && location.pathname.includes('/plan/');
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
    const fetchPlans = async () => {
      setSpinning(true);
      try {
        const response = await api.getPlans('all');
        if (response.success) {
          setPlanList(response.data);
        }
      } catch (error) {
        console.error('获取计划列表失败:', error);
      } finally {
        setSpinning(false);
      }
    };
    fetchPlans();
  }, [setSpinning]);

  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredPlans(planList);
    } else if (activeTab === 'unfinished') {
      setFilteredPlans(planList.filter(p => p.status === 'unfinished'));
    } else if (activeTab === 'finished') {
      setFilteredPlans(planList.filter(p => p.status === 'finished'));
    }
  }, [activeTab, planList]);

  const handlePlanClick = (id) => {
    const plan = planList.find(p => p.id === id);
    if (plan && plan.status !== 'finished') return;

    setSpinning(true);
    setTimeout(() => {
      navigate(`/plan/${id}`);
      setSpinning(false);
    }, 300);
  };

  return (
    <div className={styles.envelopeContainer}>
      <Outlet />

      {!isDetailPage && (
        <>
        <div className={styles.planbox}>
           
 <h1 className={styles.planTitle}> 猫狗计划</h1>
        </div>
         

          <div className={styles.tabContainer}>
            <button className={`${styles.tabBtn} ${activeTab === 'all' ? styles.activeTab : ''}`} onClick={() => setActiveTab('all')}>全部计划</button>
            <button className={`${styles.tabBtn} ${activeTab === 'unfinished' ? styles.activeTab : ''}`} onClick={() => setActiveTab('unfinished')}>未完成</button>
            <button className={`${styles.tabBtn} ${activeTab === 'finished' ? styles.activeTab : ''}`} onClick={() => setActiveTab('finished')}>已完成</button>
          </div>

          {filteredPlans.length === 0 ? (
            <div className={styles.emptyTip}>暂无相关计划～</div>
          ) : (
            <div className={styles.planList}>
              {filteredPlans.map(plan => (
                <div
                  key={plan.id}
                  className={`${styles.planItem} ${plan.status === 'finished' ? styles.finishedItem : styles.unfinishedItem}`}
                  onClick={() => handlePlanClick(plan.id)}
                  style={{ cursor: plan.status === 'finished' ? 'pointer' : 'default' }}
                >
                  <div className={styles.planContent}>
                    <div>{plan.title}</div>
                    <div className={styles.planMeta}>
                      <span>创建：{plan.created_at ? formatDateTimeWithSeconds(plan.created_at) : formatDate(plan.create_date)}</span>
                      {plan.status === 'unfinished' ? (
                        plan.deadline && <span>截止：{formatDate(plan.deadline)}</span>
                      ) : (
                        plan.finish_date && <span>完成：{formatDate(plan.finish_date)}</span>
                      )}
                    </div>
                  </div>
                  <div className={styles.statusTag}>
                    {plan.status === 'unfinished' ? '未完成' : '已完成 '}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}