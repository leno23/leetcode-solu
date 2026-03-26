from typing import Any, Dict, Optional

from pydantic import BaseModel, ConfigDict, Field


class DbConnectionInfo(BaseModel):
    host: str = Field(..., description="数据库主机地址或 IP")
    port: int = Field(5432, description="数据库端口")
    database: str = Field(..., description="数据库名称")
    username: str = Field(..., description="数据库用户名")
    password: str = Field(..., description="数据库密码")
    ssl: Optional[bool] = Field(
        default=None, description="是否启用 SSL（为空则使用数据库默认配置）"
    )


class TestConnectionBody(DbConnectionInfo):
    pass


class ListTablesBody(DbConnectionInfo):
    pass


class TableDataBody(DbConnectionInfo):
    """请求 JSON 仍使用键名 schema（与原版一致），避免字段名与 BaseModel.schema 冲突。"""

    model_config = ConfigDict(populate_by_name=True)

    table_schema: str = Field(..., alias="schema", description="表所属 schema")
    table: str = Field(..., description="表名")
    page: int = Field(1, ge=1, description="页码（从 1 开始）")
    page_size: int = Field(50, ge=1, le=1000, description="每页条数")
    filters: Optional[Dict[str, str]] = Field(default=None)


class ExecuteSqlBody(DbConnectionInfo):
    sql: str = Field(..., description="要执行的 SQL 语句")
    max_rows: int = Field(1000, ge=1, le=5000)


class ResponseWrapper(BaseModel):
    code: int = Field(default=200)
    message: str = Field(default="OK")
    data: Any = None
