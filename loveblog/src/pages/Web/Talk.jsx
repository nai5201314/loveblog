import React, { useState, useEffect } from 'react';
import styles from './css/Talk.module.css';
import { useGlobalSpin } from '../../stores/spinStore';
import api from '../../utils/api';
export default function Talk() {
  const { setSpinning } = useGlobalSpin();
   const [maleName, setMaleName] = useState('');
 const [femaleName, setFemaleName] = useState('');
  const [qq, setQq] = useState('');
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('');
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
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  useEffect(() => {
    if (qq && /^\d+$/.test(qq)) {
      setAvatar(`https://q1.qlogo.cn/g?b=qq&nk=${qq}&s=640`);
    } else {
      setAvatar('');
    }
  }, [qq]);
  useEffect(() => {
    const fetchTalks = async () => {
      setSpinning(true);
      try {
        const response = await api.getTalks();
        if (response.success) {
          setMessageList(response.data);
        }
      } catch (error) {
        console.error('获取留言列表失败:', error);
      } finally {
        setSpinning(false);
      }
    };
    fetchTalks();
  }, [setSpinning]);
  const handleSubmit = async () => {
    if (!message.trim()) {
      alert('请输入留言内容');
      return;
    }
    if (!qq.trim()) {
      alert('请输入QQ号码');
      return;
    }
    if (!nickname.trim()) {
      alert('请输入昵称');
      return;
    }

    setSpinning(true);
    try {
      const response = await api.createTalk({
        qq: qq.trim(),
        nickname: nickname.trim(),
        avatar: avatar,
        content: message.trim()
      });
      if (response.success) {
        const talksResponse = await api.getTalks();
        if (talksResponse.success) {
          setMessageList(talksResponse.data);
        }
        setMessage('');
        setQq('');
        setNickname('');
        setAvatar('');
      }
    } catch (error) {
      console.error('提交留言失败:', error);
      alert('提交留言失败，请重试');
    } finally {
      setSpinning(false);
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('确定要删除这条留言吗？')) return;
    
    setSpinning(true);
    try {
      const response = await api.deleteTalk(id);
      if (response.success) {
        setMessageList(messageList.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('删除留言失败:', error);
      alert('删除失败，请重试');
    } finally {
      setSpinning(false);
    }
  };

  return (
    <div className={styles.talkContainer}>
      <h1 className={styles.talkTitle}> 猫狗留言板</h1>
      <div className={styles.inputArea}>
        <div className={styles.userInfo}>
          <div className={styles.inputGroup}>
            <label>QQ号码：</label>
            <input
              type="text"
              className={styles.qqInput}
              placeholder="请输入QQ号码"
              value={qq}
              onChange={(e) => setQq(e.target.value)}
            />
            {avatar && (
              <img src={avatar} alt="头像" className={styles.avatarPreview} />
            )}
          </div>
          <div className={styles.inputGroup}>
            <label>昵称：</label>
            <input
              type="text"
              className={styles.nicknameInput}
              placeholder="请输入昵称"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
        </div>
        <textarea
          className={styles.messageInput}
          placeholder="写下想对小猫小狗说的话吧～"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={!message.trim() || !qq.trim() || !nickname.trim()}
        >
          提交留言
        </button>
      </div>
      <div className={styles.messageList}>
        {messageList.length === 0 ? (
          <div className={styles.emptyTip}>暂无留言，快来写下第一条吧～</div>
        ) : (
          messageList.map(item => (
            <div
              key={item.id}
              className={styles.messageItem}
            >
              <div className={styles.messageHeader}>
                <div className={styles.userInfo}>
                  {item.avatar && (
                    <img src={item.avatar} alt="头像" className={styles.userAvatar} />
                  )}
                  <div>
                    <span className={styles.userName}>{item.nickname || '匿名'}</span>
                    {item.qq && (
                      <span className={styles.userQq}>QQ: {item.qq}</span>
                    )}
                  </div>
                </div>
                <div className={styles.messageMeta}>
                  {item.city && (
                    <span className={styles.messageCity}> {item.city}</span>
                  )}
                  <span className={styles.messageTime}>
                    {new Date(item.created_at).toLocaleString('zh-CN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
              <div className={styles.messageContent}>{item.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}