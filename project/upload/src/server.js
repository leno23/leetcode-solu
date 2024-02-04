const express = require('express');
const multer = require('multer');

// 创建Express应用
const app = express();

// 设置存储目标和文件名
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // 文件将被保存在 uploads 目录中
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // 使用原始文件名作为文件名
  }
});

// 创建Multer实例
const upload = multer({ storage: storage });

// 处理文件上传请求
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // 可以在这里进行对上传成功的文件的处理

  res.json({ message: 'File uploaded successfully' });
});

// 启动服务器
const port = 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
