import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Tag,
  Popconfirm,
  message,
  Card,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  List,
  Grid,
} from 'antd';
import api from '../../utils/api';
import dayjs from 'dayjs';
import { render } from 'less';

const { useBreakpoint } = Grid;

export default function TimeSetting() {
  const [times, setTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const fetchTimes = async () => {
    try {
      setLoading(true);
      const res = await api.getTimes('all');
      if (res.success) {
        setTimes(res.data || []);
      }
    } catch (e) {
      message.error('获取时光记录失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimes();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.deleteTime(id);
      message.success('删除成功');
      fetchTimes();
    } catch (e) {
      message.error(e.message || '删除失败');
    }
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      title: record.title,
      date: record.date ? dayjs(record.date) : null,
      tag: record.tag,
      desc: record.desc,
      location: record.location,
      emotion: record.emotion,
    });
    setModalOpen(true);
  };

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '日期',
      dataIndex: 'date',
      render:(date) => (date ? dayjs(date).format('YYYY-MM-DD') :'-')

    },
    {
      title: '标签',
      dataIndex: 'tag',
      render: (tag) => tag && <Tag>{tag}</Tag>,
    },
    {
      title: '地点',
      dataIndex: 'location',
    },
    {
      title: '操作',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => openEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除这条记录吗？"
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
      title="猫狗时光管理"
      extra={
        <Button
          type="primary"
          onClick={() => {
            setEditing(null);
            form.resetFields();
            setModalOpen(true);
          }}
        >
          新建时光
        </Button>
      }
    >
      {!isMobile && (
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={times}
          pagination={false}
        />
      )}
      {isMobile && (
        <List
          loading={loading}
          dataSource={times}
          renderItem={(item) => (
            <Card
              style={{ marginBottom: 12 }}
              actions={[
                <Button type="link" onClick={() => openEdit(item)}>
                  编辑
                </Button>,
                <Popconfirm
                  title="确认删除这条记录吗？"
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
                    <div>日期：{item.date ? dayjs(item.date).format('YYYY-MM-DD') : '-'}</div>
                    <div>
                      标签：
                      {item.tag ? <Tag style={{ marginLeft: 6 }}>{item.tag}</Tag> : '-'}
                    </div>
                    <div>地点：{item.location || '-'}</div>
                    {item.emotion && <div>心情：{item.emotion}</div>}
                  </>
                }
              />
            </Card>
          )}
        />
      )}

      <Modal
        title={editing ? '编辑时光' : '新建时光'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        destroyOnHidden
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={async (values) => {
            const payload = {
              title: values.title,
              date: values.date.format('YYYY-MM-DD'),
              tag: values.tag,
              desc: values.desc,
              location: values.location,
              emotion: values.emotion,
            };
            try {
              if (editing) {
                await api.updateTime(editing.id, payload);
                message.success('更新成功');
              } else {
                await api.createTime(payload);
                message.success('创建成功');
              }
              setModalOpen(false);
              fetchTimes();
            } catch (e) {
              message.error(e.message || '保存失败');
            }
          }}
        >
          <Form.Item label="标题" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="日期" name="date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="标签" name="tag">
            <Select
              allowClear
              options={[
                { label: '初见', value: '初见' },
                { label: '告白', value: '告白' },
                { label: '纪念日', value: '纪念日' },
                { label: '旅行', value: '旅行' },
                { label: '日常', value: '日常' },
              ]}
            />
          </Form.Item>

          <Form.Item label="地点" name="location">
            <Input />
          </Form.Item>

          <Form.Item label="心情" name="emotion">
            <Input />
          </Form.Item>

          <Form.Item label="描述" name="desc">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
