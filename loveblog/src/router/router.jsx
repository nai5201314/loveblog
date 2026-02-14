import React from 'react';
import { Outlet } from 'react-router-dom';
import DefaultLayout from '../components/layouts/Index';
import Diary from '../pages/Web/Diary';
import Music from '../pages/Web/Music';
import Plan from '../pages/Web/Plan';
import Time from '../pages/Web/Time';
import Talk from '../pages/Web/Talk';
import Photo from '../pages/Web/Photo';
import IndexContent from '../pages/Web/Index';
import NotFound from '../pages/Web/NotFound';
import Login from '../pages/Admin/Login';
import DiaryDetail from '../pages/Web/DiaryDetail.jsx';
import PhotoDetail from '../pages/Web/PhotoDetail.jsx';
import TimeDetail from '../pages/Web/TimeDetail.jsx';
import MusicDetail from '../pages/Web/MusicDetail.jsx';
import PlanDetail from '../pages/Web/PlanDetail.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import AdminIndex from '../pages/Admin/AdminIndex.jsx';
import DiarySetting from '../pages/Admin/DiarySetting.jsx';
import PhotoSetting from '../pages/Admin/PhotoSetting.jsx';
import TimeSetting from '../pages/Admin/TimeSetting.jsx';
import TalkSetting from '../pages/Admin/TalkSetting.jsx';
import MusicSetting from '../pages/Admin/MusicSetting.jsx';
import PlanSetting from '../pages/Admin/PlanSetting.jsx';
import Setting from '../pages/Admin/Setting.jsx';
import GroupSetting from '../pages/Admin/GroupSetting.jsx';
import DiaryEdit from '../pages/Admin/DiaryEdit.jsx';
const routes = [
  {
    path: '/',
    element: <DefaultLayout></DefaultLayout>, 
    children: [
        {index:true,element:<IndexContent />}, 
        { path: 'diary',
           element: <Diary />,
          children:[
            {path : ':id',
            element: <DiaryDetail />},
          ] }, 
        { path: 'Music', 
          element: <Music /> ,
        children:[
          {path:':id',
            element:<MusicDetail />,}
        ]},
        { path: 'Plan', 
          element: <Plan />,
          children:[
            {path:':id',element:<PlanDetail />}
          ]
        },
        { 
          path: 'time', 
          element: <Time />,
          children: [
            {
              path: ':id',
              element: <TimeDetail />
            }
          ]
        },
        { path: 'Talk', element: <Talk /> },//  聊天  "/Talk"   
        { 
          path: 'photo', 
          element: <Photo />,
          children: [
            {
              path: ':id',
              element: <PhotoDetail />
            }
          ]
        },
        {path:'*',element:<NotFound />}, 
    ],
  },
  {
    path: '/Admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminIndex /> }, 
     { path: 'diary', label: '猫狗日记', element: <DiarySetting />},
      {path:'editor',label:'创建日记',element:<DiaryEdit />},
      { path: 'photo', label: '猫狗照片', element: <PhotoSetting /> },
      { path: 'time', label: '猫狗时光', element: <TimeSetting /> },
      { path: 'music', label: '猫狗音乐', element: <MusicSetting /> },
      { path: 'talk', label: '猫狗留言', element: <TalkSetting /> },
      { path: 'plan', label: '猫狗计划', element: <PlanSetting /> },
      {path:'user' ,label:'人员管理',element:<GroupSetting />},
      {path:'setting',label:'基本设置',element:<Setting />}
   
    ],
  },
  {
        path: '/Admin/Login', 
        element: <Login /> ,
  },

];

export { routes };
export default routes;