import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { Form, Input, DatePicker, Select, Button, message, Card } from 'antd';
import dayjs from 'dayjs';
import styles from './css/DiaryEdit.module.css';
import api from '../../utils/api';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Video from '../../components/Video/video.jsx';

export default function DiaryEdit() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const diaryId = searchParams.get('id');
  const [authorOptions, setAuthorOptions] = useState([]);
  const [html, setHtml] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);
  
  const [form] = Form.useForm();
  const defaultCovers = [
    { url: 'http://image.naiblog.cn/cover/1.png' },
    { url: 'http://image.naiblog.cn/cover/2.png' },
    { url: 'http://image.naiblog.cn/cover/3.png' },
    { url: 'http://image.naiblog.cn/cover/4.png' },
    { url: 'http://image.naiblog.cn/cover/5.png' },
  ];

  const getRandomCover = () => {
    const index = Math.floor(Math.random() * defaultCovers.length);
    return defaultCovers[index].url;
  };

  const getFirstImageFromHtml = (html) => {
    if (!html) return null;

    const div = document.createElement('div');
    div.innerHTML = html;

    const img = div.querySelector('img');
    return img ? img.getAttribute('src') : null;
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({ inline: false }),
      Link.configure({ openOnClick: false }),
      Video,
    ],
    content: '<p>记录</p>',
    onUpdate: ({ editor }) => {
      setHtml(editor.getHTML());
    },
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await api.getSettings();
        if (res.success) {
          const settings = res.data;

          setAuthorOptions([
            {
              label: settings.male_name || '狗狗',
              value: 'male',
            },
            {
              label: settings.female_name || '猫猫',
              value: 'female',
            },
          ]);
        }
      } catch (e) {
        message.error('获取作者设置失败');
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    const loadDiary = async () => {
      if (!diaryId || !editor) return;
      try {
        const res = await api.getDiaryById(diaryId);
        if (res.success) {
          const diary = res.data;
        
          form.setFieldsValue({
            title: diary.title,
            date: diary.date ? dayjs(diary.date) : undefined,
            author: diary.author || 'male', 
            cover: diary.cover || '',
          });
          editor.commands.setContent(diary.content || '<p>记录</p>');
        }
      } catch (e) {
        message.error(e.message || '加载日记失败');
      }
    };

    loadDiary();
  }, [diaryId, editor, form]);

  const handleSave = async (values) => {
    if (!html) {
      message.warning('日记内容不能为空');
      return;
    }

    setSaving(true);

    try {
      let cover = values.cover || null;
      if (!diaryId) {
        if (!cover) {
          const firstImage = getFirstImageFromHtml(html);
          if (firstImage) {
            cover = firstImage;
          }
        }
        if (!cover) {
          cover = getRandomCover();
        }
      }
      const payload = {
        title: values.title || '',
        date: values.date.format('YYYY-MM-DD'),
        author: values.author,
        cover,
        content: html,
      };

      if (diaryId) {
        await api.updateDiary(diaryId, payload);
        message.success('日记更新成功');
      } else {
        await api.createDiary(payload);
        message.success('日记创建成功');
      }

      navigate('/Admin/diary');
    } catch (e) {
      message.error(e.message || '保存日记失败');
    } finally {
      setSaving(false);
    }
  };

  if (!editor) {
    return <Card title="加载中..." style={{ margin: '20px 0' }}><div>编辑器加载中，请稍候...</div></Card>;
  }

  const btn = (active) =>
    `${styles.toolBtn} ${active ? styles.active : ''}`;

  return (
    <Card title={diaryId ? '编辑猫狗日记' : '创建猫狗日记'} style={{ margin: '20px 0' }}>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          author: 'male',
          date: dayjs(), 
        }}
        onFinish={handleSave}
        style={{ marginBottom: '24px' }}
      >
        <Form.Item
          label="日记标题"
          name="title"
          rules={[
            { max: 50, message: '标题最多 50 字' },
          ]}
        >
          <Input placeholder="请输入日记标题~（可选）" />
        </Form.Item>

        <Form.Item
          label="记录日期"
          name="date"
          rules={[{ required: true, message: '请选择日记记录日期' }]}
        >
          <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          label="记录作者"
          name="author"
          rules={[{ required: true, message: '请选择作者类型' }]}
        >
          <Select
            options={authorOptions}
            loading={!authorOptions.length}
            placeholder="请选择作者类型"
          />
        </Form.Item>

        <Form.Item
          label="封面图片链接"
          name="cover"
          rules={[{ message: '请输入有效的图片 URL（可选）' }]}
        >
          <Input
            placeholder="请输入封面图片的网络 URL（如 https://xxx.jpg）"
          />
        </Form.Item>

        <div className={styles.editorRoot}>
          <div className={styles.toolbar}>
            <button type="button" className={btn(editor.isActive('bold'))} onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
            <button type="button" className={btn(editor.isActive('italic'))} onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
            <button type="button" className={btn(editor.isActive('underline'))} onClick={() => editor.chain().focus().toggleUnderline().run()}>U</button>
            <button type="button" className={btn(editor.isActive('strike'))} onClick={() => editor.chain().focus().toggleStrike().run()}>S</button>

            <span className={styles.divider} />

            {[1,2,3,4,5,6].map(l => (
              <button
              type="button"
                key={l}
                className={btn(editor.isActive('heading', { level: l }))}
                onClick={() => editor.chain().focus().setHeading({ level: l }).run()}
              >
                H{l}
              </button>
            ))}

            <span className={styles.divider} />

            <button  type="button" className={styles.toolBtn} onClick={() => editor.chain().focus().toggleBulletList().run()}>• 列表</button>
            <button type="button" className={styles.toolBtn} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. 列表</button>
            <button type="button" className={styles.toolBtn} onClick={() => editor.chain().focus().toggleBlockquote().run()}>❝ 引用</button>
            <button type="button" className={styles.toolBtn} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>{'</>'}</button>
            <button 
            type="button"
              className={styles.toolBtn}
              onClick={() => {
                const now = dayjs().format('--' +'YYYY-MM-DD HH:mm');
                editor.chain().focus().insertContent(now).run();
              }}
            >
              时间
            </button>

            <span className={styles.divider} />

            <input
              className={styles.imageInput}
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];

                if (!file) return;
                try {
                  message.loading({ content: '图片上传中...', key: 'upload' });
                  const imageUrl = await api.uploadImage(file);  
                  if (!imageUrl || !imageUrl.startsWith('http')) {
                    message.error({ content: '上传失败，URL 无效！', key: 'upload' });
                    return;
                  }
                  editor.chain().focus().setImage({ src: imageUrl }).run();
                  setImageUrl('');
                  message.success({ content: '图片插入成功', key: 'upload' });
                } catch (e) {
                  message.error({ content: e.message || '上传失败', key: 'upload' });
                }
              }}
            />

            <button
            type="button"
              className={styles.toolBtn}
              onClick={() => {
                if (!imageUrl) {
                  message.warning('请先输入图片 URL');
                  return;
                }
                editor.chain().focus().setImage({ src: imageUrl }).run();
                setImageUrl(''); 
              }}
            >
              插入图片
            </button>
            <button
              type="button"
              className={styles.toolBtn}
              onClick={() => {
                const videoUrl = prompt('请输入视频链接（如 xxx.mp4 / xxx.mov）');
                if (!videoUrl) return;

                editor
                  .chain()
                  .focus()
                  .setVideo({
                    src: videoUrl,
                    width: '100%',
                    height: '360',
                  })
                  .run();
              }}
            >
              插入视频
            </button>
          </div>

          <div className={styles.body}>
            <div className={styles.editorPane}>
              <EditorContent editor={editor} />
            </div>
            <div className={styles.previewPane}>
              <div
                className={styles.previewContent}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          </div>
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={saving}
            size="large"
            style={{ marginRight: '12px' }}
          >
            {diaryId ? '更新日记' : '创建日记'}
          </Button>
          <Button
            onClick={() => navigate('/Admin/diary')}
            size="large"
          >
            取消返回
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}