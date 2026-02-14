import { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col, Typography, Space, Tag } from 'antd';
import {
  BookOutlined,
  PictureOutlined,
  ClockCircleOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons';
import api from '../../utils/api';
import { Pie, Column } from '@ant-design/plots';
const { Title, Paragraph } = Typography;

export default function AdminIndex() {
  const [stats, setStats] = useState({
    diary: { total: 0, today: 0, week: 0, month: 0 },
    photo: { total: 0, today: 0, week: 0, month: 0 },
    time: { total: 0, today: 0, week: 0, month: 0 },
    plan: { total: 0, finished: 0, inProgress: 0, pending: 0, unfinished: 0, completionRate: 0 },
    dynamic: { total: 0 },
    music: { total: 0 },
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const dashboardData = await api.getDashboardStats();
        setStats({
          diary: dashboardData?.data?.diary || { total: 0, today: 0, week: 0, month: 0 },
          photo: dashboardData?.data?.photo || { total: 0, today: 0, week: 0, month: 0 },
          time: dashboardData?.data?.time || { total: 0, today: 0, week: 0, month: 0 },
          plan: {
            total: 0,
            finished: 0,
            inProgress: 0,
            pending: 0,
            unfinished: 0,
            completionRate: 0,
            ...dashboardData?.data?.plan
          },
          dynamic: dashboardData?.data?.dynamic || { total: 0 },
          music: dashboardData?.data?.music || { total: 0 },
        });
      } catch (e) {
        console.error('获取仪表盘统计数据失败:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const cardStyle = {
    borderRadius: 12,
    boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
    border: '1px solid #f0f0f0',
    background: '#fff',
  };
  
  const statCardStyle = {
    ...cardStyle,
    height: 190,
    transition: 'all .2s',
  };
  
  const iconBox = (color) => ({
    width: 40,
    height: 40,
    borderRadius: 12,
    background: `${color}15`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  const planPieData = [
    { type: '已完成', value: Number(stats.plan.finished) },
    { type: '未完成', value: Number(stats.plan.unfinished) },
  ].filter(item => item.value > 0);

  const planPieConfig = {
    data: planPieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    innerRadius: 0.6,
    label: {
      position: 'inside',
      offset: '-50%',
      content: (datum) => datum.value, 
      style: { textAlign: 'center', fontSize: 14, fill: '#fff' },
    },
    statistic: {
      title: { content: '计划总数' },
      content: () => stats.plan.total,
    },
    color: ['#52c41a', '#f5222d'],
  };

  const contentColumnData = [
    { type: '日记', value: stats.diary.total },
    { type: '照片', value: stats.photo.total },
    { type: '时光', value: stats.time.total },
    { type: '音乐', value: stats.music.total },
  ];
  const columnConfig = {
    data: contentColumnData,
    xField: 'type',
    yField: 'value',
    label: { 
      position: 'top',
      content: (datum) => datum.value,
      style: { fill: '#333', fontSize: 12 } 
    },
  };

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          marginBottom: 24,
          padding: 24,
          borderRadius: 12,
          background: '#fff',
          boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          欢迎来到后台管理中心
        </Title>
        <Paragraph type="secondary" style={{ marginTop: 8 }}>
          这里可以管理猫狗的日记、照片、时光、音乐、留言和计划，也可以配置基础信息。
          开发不易，若觉得本项目对你有所帮助，记得给个支持！联系qq：11814064
        </Paragraph>
      </div>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card loading={loading} variant="outlined" style={statCardStyle} hoverable>
            <Space orientation="vertical" size={14}>
              <Space align="center">
                <div style={iconBox('#1890ff')}>
                  <BookOutlined style={{ color: '#1890ff', fontSize: 20 }} />
                </div>
                <span style={{ fontSize: 16, fontWeight: 600 }}>猫狗日记</span>
              </Space>
              <Statistic 
                value={stats.diary.total} 
                styles={{ content: { fontSize: 30, color: '#1890ff' } }} 
              />
              <Space wrap size={[4, 4]}>
                <Tag color="blue">今日 {stats.diary.today}</Tag>
                <Tag color="cyan">本周 {stats.diary.week}</Tag>
                <Tag color="geekblue">本月 {stats.diary.month}</Tag>
              </Space>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card loading={loading} variant="outlined" style={statCardStyle} hoverable>
            <Space orientation="vertical" size={14}>
              <Space align="center">
                <div style={iconBox('#f5222d')}>
                  <PictureOutlined style={{ color: '#f5222d', fontSize: 20 }} />
                </div>
                <span style={{ fontSize: 16, fontWeight: 600 }}>猫狗照片</span>
              </Space>
              <Statistic 
                value={stats.photo.total} 
                styles={{ content: { fontSize: 30, color: '#f5222d' } }} 
              />
              <Space wrap size={[4, 4]}>
                <Tag color="red">今日 {stats.photo.today}</Tag>
                <Tag color="pink">本周 {stats.photo.week}</Tag>
                <Tag color="magenta">本月 {stats.photo.month}</Tag>
              </Space>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card loading={loading} variant="outlined" style={statCardStyle} hoverable>
            <Space orientation="vertical" size={14}>
              <Space align="center">
                <div style={iconBox('#faad14')}>
                  <ClockCircleOutlined style={{ color: '#faad14', fontSize: 20 }} />
                </div>
                <span style={{ fontSize: 16, fontWeight: 600 }}>猫狗时光</span>
              </Space>
              <Statistic 
                value={stats.time.total} 
                styles={{ content: { fontSize: 30, color: '#faad14' } }} 
              />
              <Space wrap size={[4, 4]}>
                <Tag color="gold">今日 {stats.time.today}</Tag>
                <Tag color="orange">本周 {stats.time.week}</Tag>
                <Tag color="volcano">本月 {stats.time.month}</Tag>
              </Space>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card loading={loading} variant="outlined" style={statCardStyle} hoverable>
            <Space orientation="vertical" size={14}>
              <Space align="center">
                <div style={iconBox('#52c41a')}>
                  <CustomerServiceOutlined style={{ color: '#52c41a', fontSize: 20 }} />
                </div>
                <span style={{ fontSize: 16, fontWeight: 600 }}>猫狗音乐</span>
              </Space>
              <Statistic 
                value={stats.music.total} 
                styles={{ content: { fontSize: 30, color: '#52c41a' } }} 
              />
              <Tag color="green">总收藏 {stats.music.total}</Tag>
            </Space>
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} md={10}>
          <Card
            title="计划完成情况"
            variant="outlined"
            style={{ ...cardStyle, height: 320 }}
          >
            <Pie {...planPieConfig} height={220} />
            <div style={{ textAlign: 'center', marginBottom: 20, paddingBottom: 20 }}>
              完成率: {stats.plan.completionRate ?? 0}%
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={14}>
          <Card title="内容数量对比" variant="outlined" style={{ ...cardStyle, height: 320 }}>
            <Column {...columnConfig} height={220} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}