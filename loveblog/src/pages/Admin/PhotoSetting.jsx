import { useEffect, useState } from 'react';
import { Card, Button, Popconfirm, message, Empty, Modal, Form, Input, DatePicker, Select } from 'antd';
import api from '../../utils/api';
import dayjs from 'dayjs';
import './css/PhotoSetting.css'; 
export default function PhotoSetting() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const res = await api.getPhotos(1, 100);
      if (res.success) {
        setPhotos(res.data.list || []);
      }
    } catch (e) {
      message.error('获取照片列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.deletePhoto(id);
      message.success('删除成功');
      fetchPhotos();
    } catch (e) {
      message.error(e.message || '删除失败');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('请选择图片格式的文件（jpg、png 等）');
      return;
    }
    const maxSize = 5 * 1024 * 1024; 
    if (file.size > maxSize) {
      message.error('图片大小不能超过 5MB，请选择更小的图片');
      return;
    }
    try {
      setUploading(true);
      message.loading({ content: '图片上传中...', key: 'imageUpload' });
      const uploadedImageUrl = await api.uploadImage(file);
      if (!uploadedImageUrl || !uploadedImageUrl.startsWith('http')) {
        message.error({ content: '上传失败，返回无效的图片 URL！', key: 'imageUpload' });
        return;
      }
      form.setFieldsValue({ cover: uploadedImageUrl });
      setImageUrl(uploadedImageUrl);

      message.success({ content: '图片上传成功 🎉', key: 'imageUpload' });
    } catch (e) {
      message.error({ content: e.message || '图片上传失败', key: 'imageUpload' });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <Card
      title="猫狗照片管理"
      loading={loading}
      extra={
        <Button
          type="primary"
          onClick={() => {
            setEditing(null);
            form.resetFields();
            setImageUrl('');
            setModalOpen(true);
          }}
        >
          新建照片
        </Button>
      }
    >
      {photos.length === 0 ? (
        <Empty description="还没有上传照片~" />
      ) : (
        <div className="photo-grid-container">
          {photos.map((item) => (
            <div key={item.id} className="photo-grid-item">
              <Card
                cover={
                  <div className="photo-img-container">
                    <img
                      alt={item.title}
                      src={item.cover}
                      className="photo-img"
                    />
                  </div>
                }
                actions={[
                  <Button
                    type="link"
                    key="edit"
                    onClick={() => {
                      setEditing(item);
                      form.setFieldsValue({
                        title: item.title,
                        cover: item.cover,
                        desc: item.desc,
                        date: item.date ? dayjs(item.date) : null,
                        author: item.author || 'male',
                      });
                      setImageUrl(item.cover);
                      setModalOpen(true);
                    }}
                  >
                    编辑
                  </Button>,
                  <Popconfirm
                    key="delete"
                    title="确认删除这张照片吗？"
                    onConfirm={() => handleDelete(item.id)}
                  >
                    <Button type="link" danger>
                      删除
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <Card.Meta title={item.title} description={item.desc} />
              </Card>
            </div>
          ))}
        </div>
      )}
      <Modal
        title={editing ? '编辑照片' : '新建照片'}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setUploading(false);
          setImageUrl('');
           form.resetFields();
        }}
        onOk={() => form.submit()}
        destroyOnHidden
        okButtonProps={{ disabled: uploading }}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={async (values) => {
            const payload = {
              title: values.title,
              cover: values.cover,
              desc: values.desc,
              date: values.date.format('YYYY-MM-DD'),
              author: values.author,
            };
            try {
              if (editing) {
                await api.updatePhoto(editing.id, payload);
                message.success('更新成功');
              } else {
                await api.createPhoto(payload);
                message.success('创建成功');
              }
              setModalOpen(false);
              setImageUrl('');
              fetchPhotos();
            } catch (e) {
              message.error(e.message || '保存失败');
            }
          }}
          initialValues={{ author: 'male' }}
        >
          <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="上传封面图片" extra="支持 jpg、png 格式，大小不超过 5MB">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Button
                type="default"
                disabled={uploading}
                onClick={() => document.getElementById('imageUploadInput').click()}
              >
                {uploading ? '上传中...' : '选择图片上传'}
              </Button>
              <input
                id="imageUploadInput"
                className="imageInput"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              {imageUrl && (
                <span style={{ fontSize: 12, color: '#52c41a', flex: 1, textAlign: 'left' }}>
                  已上传：{imageUrl.slice(0, 30)}...
                </span>
              )}
            </div>
          </Form.Item>
          <Form.Item label="封面地址" name="cover" rules={[{ required: true, message: '请上传封面或输入封面 URL' }]}>
            <Input
              placeholder="上传图片后自动填充，也可手动输入有效的图片 URL"
              disabled={uploading}
            />
          </Form.Item>

          <Form.Item label="描述" name="desc">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item label="日期" name="date" rules={[{ required: true, message: '请选择日期' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="作者" name="author">
            <Select
              options={[
                { label: '狗狗', value: 'male' },
                { label: '猫猫', value: 'female' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}