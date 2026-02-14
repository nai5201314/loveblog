import { Spin } from 'antd';
import { useGlobalSpin } from '../../stores/spinStore.jsx';

export default function GlobalSpin({ children }) {
  const { spinning } = useGlobalSpin();
  return (
    <Spin
      spinning={spinning}
      size="large"
      tip="小猫小狗奔跑中…"
      style={{ height: '100vh', maxHeight: '100vh' }}
    >
      {children}
    </Spin>
  );
}