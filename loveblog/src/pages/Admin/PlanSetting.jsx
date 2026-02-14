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

const { useBreakpoint } = Grid;

export default function PlanSetting() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await api.getPlans('all');
      if (res.success) {
        setPlans(res.data || []);
      }
    } catch (e) {
      message.error('获取计划失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.deletePlan(id);
      message.success('删除成功');
      fetchPlans();
    } catch (e) {
      message.error(e.message || '删除失败');
    }
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      title: record.title,
      desc: record.desc,
      create_date: record.create_date ? dayjs(record.create_date) : null,
      deadline: record.deadline ? dayjs(record.deadline) : null,
      status: record.status,
      finish_date: record.finish_date ? dayjs(record.finish_date) : null,
    });
    setModalOpen(true);
  };

  const columns = [
  {
    title: '标题',
    dataIndex: 'title',
  },
  {
    title: '创建日期',
    dataIndex: 'create_date',
    render: (create_date) => dayjs(create_date).format('YYYY-MM-DD'), // Format the date
  },
  {
    title: '截止日期',
    dataIndex: 'deadline',
    render: (deadline) => deadline ? dayjs(deadline).format('YYYY-MM-DD') : '-', // Handle nulls gracefully
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (status) =>
      status === 'finished' ? (
        <Tag color="green">已完成</Tag>
      ) : (
        <Tag color="orange">未完成</Tag>
      ),
  },
  {
    title: '操作',
    render: (_, record) => (
      <>
        <Button type="link" onClick={() => openEdit(record)}>
          编辑
        </Button>
        <Popconfirm
          title="确认删除这个计划吗？"
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
    title="猫狗计划管理"
    extra={
      <Button
        type="primary"
        onClick={() => {
          setEditing(null);
          form.resetFields();
          setModalOpen(true);
        }}
      >
        新建计划
      </Button>
    }
  >
    {!isMobile && (
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={plans}
        pagination={false}
      />
    )}
    {isMobile && (
      <List
        loading={loading}
        dataSource={plans}
        renderItem={(item) => (
          <Card
            style={{ marginBottom: 12 }}
            actions={[
              <Button type="link" onClick={() => openEdit(item)}>
                编辑
              </Button>,
              <Popconfirm
                title="确认删除这个计划吗？"
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
                    状态：
                    {item.status === 'finished' ? (
                      <Tag color="green" style={{ marginLeft: 6 }}>
                        已完成
                      </Tag>
                    ) : (
                      <Tag color="orange" style={{ marginLeft: 6 }}>
                        未完成
                      </Tag>
                    )}
                  </div>
                  <div>创建日期：{dayjs(item.create_date).format('YYYY-MM-DD')}</div>
                  <div>截止日期：{item.deadline ? dayjs(item.deadline).format('YYYY-MM-DD') : '-'}</div>
                </>
              }
            />
          </Card>
        )}
      />
    )}
    <Modal
      title={editing ? '编辑计划' : '新建计划'}
      open={modalOpen}
      onCancel={() => setModalOpen(false)}
      onOk={() => form.submit()}
      destroyOnHidden
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={{ status: 'unfinished' }}
        onFinish={async (values) => {
          const payload = {
            title: values.title,
            desc: values.desc,
            create_date: values.create_date.format('YYYY-MM-DD'),
            deadline: values.deadline ? values.deadline.format('YYYY-MM-DD') : null,
            status: values.status,
            finish_date: values.finish_date ? values.finish_date.format('YYYY-MM-DD') : null,
          };
          try {
            if (editing) {
              await api.updatePlan(editing.id, payload);
              message.success('更新成功');
            } else {
              await api.createPlan(payload);
              message.success('创建成功');
            }
            setModalOpen(false);
            fetchPlans();
          } catch (e) {
            message.error(e.message || '保存失败');
          }
        }}
      >
        <Form.Item label="标题" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="描述" name="desc">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item label="创建日期" name="create_date" rules={[{ required: true }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="截止日期" name="deadline">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="状态" name="status">
          <Select
            options={[
              { label: '未完成', value: 'unfinished' },
              { label: '已完成', value: 'finished' },
            ]}
          />
        </Form.Item>

        <Form.Item label="完成日期" name="finish_date">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  </Card>
);

}
