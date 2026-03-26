# DB Console（独立 Flask + 静态 HTML/JS）

从 `auto-test-server` / `auto-test-front` 抽离的 PostgreSQL Web 控制台：后端为 Flask，前端为纯 `static/index.html` + `static/js/app.js` + `static/css/style.css`，无需 Node 构建。Console 编辑区使用 **CodeMirror 6**（通过 `importmap` 从 esm.sh 加载）：PostgreSQL 语法高亮、关键字/表/列补全（需先连接并加载表列表，打开表数据标签后列名更完整）。

## 功能

- 访问密码（默认 `888`）
- 预设环境连接 / 自定义连接
- 表列表、表数据分页与列筛选（ILIKE）
- 多标签 SQL 控制台（`textarea` 编辑 + 执行查询或命令）
- 高危 SQL（DROP/TRUNCATE）二次确认

## 依赖与运行

使用 [uv](https://docs.astral.sh/uv/) 管理依赖与虚拟环境（未安装时：`pip install uv` 或按官方文档安装）。

```bash
cd db-console-standalone
uv sync
uv run python -m db_console_app.app
```

或进入由 `uv sync` 创建的 `.venv` 后：

```bash
.venv\Scripts\activate   # Windows
python -m db_console_app.app
```

依赖声明在 `pyproject.toml`，锁文件为 `uv.lock`（建议纳入版本控制以便可复现安装）。

浏览器打开：<http://127.0.0.1:6010/db-console/>

开发时可设环境变量 `FLASK_DEBUG=1` 自行用 `uv run flask run` 启动（需配置 `FLASK_APP`）。

## 目录

| 路径 | 说明 |
|------|------|
| `db_console_app/` | Flask 应用与 `psycopg2` 数据库逻辑 |
| `static/` | 静态前端（HTML/CSS/JS） |

## 说明

- 预设连接信息在 `static/js/app.js` 顶部 `PRESETS` 中，请按环境自行修改，勿提交真实生产密码。
- API 与原先一致：`POST /db-console/test-connection|tables|table-data|execute`，响应 `{ code, message, data }`。
