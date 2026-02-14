import { Layout } from 'antd';
import IndexHeader from './Header';
import IndexFooter from './Footer';
import React from 'react';
import styles from './Layout.module.css';
import CrossFadeBg from '../CrossFadeBg/CrossFadeBg.jsx';
import { Outlet } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

export default function DefaultLayout() {
  return (
    <CrossFadeBg>
      <Layout className={styles.layout}>
        {}
        <Header 
          style={{ 
            background: 'transparent', 
            padding: 0, 
            margin: 0, 
            border: 'none',
            height: 'auto',
            lineHeight: 'normal'
          }}
        >
          <IndexHeader />
        </Header>
        {}
        <Content className={styles.content}>
          <Outlet /> 
        </Content>
        <Footer className={styles.footer}>
          <IndexFooter />
        </Footer>
      </Layout>
    </CrossFadeBg>
  );
}