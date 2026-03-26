import logging
from pathlib import Path

from flask import Flask, jsonify, redirect, request, send_file
from flask_cors import CORS
from pydantic import ValidationError

from db_console_app import db_logic
from db_console_app.schemas import (
    ExecuteSqlBody,
    ListTablesBody,
    ResponseWrapper,
    TableDataBody,
    TestConnectionBody,
)

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_DIR = BASE_DIR / "static"


def _handle_exc(e: Exception) -> ResponseWrapper:
    logger.exception(e)
    if isinstance(e, ConnectionError):
        return ResponseWrapper(code=503, message=str(e))
    return ResponseWrapper(code=500, message=f"Internal Server Error: {e}")


def _rw(rw: ResponseWrapper):
    return jsonify(rw.model_dump())


def create_app() -> Flask:
    app = Flask(
        __name__,
        static_folder=str(STATIC_DIR),
        static_url_path="/static",
    )
    CORS(app, resources={r"/db-console/*": {"origins": "*"}})

    @app.post("/db-console/test-connection")
    def route_test_connection():
        try:
            body = TestConnectionBody.model_validate(request.get_json(force=True, silent=True) or {})
            return _rw(db_logic.test_connection(body))
        except ValidationError as e:
            return _rw(ResponseWrapper(code=400, message=str(e)))
        except Exception as e:
            return _rw(_handle_exc(e))

    @app.post("/db-console/tables")
    def route_tables():
        try:
            body = ListTablesBody.model_validate(request.get_json(force=True, silent=True) or {})
            return _rw(db_logic.list_tables(body))
        except ValidationError as e:
            return _rw(ResponseWrapper(code=400, message=str(e)))
        except Exception as e:
            return _rw(_handle_exc(e))

    @app.post("/db-console/table-data")
    def route_table_data():
        try:
            body = TableDataBody.model_validate(request.get_json(force=True, silent=True) or {})
            return _rw(db_logic.table_data(body))
        except ValidationError as e:
            return _rw(ResponseWrapper(code=400, message=str(e)))
        except Exception as e:
            return _rw(_handle_exc(e))

    @app.post("/db-console/execute")
    def route_execute():
        try:
            body = ExecuteSqlBody.model_validate(request.get_json(force=True, silent=True) or {})
            return _rw(db_logic.execute_sql(body))
        except ValidationError as e:
            return _rw(ResponseWrapper(code=400, message=str(e)))
        except Exception as e:
            return _rw(_handle_exc(e))

    @app.get("/")
    def root():
        return redirect("/db-console/")

    @app.get("/db-console")
    def db_console_no_slash():
        return redirect("/db-console/")

    @app.get("/db-console/")
    def db_console_page():
        index = STATIC_DIR / "index.html"
        if not index.is_file():
            return (
                "<p>缺少静态文件 <code>static/index.html</code>。</p>",
                503,
                {"Content-Type": "text/html; charset=utf-8"},
            )
        return send_file(index)

    return app


def main():
    logging.basicConfig(level=logging.INFO)
    app = create_app()
    app.run(host="0.0.0.0", port=6010, debug=False)


if __name__ == "__main__":
    main()
