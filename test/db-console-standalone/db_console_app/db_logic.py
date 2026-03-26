import logging
import re
from datetime import date, datetime
from decimal import Decimal
from typing import Any, Dict, List, Tuple, Union

import psycopg2
from db_console_app.schemas import (
    ExecuteSqlBody,
    ListTablesBody,
    ResponseWrapper,
    TableDataBody,
    TestConnectionBody,
)

logger = logging.getLogger(__name__)

_IDENTIFIER_RE = re.compile(r"^[A-Za-z_][A-Za-z0-9_]*$")
_CONNECT_TIMEOUT = 10


def _validate_identifier(value: str, field_name: str) -> str:
    if not _IDENTIFIER_RE.match(value):
        raise ValueError(f"Invalid {field_name}: {value}")
    return value


def _connect_kwargs(body: Union[TestConnectionBody, ListTablesBody, TableDataBody, ExecuteSqlBody]) -> Dict[str, Any]:
    kwargs: Dict[str, Any] = dict(
        host=body.host,
        port=body.port,
        dbname=body.database,
        user=body.username,
        password=body.password,
        connect_timeout=_CONNECT_TIMEOUT,
    )
    if body.ssl is True:
        kwargs["sslmode"] = "require"
    elif body.ssl is False:
        kwargs["sslmode"] = "disable"
    return kwargs


def connect_pg(body: Union[TestConnectionBody, ListTablesBody, TableDataBody, ExecuteSqlBody]):
    try:
        conn = psycopg2.connect(**_connect_kwargs(body))
        conn.autocommit = True
        return conn
    except (OSError, psycopg2.Error) as e:
        logger.exception(
            "Failed connecting to PostgreSQL %s:%s/%s as %s",
            body.host,
            body.port,
            body.database,
            body.username,
        )
        err_detail = f"{type(e).__name__}: {e}" if str(e) else f"{type(e).__name__}"
        raise ConnectionError(
            f"无法连接到 {body.host}:{body.port}，请检查主机地址、端口及网络连通性（{err_detail}）"
        ) from e


def cell_to_json(v: Any) -> Any:
    if v is None:
        return None
    if isinstance(v, (datetime, date)):
        return v.isoformat()
    if isinstance(v, Decimal):
        return float(v)
    if isinstance(v, (bytes, memoryview)):
        return bytes(v).decode("utf-8", errors="replace")
    if isinstance(v, (list, dict)):
        return v
    t = type(v).__name__
    if t == "UUID" or t == "date":
        return str(v)
    return v


def test_connection(body: TestConnectionBody) -> ResponseWrapper:
    conn = connect_pg(body)
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT version() AS version")
            row = cur.fetchone()
            server_version = row[0] if row else None
        return ResponseWrapper(
            data={"server_version": server_version},
            message="连接成功",
        )
    finally:
        conn.close()


def list_tables(body: ListTablesBody) -> ResponseWrapper:
    conn = connect_pg(body)
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT table_schema, table_name
                FROM information_schema.tables
                WHERE table_type = 'BASE TABLE'
                  AND table_schema NOT IN ('pg_catalog', 'information_schema')
                ORDER BY table_schema, table_name;
                """
            )
            records = cur.fetchall()
        tables: List[Dict[str, str]] = [
            {"schema": r[0], "table": r[1]} for r in records
        ]
        return ResponseWrapper(data=tables)
    finally:
        conn.close()


def _build_where_from_filters(filters: Dict[str, str]) -> Tuple[str, List[str]]:
    if not filters:
        return "", []
    conditions: List[str] = []
    values: List[str] = []
    for col, val in filters.items():
        val = (val or "").strip()
        if not val:
            continue
        _validate_identifier(col, "column")
        conditions.append(f'"{col}"::text ILIKE %s')
        values.append(f"%{val}%")
    if not conditions:
        return "", []
    return " WHERE " + " AND ".join(conditions), values


def table_data(body: TableDataBody) -> ResponseWrapper:
    schema = _validate_identifier(body.table_schema, "schema")
    table = _validate_identifier(body.table, "table")
    page = max(body.page, 1)
    page_size = max(min(body.page_size, 1000), 1)
    filters = body.filters or {}
    where_sql, where_args = _build_where_from_filters(filters)

    conn = connect_pg(body)
    try:
        with conn.cursor() as cur:
            col_sql = """
                SELECT column_name
                FROM information_schema.columns
                WHERE table_schema = %s
                  AND table_name = %s
                ORDER BY ordinal_position;
            """
            cur.execute(col_sql, (schema, table))
            col_records = cur.fetchall()
            columns: List[str] = [c[0] for c in col_records]

            count_sql = f'SELECT COUNT(*) AS total FROM "{schema}"."{table}"' + where_sql
            cur.execute(count_sql, where_args)
            total = int(cur.fetchone()[0])

            rows: List[List[Any]] = []
            if columns:
                quoted_cols = ", ".join(f'"{c}"' for c in columns)
                offset = (page - 1) * page_size
                data_sql = (
                    f'SELECT {quoted_cols} FROM "{schema}"."{table}"'
                    + where_sql
                    + f" ORDER BY 1 LIMIT %s OFFSET %s"
                )
                cur.execute(data_sql, (*where_args, page_size, offset))
                for r in cur.fetchall():
                    rows.append([cell_to_json(v) for v in r])

        return ResponseWrapper(
            data={
                "schema": schema,
                "table": table,
                "columns": columns,
                "rows": rows,
                "total": total,
                "page": page,
                "page_size": page_size,
            }
        )
    finally:
        conn.close()


def execute_sql(body: ExecuteSqlBody) -> ResponseWrapper:
    sql = body.sql.strip()
    if not sql:
        return ResponseWrapper(code=400, message="SQL 语句不能为空")

    lowered = sql.lstrip().lower()
    is_query = lowered.startswith("select") or lowered.startswith("with")
    max_rows = max(min(body.max_rows, 5000), 1)

    conn = connect_pg(body)
    try:
        with conn.cursor() as cur:
            if is_query:
                cur.execute(sql)
                columns = [d[0] for d in cur.description] if cur.description else []
                records = cur.fetchall()
                truncated = len(records) > max_rows
                if truncated:
                    records = records[:max_rows]

                rows: List[List[Any]] = []
                if records and not columns:
                    columns = [f"column_{i}" for i in range(len(records[0]))]
                for r in records:
                    rows.append([cell_to_json(r[i]) for i in range(len(columns))])

                return ResponseWrapper(
                    data={
                        "type": "query",
                        "columns": columns,
                        "rows": rows,
                        "rowCount": len(rows),
                        "truncated": truncated,
                    }
                )
            else:
                cur.execute(sql)
                raw = getattr(cur, "statusmessage", None) or ""
                parts = str(raw).split()
                command = parts[0] if parts else ""
                row_count = cur.rowcount if cur.rowcount is not None else 0
                if row_count < 0:
                    row_count = 0
                return ResponseWrapper(
                    data={
                        "type": "command",
                        "command": command,
                        "rowCount": row_count,
                        "raw": str(raw),
                    }
                )
    finally:
        conn.close()
