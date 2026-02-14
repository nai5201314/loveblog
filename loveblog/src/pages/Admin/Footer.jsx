import { Typography } from 'antd';

const { Text } = Typography;

export default function FooterIndex() {
  const year = new Date().getFullYear();
  return (
    <div
      style={{
        textAlign: 'center',
        color: '#999',
        fontSize: 12,
      }}
    >
      <Text type="secondary">
        © {year} 小奈博客后台 · Made with  for 绝世邪恶糯玉米 v1.0.0
      </Text>
    </div>
  );
}