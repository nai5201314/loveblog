import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './css/Plan.module.css';
import { useGlobalSpin } from '../../stores/spinStore';
import api from '../../utils/api';
import { formatDate, formatDateTimeWithSeconds } from '../../utils/dateFormat';

export default function PlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setSpinning } = useGlobalSpin();
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlanDetail = async () => {
      setSpinning(true);
      try {
        const response = await api.getPlanById(id);
        if (response.success) {
          setPlan(response.data);
          setError('');
        } else {
          setError(response.message || '获取计划详情失败，请稍后重试');
        }
      } catch (error) {
        console.error('获取计划详情出错:', error);
        if (error.message.includes('404')) {
          setError('该计划不存在或已被删除');
        } else {
          setError(error.message || '网络异常，无法获取计划详情');
        }
      } finally {
        setSpinning(false);
      }
    };
    if (id) {
      fetchPlanDetail();
    }
  }, [id, setSpinning]);
  const handleBack = () => {
    navigate('/plan');
  };

  if (error) {
    return (
      <div className={styles.envelopeContainer} style={{ color: '#fff', textAlign: 'center', padding: '40px 0' }}>
        <p>{error}</p>
        <button 
          className={`${styles.tabBtn} ${styles.activeTab}`} 
          onClick={handleBack}
          style={{ marginTop: '20px' }}
        >
          返回计划列表
        </button>
      </div>
    );
  }
  if (!plan) {
    return (
        <>
        <p>正在加载计划详情...</p>
        </>
    );
  }
  return (
       <div style={{ 
      color: '#fff',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '30px' }}>
        <h1 className={styles.planTitle} style={{ margin: 0 }}>计划详情</h1>
        <button 
          className={`${styles.tabBtn} ${styles.activeTab}`} 
          onClick={handleBack}
        >
          返回列表
        </button>
      </div>
      <div style={{ 
        width: '100%', 
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(8px)',
        border: `2px solid ${plan.status === 'finished' ? '#4CAF50' : '#FF9800'}`,
        borderRadius: '15px',
        padding: '25px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
      }}>
        <div style={{ 
          display: 'inline-block',
          padding: '6px 12px',
          borderRadius: '20px',
          background: plan.status === 'finished' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 152, 0, 0.2)',
          color: plan.status === 'finished' ? '#4CAF50' : '#FF9800',
          fontSize: '14px',
          fontWeight: 'bold',
          marginBottom: '20px'
        }}>
          {plan.status === 'finished' ? '已完成' : '未完成'}
        </div>
        <h2 style={{ 
          fontSize: '28px', 
          margin: '0 0 20px 0', 
          color: '#fff',
          borderBottom: '1px solid rgba(255,255,255,0.2)',
          paddingBottom: '10px'
        }}>
          {plan.title || '未命名计划'}
        </h2>
        <div style={{ lineHeight: '1.8', fontSize: '16px' }}>
          {plan.description && (
            <div style={{ marginBottom: '15px' }}>
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>计划描述：</span>
              <span style={{ color: '#fff' }}>{plan.description}</span>
            </div>
          )}

          <div style={{ marginBottom: '10px' }}>
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>创建时间：</span>
            <span style={{ color: '#fff' }}>
              {plan.created_at ? formatDateTimeWithSeconds(plan.created_at) : formatDate(plan.create_date) || '未知'}
            </span>
          </div>

          {plan.status === 'unfinished' ? (
            plan.deadline && (
              <div style={{ marginBottom: '10px', color: '#FF9800' }}>
                <span style={{ color: 'rgba(255,255,255,0.8)' }}>截止时间：</span>
                {formatDate(plan.deadline)}
              </div>
            )
          ) : (
            plan.finish_date && (
              <div style={{ marginBottom: '10px', color: '#4CAF50' }}>
                <span style={{ color: 'rgba(255,255,255,0.8)' }}>完成时间：</span>
                {formatDate(plan.finish_date)}
              </div>
            )
          )}

          {plan.remark && (
            <div style={{ 
              marginTop: '20px',
              padding: '15px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <span style={{ color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: '8px' }}>备注：</span>
              <span style={{ color: '#fff', whiteSpace: 'pre-line' }}>{plan.remark}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}