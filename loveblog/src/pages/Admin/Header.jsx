import { Button } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../../utils/auth';

export default function HeaderIndex() {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/Admin/Login');
  };

  return (
    <div style={{ 
      width: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      padding: '0 16px' 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '16px', fontWeight: 500 }}>后台首页</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <UserOutlined style={{ color: '#ED4192' }} />
          <span>admin</span>
        </span>
      </div>
      <Button 
        type="primary" 
        icon={<LogoutOutlined />} 
        onClick={handleLogout}
        style={{ borderRadius: '20px' }}
      >
        退出登录
      </Button>
    </div>
  );
}