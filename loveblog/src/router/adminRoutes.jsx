import AdminLayout from '@/layouts/AdminLayout';
import AdminIndex from '@/pages/Admin/AdminIndex';
import Setting from '@/pages/Admin/Setting';
import Diary from '@/pages/Admin/Diary';
import Photo from '@/pages/Admin/Photo';
import Time from '@/pages/Admin/Time';
import Music from '@/pages/Admin/Music';
import Talk from '@/pages/Admin/Talk';
import Plan from '@/pages/Admin/Plan';
import User from '@/pages/Admin/User';
import Login from '@/pages/Admin/Login';

export const adminMenuRoutes = [
  {
    path: 'index',
    label: '首页',
    element: <AdminIndex />,
  },
  {
    path: 'setting',
    label: '基本设置',
    element: <Setting />,
  },
  {
    label: '页面',
    children: [
      { path: 'diary', label: '猫狗日记', element: <DiarySetting /> },
      { path: 'photo', label: '猫狗照片', element: <PhotoSetting /> },
      { path: 'time', label: '猫狗时光', element: <TimeSetting /> },
      { path: 'music', label: '猫狗音乐', element: <MusicSetting /> },
      { path: 'talk', label: '猫狗留言', element: <TalkSetting /> },
      { path: 'plan', label: '猫狗计划', element: <PlanSetting /> },
    ],
  },
  {
    path: 'user',
    label: '人员管理',
    element: <User />,
  },
];

const adminRoutes = [
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminIndex /> },
      ...adminMenuRoutes.flatMap(r =>
        r.children ? r.children : r
      ),
    ],
  },
  {
    path: '/admin/login',
    element: <Login />,
  },
];

export default adminRoutes;
