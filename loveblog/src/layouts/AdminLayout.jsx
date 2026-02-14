import { useEffect, useState } from 'react';
import { Layout, ConfigProvider, theme, Drawer } from 'antd';
import SiderIndex from '../pages/Admin/SiderIndex';
import HeaderIndex from '../pages/Admin/Header';
import { Outlet, useNavigate } from 'react-router-dom';
import { Footer } from 'antd/es/layout/layout';
import FooterIndex from '../pages/Admin/Footer';
import { isAuthenticated } from '../utils/auth';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const LARGE_SCREEN_WIDTH = 992;
const peachTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#ED4192',
    colorBgLayout: '#FFF1F6',
    colorBgContainer: '#FFFFFF',
    borderRadius: 20,
  },
  components: {
    Menu: {
      itemSelectedBg: '#FFE4EE',
      itemSelectedColor: '#ED4192',
    },
  },
};

export default function AdminLayout() {
  const navigate = useNavigate();
  const [isLargeScreen, setIsLargeScreen] = useState(false); 
  const [drawerVisible, setDrawerVisible] = useState(false); 
  const [collapsed, setCollapsed] = useState(false); 
  
  useEffect(() => {
    const judgeScreenSize = () => {
      const currentIsLarge = window.innerWidth >= LARGE_SCREEN_WIDTH;
      setIsLargeScreen(currentIsLarge);
      if (!currentIsLarge) {
        setDrawerVisible(false);
      }
    };
    judgeScreenSize();
    const handleResize = () => judgeScreenSize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/Admin/Login');
    }
  }, [navigate]);

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  const toggleSiderCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <ConfigProvider theme={peachTheme}>
      <Layout style={{ minHeight: '100vh' }}>
        
        {isLargeScreen && (
          <Sider
            collapsible
            collapsed={collapsed}
            collapsedWidth={80} 
            theme="light"
            style={{ background: '#FFF1F6' }}
            onCollapse={toggleSiderCollapse}
          >
            <SiderIndex collapsed={collapsed} onMenuItemClick={() => {}} />
          </Sider>
        )}

        <Drawer
          placement="left"
          open={drawerVisible}
          onClose={toggleDrawer}
          widthInPx={256}
          styles={{
            wrapper: { padding: 0 },
            body: { padding: 0, background: '#FFF1F6' },
            mask: { background: 'rgba(0,0,0,0.1)' }
          }}
          mask={true}
          closable={false}
          visible={!isLargeScreen}
        >
          <SiderIndex collapsed={false} onMenuItemClick={toggleDrawer} />
        </Drawer>

        <Layout>
          <Header
            style={{
              padding: '0 16px',
              background: '#FFF1F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {!isLargeScreen && (
              drawerVisible ? (
                <MenuFoldOutlined 
                  onClick={toggleDrawer} 
                  style={{ fontSize: 18, cursor: 'pointer' }}
                />
              ) : (
                <MenuUnfoldOutlined 
                  onClick={toggleDrawer} 
                  style={{ fontSize: 18, cursor: 'pointer' }}
                />
              )
            )}
            <HeaderIndex />
          </Header>

          <Content
            style={{
              margin: '16px',
              padding: '20px',
              background: '#fff',
              maxHeight: 'calc(100vh - 160px)',
              overflow: 'auto',
            }}
          >
            <Outlet />
          </Content>

          <Footer>
            <FooterIndex />
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}