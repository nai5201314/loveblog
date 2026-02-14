import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalSpin } from '../../stores/spinStore';
import api from '../../utils/api';
import { setToken } from '../../utils/auth';
import styles from './css/Login.module.css';
import { Form, Input, Button, Card, Typography, message } from 'antd';

const { Title, Paragraph } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const { setSpinning } = useGlobalSpin();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleFinish = async (values) => {
    const { username, password } = values;
    setSpinning(true);
    setSubmitting(true);
    try {
      const response = await api.adminLogin(username, password);
      if (response.success) {
        setToken(response.data.token);
        message.success('登录成功');
        navigate('/Admin');
      } else {
        message.error(response.message || '登录失败，请检查用户名和密码');
      }
    } catch (error) {
      message.error(error.message || '登录失败，请检查用户名和密码');
    } finally {
      setSubmitting(false);
      setSpinning(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <Card className={styles.loginBox}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 8 }}>
          管理员登录
        </Title>
        <Paragraph type="secondary" style={{ textAlign: 'center', marginBottom: 24 }}>
          请输入后台账号和密码
        </Paragraph>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={submitting}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
