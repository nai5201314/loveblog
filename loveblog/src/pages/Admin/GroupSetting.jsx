import { useEffect, useState } from 'react';
import { Card, Descriptions, message } from 'antd';
import api from '../../utils/api';
import dayjs from 'dayjs';
export default function GroupSetting() {
  const [adminInfo, setAdminInfo] = useState(null);
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await api.getAdminInfo();
        if (res.success) {
          setAdminInfo(res.data);
        }
      } catch (e) {
        message.error(e.message || '获取管理员信息失败');
      }
    };

    fetchInfo();
  }, []);
  return (
    <Card title="人员管理">
      {adminInfo ? (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="管理员ID">{adminInfo.id}</Descriptions.Item>
          <Descriptions.Item label="用户名">{adminInfo.username}</Descriptions.Item>
          <Descriptions.Item label="创建时间" render={() =>
            dayjs(adminInfo.created_at).format('YYYY-MM-DD HH:mm:ss')
          }>
            {adminInfo.created_at}
            </Descriptions.Item>
            
        </Descriptions>
      ) : (
        '暂无管理员信息'
      )}
      <p style={{ marginTop: 16, color: '#999' }}>
        当前仅支持单管理员，如需多管理员/角色权限，可在后端扩展 admin 表结构。
      </p>
    </Card>
  );
}