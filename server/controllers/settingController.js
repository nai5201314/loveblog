import pool from '../config/database.js';
export const getSettings = async (req, res, next) => {
  try {
    const [settings] = await pool.execute(
      'SELECT * FROM setting WHERE id = 1'
    );

    if (settings.length === 0) {
      await pool.execute(
        'INSERT INTO setting (id, male_name, female_name, together_date) VALUES (1, ?, ?, ?)',
        ['小狗', '小猫', '2025-07-01']
      );
      
      const [newSettings] = await pool.execute(
        'SELECT * FROM setting WHERE id = 1'
      );
      
      return res.json({
        success: true,
        data: newSettings[0]
      });
    }

    res.json({
      success: true,
      data: settings[0]
    });
  } catch (error) {
    next(error);
  }
};
export const updateSettings = async (req, res, next) => {
  try {
    const { male_name, female_name, together_date } = req.body;
    const [existing] = await pool.execute(
      'SELECT * FROM setting WHERE id = 1'
    );

    if (existing.length === 0) {
      await pool.execute(
        'INSERT INTO setting (id, male_name, female_name, together_date) VALUES (1, ?, ?, ?)',
        [male_name || '小狗', female_name || '小猫', together_date || '2025-07-01']
      );
    } else {
      await pool.execute(
        'UPDATE setting SET male_name = ?, female_name = ?, together_date = ? WHERE id = 1',
        [male_name || existing[0].male_name, female_name || existing[0].female_name, together_date || existing[0].together_date]
      );
    }
    const [updated] = await pool.execute(
      'SELECT * FROM setting WHERE id = 1'
    );

    res.json({
      success: true,
      message: '设置更新成功',
      data: updated[0]
    });
  } catch (error) {
    next(error);
  }
};
