import {
  Button,
  Pagination,
  Popconfirm,
  message,
  Empty,
  Card,
  Table,
  List,
  Grid,
} from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDateTimeWithSeconds } from '../../utils/dateFormat';
import api from '../../utils/api';
import React from 'react';
const { useBreakpoint } = Grid;
const PAGE_SIZE = 8;
export default function DiarySetting() {
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [maleName, setMaleName] = useState('');
  const [femaleName, setFemaleName] = useState('');
  const [diaryList, setDiaryList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.getSettings();
        if (res.success) {
          setMaleName(res.data.male_name || '');
          setFemaleName(res.data.female_name || '');
        }
      } catch (e) {
        message.error('获取设置失败');
      }
    };
    fetchSettings();
  }, []);
  const fetchDiaries = async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.getDiaries(page, PAGE_SIZE);
      if (res.success) {
        setDiaryList(res.data.list || []);
        setTotal(res.data.pagination?.total || 0);
      }
    } catch (e) {
      message.error('获取日记列表失败');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDiaries(currentPage);
  }, [currentPage]);

  const handleEdit = (id) => {
    navigate(`/Admin/editor?id=${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteDiary(id);
      message.success('删除成功');
      fetchDiaries(currentPage);
    } catch (e) {
      message.error(e.message || '删除失败');
    }
  };
  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      ellipsis: true,
    },
    {
      title: '作者',
      dataIndex: 'author',
      render: (author) =>
        author === 'male' ? maleName : author === 'female' ? femaleName : '',
    },
    {
      title: '日期',
      render: (_, record) =>
        record.created_at
          ? formatDateTimeWithSeconds(record.created_at)
          : record.date
          ? formatDateTimeWithSeconds(record.date)
          : '',
    },
    {
      title: '操作',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record.id)}>
            修改
          </Button>
          <Popconfirm
            title="确认删除这篇日记吗？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Card
      title="猫狗日记"
      extra={
        <Button type="primary" onClick={() => navigate('/Admin/editor')}>
          创建日记
        </Button>
      }
    >
      {!isMobile && (
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={diaryList}
          pagination={false}
          locale={{ emptyText: <Empty description="暂时还没有日记哦~" /> }}
        />
      )}
      {isMobile && (
        <List
          loading={loading}
          dataSource={diaryList}
          locale={{ emptyText: <Empty description="暂时还没有日记哦~" /> }}
          renderItem={(item) => (
            <Card
              style={{ marginBottom: 12 }}
              actions={[
                <Button type="link" onClick={() => handleEdit(item.id)}>
                  修改
                </Button>,
                <Popconfirm
                  title="确认删除这篇日记吗？"
                  onConfirm={() => handleDelete(item.id)}
                >
                  <Button type="link" danger>
                    删除
                  </Button>
                </Popconfirm>,
              ]}
            >
              <Card.Meta
                title={item.title}
                description={
                  <>
                    <div>
                      作者：
                      {item.author === 'male'
                        ? maleName
                        : item.author === 'female'
                        ? femaleName
                        : ''}
                    </div>
                    <div>
                      日期：
                      {item.created_at
                        ? formatDateTimeWithSeconds(item.created_at)
                        : item.date
                        ? formatDateTimeWithSeconds(item.date)
                        : ''}
                    </div>
                  </>
                }
              />
            </Card>
          )}
        />
      )}
      {total > 0 && (
        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Pagination
            current={currentPage}
            pageSize={PAGE_SIZE}
            total={total}
            onChange={setCurrentPage}
            showSizeChanger={false}
          />
        </div>
      )}
    </Card>
  );
}
