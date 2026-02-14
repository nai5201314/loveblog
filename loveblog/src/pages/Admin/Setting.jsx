import { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Button, message, Card } from 'antd';
import dayjs from 'dayjs';
import api from '../../utils/api';

export default function Setting() {
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.getSettings();
        if (res.success && res.data) {
          form.setFieldsValue({
            maleName: res.data.male_name || '',
            femaleName: res.data.female_name || '',
            togetherDate: res.data.together_date
              ? dayjs(res.data.together_date)
              : null,
          });
        }
      } catch (e) {
        message.error('获取设置失败');
      }
    };

    fetchSettings();
  }, [form]);

  const handleFinish = async (values) => {
    try {
      setSubmitting(true);
      await api.updateSettings({
        male_name: values.maleName,
        female_name: values.femaleName,
        together_date: values.togetherDate.format('YYYY-MM-DD'),
      });
      message.success('保存成功');
    } catch (e) {
      message.error(e.message || '保存失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card title="基本设置">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item
          label="猫猫昵称"
          name="femaleName"
          rules={[{ required: true, message: '请输入猫猫昵称' }]}
        >
          <Input placeholder="例如：小猫" />
        </Form.Item>

        <Form.Item
          label="狗狗昵称"
          name="maleName"
          rules={[{ required: true, message: '请输入狗狗昵称' }]}
        >
          <Input placeholder="例如：小狗" />
        </Form.Item>

        <Form.Item
          label="在一起的日子"
          name="togetherDate"
          rules={[{ required: true, message: '请选择日期' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>
            保存设置
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
