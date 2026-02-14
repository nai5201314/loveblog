import pool from '../config/database.js';
const getRandomCover = () => {
  const coverCount = 5;
  const randomIndex = Math.floor(Math.random() * coverCount) + 1;
  return `/cover/${randomIndex}.png`;
};
export const getHomeData = async (req, res, next) => {
  try {
    const [recentDiaries] = await pool.execute(
      `SELECT id, '日记' as type, title, content, cover, date, author, created_at, CONCAT('/diary/', id) as path 
       FROM diary 
       ORDER BY date DESC, created_at DESC 
       LIMIT 5`
    );

    const [recentPhotos] = await pool.execute(
      `SELECT id, '照片' as type, title, \`desc\` as content, cover, date, author, created_at, CONCAT('/photo/', id) as path 
       FROM photo 
       ORDER BY date DESC, created_at DESC 
       LIMIT 5`
    );

    const [recentPlans] = await pool.execute(
      `SELECT id, '计划' as type, title, \`desc\` as content, NULL as cover, create_date as date, author, created_at, CONCAT('/plan/', id) as path 
       FROM plan 
       WHERE status = 'finished' 
       ORDER BY finish_date DESC, created_at DESC 
       LIMIT 5`
    );
    const recentDynamicList = [
      ...recentDiaries.map(item => ({
        ...item,
        cover: (item.cover && typeof item.cover === 'string' && item.cover.trim() !== '') ? item.cover : getRandomCover(),
        time: item.created_at || item.date
      })),
      ...recentPhotos.map(item => ({
        ...item,
        cover: (item.cover && typeof item.cover === 'string' && item.cover.trim() !== '') ? item.cover : getRandomCover(),
        time: item.created_at || item.date
      })),
      ...recentPlans.map(item => ({
        ...item,
        cover: (item.cover && typeof item.cover === 'string' && item.cover.trim() !== '') ? item.cover : getRandomCover(),
        time: item.created_at || item.date
      }))
    ].sort((a, b) => new Date(b.time || b.date) - new Date(a.time || a.date)).slice(0, 4);

    res.json({
      success: true,
      data: {
        recentDynamicList
      }
    });
  } catch (error) {
    next(error);
  }
};
export const getTogetherDays = async (req, res, next) => {
  try {
    const [settings] = await pool.execute(
      'SELECT together_date FROM setting WHERE id = 1'
    );

    let startDateStr = '2025-07-01';
    if (settings.length > 0 && settings[0].together_date) {
      startDateStr = settings[0].together_date;
    }

    const startDate = new Date(startDateStr);
    const today = new Date();
    const diffTime = today - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    res.json({
      success: true,
      data: {
        togetherDays: diffDays,
        startDate: startDateStr
      }
    });
  } catch (error) {
    next(error);
  }
};
