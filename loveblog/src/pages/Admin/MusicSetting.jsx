import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Popconfirm,
  message,
  Card,
  Modal,
  Form,
  Input,
  DatePicker,
  List,
  Grid,
} from 'antd';
import api from '../../utils/api';
import dayjs from 'dayjs';
const { Meta } = Card;
const { useBreakpoint } = Grid;
export default function MusicSetting() {
  const [musics, setMusics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const fetchMusics = async () => {
    try {
      setLoading(true);
      const res = await api.getMusics(1, 100);
      if (res.success) {
        setMusics(res.data.list || []);
      }
    } catch (e) {
      message.error('获取音乐列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMusics();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.deleteMusic(id);
      message.success('删除成功');
      fetchMusics();
    } catch (e) {
      message.error(e.message || '删除失败');
    }
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      title: record.title,
      singer: record.singer,
      cover: record.cover,
      url: record.url,
      duration: record.duration,
      date: record.date ? dayjs(record.date) : null,
    });
    setModalOpen(true);
  };

const columns = [
  { title: '标题', dataIndex: 'title' },
  { title: '歌手', dataIndex: 'singer' },
  {
    title: '日期',
    dataIndex: 'date',
    render: (date) => (date ? dayjs(date).format('YYYY-MM-DD') : '-'),
  },
  {
    title: '操作',
    render: (_, record) => (
      <>
        <Button type="link" onClick={() => openEdit(record)}>
          编辑
        </Button>
        <Popconfirm
          title="确认删除这首音乐吗？"
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
      title="猫狗音乐管理"
      extra={
        <Button
          type="primary"
          onClick={() => {
            setEditing(null);
            form.resetFields();
            setModalOpen(true);
          }}
        >
          新建音乐
        </Button>
      }
    >
      {!isMobile && (
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={musics}
          pagination={false}
        />
      )}
      {isMobile && (
        <List
          loading={loading}
          dataSource={musics}
          renderItem={(item) => (
            <Card
              style={{ marginBottom: 12 }}
              cover={
                item.cover ? (
                  <img
                    alt={item.title}
                    src={item.cover}
                    style={{ height: 180, objectFit: 'cover' }}
                  />
                ) : null
              }
              actions={[
                <Button type="link" onClick={() => openEdit(item)}>
                  编辑
                </Button>,
                <Popconfirm
                  title="确认删除这首音乐吗？"
                  onConfirm={() => handleDelete(item.id)}
                >
                  <Button type="link" danger>
                    删除
                  </Button>
                </Popconfirm>,
              ]}
            >
              <Meta
                title={item.title}
                description={
                  <>
                    <div>歌手：{item.singer || '-'}</div>
                    <div>日期：{item.date ? dayjs(item.date).format('YYYY-MM-DD') : '-'}
                      
                    </div>
                    <div>时长：{item.duration || '-'}</div>
                  </>
                }
              />
            </Card>
          )}
        />
      )}

      <Modal
        title={editing ? '编辑音乐' : '新建音乐'}
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
              singer: values.singer,
              cover: values.cover,
              url: values.url,
              duration: values.duration,
              date: values.date.format('YYYY-MM-DD'),
            };
            try {
              if (editing) {
                await api.updateMusic(editing.id, payload);
                message.success('更新成功');
              } else {
                await api.createMusic(payload);
                message.success('创建成功');
              }
              setModalOpen(false);
              fetchMusics();
            } catch (e) {
              message.error(e.message || '保存失败');
            }
          }}
        >
          <Form.Item label="标题" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="歌手" name="singer">
            <Input />
          </Form.Item>
          <Form.Item label="封面地址" name="cover">
            <Input />
          </Form.Item>
          <Form.Item label="播放地址" name="url">
            <Input />
          </Form.Item>
          <Form.Item label="时长" name="duration">
            <Input placeholder="例如 03:30" />
          </Form.Item>
          <Form.Item label="日期" name="date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
