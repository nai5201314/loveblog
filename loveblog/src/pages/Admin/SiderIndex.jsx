import {
  DesktopOutlined,
  TeamOutlined,
  SettingOutlined,
  LoginOutlined,
  BarsOutlined,
  CameraOutlined,
  SendOutlined,
  ReadOutlined,
  CommentOutlined,
  CustomerServiceOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import { useState, useEffect } from 'react';
import styles from './css/SiderIndex.module.css';
import { removeToken } from '../../utils/auth';

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem('首页', '/Admin', <DesktopOutlined />),
  getItem('基本设置', '/Admin/setting', <SettingOutlined />),
  getItem('猫狗日记', '/Admin/diary', <CommentOutlined />),
  getItem('猫狗照片', '/Admin/photo', <CameraOutlined />),
  getItem('猫狗时光', '/Admin/time', <HistoryOutlined />),
  getItem('猫狗音乐', '/Admin/music', <CustomerServiceOutlined />),
  getItem('猫狗留言', '/Admin/talk', <ReadOutlined />),
  getItem('猫狗计划', '/Admin/plan', <SendOutlined />),
  getItem('人员管理', '/Admin/user', <TeamOutlined />),
  getItem('退出登录', '/Admin/Login', <LoginOutlined />),
];

export default function SiderIndex({collapsed,onMenuItemClick}) {
  const nav = useNavigate();
  const loc = useLocation();
  const [openKeys, setOpenKeys] = useState(['page']); 

  useEffect(() => {
    const currentPath = loc.pathname;
    if (['/Admin/diary', '/Admin/photo', '/Admin/time', '/Admin/music', '/Admin/talk', '/Admin/plan'].includes(currentPath)) {
      setOpenKeys(['page']);
    }
  }, [loc.pathname]);

   const handleClick = ({ key }) => {
    onMenuItemClick();

    if (key === '/Admin/Login') {
      removeToken();
      nav('/Admin/Login');
      return;
    }

   
    if (key && key.startsWith('/')) {
      nav(key);
    }
  };

  const getCurrentSelectedKey = () => {
    let path = loc.pathname;
    return path.endsWith('/') ? path.slice(0, -1) : path;
  };

  return (
    <>
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
  <div className={styles.titlebox}>
  {!collapsed && <span className={styles.title}>小奈博客后台</span>}
</div>
      <Menu
        theme="light"
        inlineCollapsed={collapsed}
        selectedKeys={[getCurrentSelectedKey()]}
        openKeys={collapsed ? [] : openKeys} 
        onOpenChange={setOpenKeys} 
        mode="inline"
        items={items}
        className={styles.Menu}
        onClick={handleClick}


      />
      </div>
    </>
  );
}