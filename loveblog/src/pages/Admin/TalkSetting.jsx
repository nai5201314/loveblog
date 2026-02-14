import { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, message, Card, Avatar, Modal, Form, Input, List, Grid } from 'antd';
import api from '../../utils/api';
import dayjs from 'dayjs';

const { useBreakpoint } = Grid;
const { Meta } = Card;
export default function TalkSetting() {
  const [talks, setTalks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const screens = useBreakpoint();

  const isMobile = !screens.md; 

  const fetchTalks = async () => {
    try {
      setLoading(true);
      const res = await api.getTalks();
      if (res.success) {
        setTalks(res.data || []);
      }
    } catch (e) {
      message.error('获取留言失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTalks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.deleteTalk(id);
      message.success('删除成功');
      fetchTalks();
    } catch (e) {
      message.error(e.message || '删除失败');
    }
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      content: record.content,
    });
    setModalOpen(true);
  };

  const columns = [
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar) => <Avatar src={avatar} />,
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: '时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (createdAt) => dayjs(createdAt).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => openEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除这条留言吗？"
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
      title="猫狗留言管理"
      extra={
        <Button
          type="primary"
          onClick={() => {
            setEditing(null);
            form.resetFields();
            setModalOpen(true);
          }}
        >
          新建留言
        </Button>
      }
    >

      {!isMobile && (
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={talks}
          pagination={false}
        />
      )}

      {isMobile && (
        <List
          loading={loading}
          dataSource={talks}
          renderItem={(item) => (
            <Card
              style={{ marginBottom: 12 }}
              actions={[
                <Button type="link" onClick={() => openEdit(item)}>
                  编辑
                </Button>,
                <Popconfirm
                  title="确认删除这条留言吗？"
                  onConfirm={() => handleDelete(item.id)}
                >
                  <Button type="link" danger>
                    删除
                  </Button>
                </Popconfirm>,
              ]}
            >
              <Meta
                avatar={<Avatar src={item.avatar} />}
                title={item.nickname}
                description={
                  <>
                    <div>{item.content}</div>
                    <div>{dayjs(item.created_at).format('YYYY-MM-DD HH:mm')}</div>
                  </>
                }
              />
            </Card>
          )}
        />
      )}

      <Modal
        title={editing ? '编辑留言' : '新建留言'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={async (values) => {
            try {
              if (editing) {
                await api.updateTalk(editing.id, { content: values.content });
                message.success('更新成功');
              } else {
                await api.createTalk({
                  qq: '000000',
                  nickname: '管理员',
                  content: values.content,
                });
                message.success('创建成功');
              }
              setModalOpen(false);
              fetchTalks();
            } catch (e) {
              message.error(e.message || '保存失败');
            }
          }}
        >
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入留言内容' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
