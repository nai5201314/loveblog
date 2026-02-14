import express from 'express';
import qiniu from 'qiniu';
import multer from 'multer';
import qiniuConfig from '../config/qiniu.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/image', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: '未获取到文件' });
    }
    const mac = new qiniu.auth.digest.Mac(
      qiniuConfig.accessKey,
      qiniuConfig.secretKey
    );

    const options = {
      scope: qiniuConfig.bucket,
    };

    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);

    const config = new qiniu.conf.Config();
    config.zone = qiniu.zone.Zone_z2; 

    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();

    const key = `diary/${Date.now()}-${file.originalname}`;

    formUploader.put(
      uploadToken,
      key,
      file.buffer,
      putExtra,
      (err, body, info) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ success: false, message: '上传失败' });
        }

        if (info.statusCode === 200) {
          res.json({
            success: true,
            data: {
              url: `${qiniuConfig.domain}/${body.key}`,
            },
          });
        } else {
          res.status(500).json({ success: false, message: '上传失败' });
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
