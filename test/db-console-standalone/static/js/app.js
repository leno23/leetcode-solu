import { EditorView, basicSetup } from "codemirror";
import { sql, PostgreSQL } from "@codemirror/lang-sql";
import { oneDark } from "@codemirror/theme-one-dark";

var ACCESS_PASSWORD = "888";
  var HIGH_RISK_SQL = /(drop\s+database|drop\s+table|truncate\s+table)/i;

  var PRESETS = {
    test: {
      host: "10.74.193.42",
      port: 32769,
      database: "auto-test",
      username: "admin",
      password: "11111111",
    },
    prod: {
      host: "10.74.193.42",
      port: 9090,
      database: "auto-test-dev",
      username: "admin",
      password: "11111111",
    },
    craftTest: {
      host: "10.74.193.42",
      port: 32769,
      database: "test-craft-test",
      username: "admin",
      password: "11111111",
    },
    craftProd: {
      host: "10.74.193.42",
      port: 32769,
      database: "test-craft-dev",
      username: "admin",
      password: "11111111",
    },
    apeTest: {
      host: "10.124.105.96",
      port: 32769,
      database: "chatape-dev",
      username: "admin",
      password: "11111111",
    },
    apeProd: {
      host: "10.124.105.88",
      port: 32768,
      database: "openai",
      username: "admin",
      password: "11111111",
    },
  };

  var ENV_LABELS = {
    test: "test",
    prod: "prod",
    apeTest: "ape-test",
    apeProd: "ape-prod",
    craftTest: "test-craft-test",
    craftProd: "test-craft-dev",
    custom: "custom",
  };

  var ENV_COLORS = {
    test: "#3fb950",
    prod: "#f78166",
    apeTest: "#3fb950",
    apeProd: "#f78166",
    craftTest: "#3fb950",
    craftProd: "#f78166",
    custom: "#d2a8ff",
  };

  /** 数据表分页可选每页条数（后端限制 1–1000） */
  var TABLE_PAGE_SIZE_OPTIONS = [10, 25, 50, 100, 200, 500, 1000];

  /** @param {number} currentSize */
  function tablePageSizeSelectHtml(currentSize) {
    var cur = Number(currentSize);
    if (!cur || cur < 1) cur = 50;
    cur = Math.min(1000, Math.max(1, cur));
    var opts = TABLE_PAGE_SIZE_OPTIONS.slice();
    if (opts.indexOf(cur) < 0) {
      opts.push(cur);
      opts.sort(function (a, b) {
        return a - b;
      });
    }
    var parts = [
      '<span class="pagination-page-size">',
      '<label for="page-size-select" class="page-size-label">每页</label>',
      '<select id="page-size-select" class="page-size-select" title="每页行数" aria-label="每页行数">',
    ];
    opts.forEach(function (n) {
      parts.push(
        '<option value="' +
          n +
          '"' +
          (n === cur ? " selected" : "") +
          ">" +
          n +
          " 行</option>"
      );
    });
    parts.push("</select></span>");
    return parts.join("");
  }

  /** @type {any} */
  var state = {
    hasAccess: false,
    accessPassword: "",
    accessError: null,
    connInfo: null,
    activeEnv: null,
    connecting: false,
    tablesLoading: false,
    tables: [],
    tableFilter: "",
    tabs: [{ type: "console", id: "console-1", title: "Console 1", sql: "", loading: false, result: null }],
    activeTabId: "console-1",
    dropdownOpen: false,
    customModalOpen: false,
    customForm: { host: "", port: 5432, database: "", username: "", password: "" },
    toast: null,
    filterDebounceTimers: {},
  };

  /** @type {any} */
  var sqlEditorView = null;
  /** @type {string | null} */
  var sqlEditorBoundTabId = null;

  var cellTooltipDelegationBound = false;
  /** @type {HTMLElement | null} */
  var cellTooltipEl = null;

  function escapeHtml(s) {
    if (s == null || s === "") return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /** 写入 HTML 双引号属性 */
  function attrEscape(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/\r/g, "&#13;")
      .replace(/\n/g, "&#10;");
  }

  /** 数据单元格：截断展示 + data-cell-tip 存全文供浮层复制 */
  function renderDataCell(cell) {
    if (cell == null) {
      return '<td class="null-cell cell-tip" data-cell-tip="NULL">NULL</td>';
    }
    var full = String(cell);
    return (
      '<td class="data-cell cell-tip" data-cell-tip="' +
      attrEscape(full) +
      '">' +
      escapeHtml(full) +
      "</td>"
    );
  }

  function cellTooltipIsVisible() {
    return !!(cellTooltipEl && cellTooltipEl.style.display !== "none");
  }

  function ensureCellTooltipEl() {
    if (cellTooltipEl) return cellTooltipEl;
    var el = document.createElement("div");
    el.id = "cell-tooltip-pop";
    el.className = "cell-tooltip-pop";
    el.innerHTML =
      '<div class="cell-tooltip-header">' +
      '<span class="cell-tooltip-title">单元格全文</span>' +
      '<button type="button" class="cell-tooltip-close" aria-label="关闭全文浮层">×</button>' +
      "</div>" +
      '<p class="cell-tooltip-hint">可选中复制。离开单元格后浮层仍保留；点击页面其他区域、按 Esc、点 × 或滚动页面时关闭。</p>' +
      '<div class="cell-tooltip-body"></div>';
    var closeBtn = el.querySelector(".cell-tooltip-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        e.preventDefault();
        hideCellTooltip();
      });
    }
    el.addEventListener("mousedown", function (e) {
      e.stopPropagation();
    });
    document.body.appendChild(el);
    cellTooltipEl = el;
    return el;
  }

  function hideCellTooltip() {
    if (cellTooltipEl) cellTooltipEl.style.display = "none";
  }

  function showCellTooltip(text, rect) {
    var el = ensureCellTooltipEl();
    var body = el.querySelector(".cell-tooltip-body");
    if (body) body.textContent = text;
    el.style.display = "block";
    el.style.visibility = "hidden";

    var margin = 8;
    var overlap = 12;
    var estW = Math.min(520, el.offsetWidth || 400);
    var left = rect.left;
    if (left + estW + margin > window.innerWidth) {
      left = Math.max(margin, window.innerWidth - estW - margin);
    }
    left = Math.max(margin, left);
    var top = rect.bottom - overlap;
    var h = el.offsetHeight;
    if (top + h + margin > window.innerHeight) {
      top = Math.max(margin, rect.top - h + overlap);
    }
    if (top < margin) top = margin;
    el.style.left = left + "px";
    el.style.top = top + "px";
    el.style.visibility = "visible";

    h = el.offsetHeight;
    if (top + h + margin > window.innerHeight) {
      top = Math.max(margin, window.innerHeight - h - margin);
      el.style.top = top + "px";
    }
  }

  function bindCellTooltipDelegation() {
    if (cellTooltipDelegationBound) return;
    var app = document.getElementById("app");
    if (!app) return;
    cellTooltipDelegationBound = true;

    app.addEventListener(
      "mouseover",
      function (e) {
        var td = e.target.closest && e.target.closest("td.cell-tip");
        if (!td || !td.hasAttribute("data-cell-tip")) return;
        var text = td.getAttribute("data-cell-tip");
        if (text == null) text = "";
        showCellTooltip(text, td.getBoundingClientRect());
      },
      true
    );

    document.addEventListener(
      "mousedown",
      function (e) {
        if (!cellTooltipIsVisible()) return;
        var t = e.target;
        if (cellTooltipEl && (t === cellTooltipEl || cellTooltipEl.contains(t))) return;
        if (t.closest && t.closest("td.cell-tip")) return;
        hideCellTooltip();
      },
      true
    );

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (!cellTooltipIsVisible()) return;
      hideCellTooltip();
    });

    document.addEventListener("scroll", hideCellTooltip, true);
    window.addEventListener("blur", hideCellTooltip);
  }

  function showToast(msg, kind) {
    state.toast = { msg: msg, kind: kind || "info" };
    render();
    setTimeout(function () {
      if (state.toast && state.toast.msg === msg) {
        state.toast = null;
        render();
      }
    }, 3500);
  }

  function apiPost(path, body) {
    return fetch("/db-console/" + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(function (r) {
      return r.json();
    });
  }

  function tableTabId(schema, table) {
    return "table-" + schema + "-" + table;
  }

  function syncSqlFromEditor() {
    if (!sqlEditorView || !sqlEditorBoundTabId) return;
    var t = state.tabs.find(function (x) {
      return x.id === sqlEditorBoundTabId && x.type === "console";
    });
    if (t) t.sql = sqlEditorView.state.doc.toString();
  }

  /** 有选区且非空则只执行选区，否则执行全文 */
  function getConsoleSqlToExecute() {
    if (!sqlEditorView) return "";
    var doc = sqlEditorView.state.doc;
    var sel = sqlEditorView.state.selection.main;
    var slice = doc.sliceString(sel.from, sel.to);
    if (slice.trim().length > 0) return slice.trim();
    return doc.toString().trim();
  }

  function tearDownSqlEditor() {
    syncSqlFromEditor();
    if (sqlEditorView) {
      sqlEditorView.destroy();
      sqlEditorView = null;
    }
    sqlEditorBoundTabId = null;
  }

  /** 供 @codemirror/lang-sql 补全：表名 -> 列名（已打开表页则有列） */
  function buildSqlSchema() {
    /** @type {Record<string, string[]>} */
    var sch = {};
    state.tables.forEach(function (t) {
      var key = t.schema + "." + t.table;
      if (!sch[key]) sch[key] = [];
    });
    state.tabs.forEach(function (tab) {
      if (tab.type === "table" && tab.tableData && tab.tableData.columns && tab.tableData.columns.length) {
        var k = tab.schema + "." + tab.table;
        sch[k] = tab.tableData.columns.slice();
      }
    });
    return sch;
  }

  function mountSqlEditorIfNeeded() {
    var host = document.getElementById("sql-editor-host");
    if (!host) return;
    var tab = state.tabs.find(function (t) {
      return t.id === state.activeTabId && t.type === "console";
    });
    if (!tab) return;
    sqlEditorBoundTabId = tab.id;
    var schema = buildSqlSchema();
    sqlEditorView = new EditorView({
      doc: tab.sql || "",
      extensions: [
        basicSetup,
        oneDark,
        sql({ dialect: PostgreSQL, schema: schema }),
        EditorView.theme({
          "&": { height: "100%", minHeight: "220px" },
          ".cm-scroller": { overflow: "auto" },
        }),
        EditorView.updateListener.of(function (update) {
          if (!update.docChanged) return;
          var tid = sqlEditorBoundTabId;
          var ct = state.tabs.find(function (x) {
            return x.id === tid && x.type === "console";
          });
          if (ct) ct.sql = update.state.doc.toString();
        }),
        EditorView.domEventHandlers({
          keydown: function (e) {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
              e.preventDefault();
              syncSqlFromEditor();
              runSql(state.activeTabId);
              return true;
            }
          },
        }),
      ],
      parent: host,
    });
  }

  function render() {
    var root = document.getElementById("app");
    if (!root) return;

    hideCellTooltip();
    tearDownSqlEditor();

    if (!state.hasAccess) {
      root.innerHTML =
        '<div class="overlay" id="pwd-overlay">' +
        '<div class="modal">' +
        "<h2>请输入访问密码</h2>" +
        '<div class="form-row">' +
        '<input type="password" class="input" id="pwd-input" placeholder="访问密码" autocomplete="off" />' +
        (state.accessError ? '<p class="msg msg-error" style="margin:8px 0 0">' + escapeHtml(state.accessError) + "</p>" : "") +
        "</div>" +
        '<div class="modal-actions">' +
        '<button type="button" class="btn btn-primary" id="pwd-submit">确认</button>' +
        "</div>" +
        "</div>" +
        "</div>";
      bindPasswordHandlers();
      return;
    }

    var parts = [];
    parts.push('<div class="page">');

    if (state.customModalOpen) {
      parts.push(
        '<div class="overlay" id="custom-overlay">' +
          '<div class="modal">' +
          "<h2>自定义数据库连接</h2>" +
          '<div class="form-row"><label>主机 / IP</label><input class="input" id="cf-host" autocomplete="off" /></div>' +
          '<div class="form-row"><label>端口</label><input class="input" id="cf-port" type="number" /></div>' +
          '<div class="form-row"><label>数据库名</label><input class="input" id="cf-db" autocomplete="off" /></div>' +
          '<div class="form-row"><label>用户名</label><input class="input" id="cf-user" autocomplete="off" /></div>' +
          '<div class="form-row"><label>密码</label><input class="input" id="cf-pass" type="password" autocomplete="off" /></div>' +
          '<div class="modal-actions">' +
          '<button type="button" class="btn" id="cf-cancel">取消</button>' +
          '<button type="button" class="btn btn-primary" id="cf-ok">' +
          (state.connecting ? "连接中…" : "连接") +
          "</button>" +
          "</div>" +
          "</div>" +
          "</div>"
      );
    }

    parts.push('<div class="topbar">');
    parts.push('<div class="dropdown-wrap">');
    parts.push(
      '<button type="button" class="env-btn' +
        (state.connInfo ? " connected" : "") +
        '" id="env-btn" ' +
        (state.connecting ? " disabled" : "") +
        ">🗄 " +
        (state.connecting
          ? "连接中…"
          : state.connInfo && state.activeEnv
        ? escapeHtml(ENV_LABELS[state.activeEnv] + " · " + state.connInfo.host + ":" + state.connInfo.port)
        : "选择环境") +
        " ▾</button>"
    );
    if (state.dropdownOpen) {
      parts.push('<div class="dropdown-panel" id="env-dropdown">');
      ["test", "prod", "craftTest", "craftProd", "apeTest", "apeProd"].forEach(function (k) {
        var p = PRESETS[k];
        parts.push(
          '<button type="button" class="dropdown-item" data-env="' +
            k +
            '">' +
            '<span style="color:' +
            ENV_COLORS[k] +
            ';font-weight:600">' +
            escapeHtml(ENV_LABELS[k]) +
            "</span>" +
            "<small>" +
            escapeHtml(p.host + ":" + p.port + "/" + p.database) +
            "</small></button>"
        );
      });
      parts.push(
        '<button type="button" class="dropdown-item" data-env="custom"><span style="color:' +
          ENV_COLORS.custom +
          ';font-weight:600">custom</span><small>自定义连接…</small></button>'
      );
      parts.push("</div>");
    }
    parts.push("</div>");

    if (state.connInfo && state.activeEnv) {
      var tagClass =
        state.activeEnv === "prod" || state.activeEnv === "apeProd" || state.activeEnv === "craftProd"
          ? "tag-red"
          : state.activeEnv === "custom"
          ? "tag-purple"
          : "tag-green";
      parts.push(
        '<span class="tag ' +
          tagClass +
          '">' +
          escapeHtml(ENV_LABELS[state.activeEnv] + " · " + state.connInfo.database) +
          "</span>"
      );
    }

    parts.push('<div class="topbar-spacer"></div><span class="brand">DB Console</span>');
    if (state.toast) {
      var tc = state.toast.kind === "error" ? "msg-error" : state.toast.kind === "success" ? "msg-success" : "msg-info";
      parts.push(
        '<div class="msg ' +
          tc +
          '" id="toast-msg" style="position:absolute;top:52px;right:16px;z-index:40;display:flex;align-items:flex-start;max-width:70vw">' +
          '<div class="toast-text" id="toast-text">' +
          escapeHtml(state.toast.msg) +
          "</div>" +
          '<button type="button" class="toast-copy-btn" id="toast-copy-btn" title="一键复制">复制</button>' +
          "</div>"
      );
    }
    parts.push("</div>");

    parts.push('<div class="body">');
    parts.push('<div class="sidebar">');
    parts.push('<div class="sidebar-header"><span>Tables</span>');
    if (state.connInfo) {
      parts.push(
        '<button type="button" style="border:none;background:none;color:#8b949e;cursor:pointer" id="btn-refresh-tables" title="刷新">' +
          (state.tablesLoading ? "…" : "↻") +
          "</button>"
      );
    }
    parts.push("</div>");
    parts.push('<div class="sidebar-search">');
    parts.push(
      '<input class="input" style="font-size:12px;padding:4px 8px" placeholder="搜索表名…" id="table-filter" value="' +
        escapeHtml(state.tableFilter) +
        '" />'
    );
    parts.push("</div>");
    parts.push('<div class="sidebar-list" id="sidebar-tables">');
    if (!state.connInfo) {
      parts.push('<div class="empty-hint">请先连接数据库</div>');
    } else {
      var kw = state.tableFilter.trim().toLowerCase();
      var list = state.tables.filter(function (t) {
        if (!kw) return true;
        return (
          t.schema.toLowerCase().indexOf(kw) >= 0 ||
          t.table.toLowerCase().indexOf(kw) >= 0 ||
          (t.schema + "." + t.table).toLowerCase().indexOf(kw) >= 0
        );
      });
      list.forEach(function (t) {
        var tid = tableTabId(t.schema, t.table);
        var active = state.activeTabId === tid;
        parts.push(
          '<div class="table-item' +
            (active ? " active" : "") +
            '" data-schema="' +
            escapeHtml(t.schema) +
            '" data-table="' +
            escapeHtml(t.table) +
            '">' +
            escapeHtml(t.schema + "." + t.table) +
            "</div>"
        );
      });
      if (list.length === 0) {
        parts.push('<div class="empty-hint">无匹配表</div>');
      }
    }
    parts.push("</div></div>");

    parts.push('<div class="main-area">');
    parts.push('<div class="card">');
    parts.push('<div class="tab-bar">');
    state.tabs.forEach(function (tab) {
      var active = tab.id === state.activeTabId;
      parts.push(
        '<div class="tab' +
          (active ? " active" : "") +
          '" data-tab-id="' +
          escapeHtml(tab.id) +
          '" role="button" tabindex="0">' +
          '<span class="tab-title">' +
          escapeHtml(tab.title) +
          '</span>' +
          '<button type="button" class="tab-close" data-close-tab="' +
          escapeHtml(tab.id) +
          '" title="关闭">×</button></div>'
      );
    });
    parts.push('<button type="button" class="tab-add" id="btn-new-console">+ Console</button>');
    parts.push("</div>");

    parts.push('<div class="tab-body">');
    var activeTab = state.tabs.find(function (t) {
      return t.id === state.activeTabId;
    });
    if (activeTab && activeTab.type === "console") {
      parts.push('<div class="sql-editor-host" id="sql-editor-host"></div>');
      parts.push(
        '<p class="sql-editor-hint">PostgreSQL 高亮与补全（Ctrl+Space）；有选区时 Ctrl+Enter / Run 仅执行选中 SQL，无选区则执行全文</p>'
      );
      parts.push('<div class="toolbar">');
      parts.push(
        '<button type="button" class="btn btn-primary" id="btn-run-sql" ' +
          (activeTab.loading ? " disabled" : "") +
          ">Run</button>"
      );
      if (activeTab.loading) parts.push('<span style="color:#8b949e;font-size:12px">执行中…</span>');
      parts.push("</div>");
      if (activeTab.result) {
        if (activeTab.result.type === "query") {
          parts.push('<div class="data-table-wrap"><table class="data-table"><thead><tr>');
          activeTab.result.columns.forEach(function (c) {
            parts.push("<th>" + escapeHtml(c) + "</th>");
          });
          parts.push("</tr></thead><tbody>");
          activeTab.result.rows.forEach(function (row) {
            parts.push("<tr>");
            row.forEach(function (cell) {
              parts.push(renderDataCell(cell));
            });
            parts.push("</tr>");
          });
          parts.push("</tbody></table></div>");
          if (activeTab.result.truncated) {
            parts.push('<p style="color:#f78166;font-size:12px">结果已截断</p>');
          }
        } else {
          parts.push(
            '<p class="msg msg-info" style="margin:0">' +
              escapeHtml(activeTab.result.command + " · 影响行数: " + activeTab.result.rowCount) +
              "</p>"
          );
          if (activeTab.result.raw) {
            parts.push('<pre style="font-size:11px;color:#8b949e;margin:8px 0 0">' + escapeHtml(activeTab.result.raw) + "</pre>");
          }
        }
      }
    } else if (activeTab && activeTab.type === "table") {
      if (activeTab.loading && !activeTab.tableData) {
        parts.push('<p style="color:#8b949e">加载中…</p>');
      } else if (!activeTab.tableData) {
        parts.push('<p style="color:#8b949e">无数据</p>');
      } else {
        var td = activeTab.tableData;
        parts.push(
          '<div class="data-table-wrap' +
            (activeTab.refreshing ? " is-refreshing" : "") +
            '"><table class="data-table"><thead><tr>'
        );
        td.columns.forEach(function (col) {
          parts.push(
            "<th>" +
              '<div style="font-weight:600">' +
              escapeHtml(col) +
              "</div>" +
              '<input type="text" class="filter-input" data-filter-col="' +
              escapeHtml(col) +
              '" placeholder="筛选…" value="' +
              escapeHtml((activeTab.columnFilters && activeTab.columnFilters[col]) || "") +
              '" />' +
              "</th>"
          );
        });
        parts.push("</tr></thead><tbody>");
        td.rows.forEach(function (row) {
          parts.push("<tr>");
          row.forEach(function (cell) {
            parts.push(renderDataCell(cell));
          });
          parts.push("</tr>");
        });
        parts.push("</tbody></table></div>");
        var totalPages = Math.max(1, Math.ceil(td.total / td.page_size));
        parts.push('<div class="pagination">');
        parts.push(
          "<span>共 " +
            td.total +
            " 行 · 第 " +
            td.page +
            " / " +
            totalPages +
            " 页</span>"
        );
        parts.push(tablePageSizeSelectHtml(td.page_size));
        parts.push(
          '<button type="button" class="btn" id="page-prev" ' +
            (td.page <= 1 ? " disabled" : "") +
            ">上一页</button>"
        );
        parts.push(
          '<button type="button" class="btn" id="page-next" ' +
            (td.page >= totalPages ? " disabled" : "") +
            ">下一页</button>"
        );
        parts.push("</div>");
      }
    }
    parts.push("</div></div></div></div></div>");

    root.innerHTML = parts.join("");
    bindMainHandlers();
    mountSqlEditorIfNeeded();
  }

  function bindPasswordHandlers() {
    var el = document.getElementById("pwd-input");
    if (el) el.focus();
    var submit = function () {
      var inp = document.getElementById("pwd-input");
      var v = inp ? inp.value : "";
      if (v === ACCESS_PASSWORD) {
        state.hasAccess = true;
        state.accessError = null;
        render();
      } else {
        state.accessError = "访问密码错误";
        render();
      }
    };
    var btn = document.getElementById("pwd-submit");
    if (btn) btn.onclick = submit;
    var inp2 = document.getElementById("pwd-input");
    if (inp2) {
      inp2.onkeydown = function (e) {
        if (e.key === "Enter") submit();
      };
    }
  }

  function bindMainHandlers() {
    var toastCopyBtn = document.getElementById("toast-copy-btn");
    if (toastCopyBtn) {
      toastCopyBtn.onclick = function (e) {
        e.stopPropagation();
        e.preventDefault();
        var text = state.toast && state.toast.msg ? String(state.toast.msg) : "";
        var doFallback = function () {
          var ta = document.createElement("textarea");
          ta.value = text;
          ta.setAttribute("readonly", "true");
          ta.style.position = "fixed";
          ta.style.left = "-9999px";
          ta.style.top = "0";
          document.body.appendChild(ta);
          ta.focus();
          ta.select();
          try {
            document.execCommand("copy");
          } catch (err) {}
          document.body.removeChild(ta);
        };
        var copyOk = function () {
          toastCopyBtn.textContent = "已复制";
          toastCopyBtn.disabled = true;
          setTimeout(function () {
            toastCopyBtn.textContent = "复制";
            toastCopyBtn.disabled = false;
          }, 1000);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard
            .writeText(text)
            .then(function () {
              copyOk();
            })
            .catch(function () {
              doFallback();
              copyOk();
            });
        } else {
          doFallback();
          copyOk();
        }
      };
    }

    document.getElementById("env-btn") &&
      (document.getElementById("env-btn").onclick = function (e) {
        e.stopPropagation();
        if (state.connecting) return;
        state.dropdownOpen = !state.dropdownOpen;
        render();
      });

    document.querySelectorAll(".dropdown-item").forEach(function (btn) {
      btn.onclick = function () {
        var env = btn.getAttribute("data-env");
        state.dropdownOpen = false;
        render();
        if (env === "custom") {
          state.customModalOpen = true;
          render();
          return;
        }
        if (PRESETS[env]) {
          doConnect(PRESETS[env], env);
        }
      };
    });

    if (state.customModalOpen) {
      var ch = document.getElementById("cf-host");
      var cp = document.getElementById("cf-port");
      var cd = document.getElementById("cf-db");
      var cu = document.getElementById("cf-user");
      var cpass = document.getElementById("cf-pass");
      if (ch) ch.value = state.customForm.host || "";
      if (cp) cp.value = state.customForm.port != null ? String(state.customForm.port) : "5432";
      if (cd) cd.value = state.customForm.database || "";
      if (cu) cu.value = state.customForm.username || "";
      if (cpass) cpass.value = state.customForm.password || "";
    }

    document.getElementById("cf-cancel") &&
      (document.getElementById("cf-cancel").onclick = function () {
        state.customModalOpen = false;
        render();
      });
    document.getElementById("cf-ok") &&
      (document.getElementById("cf-ok").onclick = function () {
        var host = document.getElementById("cf-host");
        var port = document.getElementById("cf-port");
        var db = document.getElementById("cf-db");
        var user = document.getElementById("cf-user");
        var pass = document.getElementById("cf-pass");
        var info = {
          host: host && host.value.trim(),
          port: port ? parseInt(port.value, 10) || 5432 : 5432,
          database: db && db.value.trim(),
          username: user && user.value.trim(),
          password: pass && pass.value,
        };
        if (!info.host || !info.database || !info.username) {
          showToast("请填写完整连接信息", "error");
          return;
        }
        state.customForm = info;
        state.customModalOpen = false;
        render();
        doConnect(info, "custom");
      });

    document.getElementById("custom-overlay") &&
      (document.getElementById("custom-overlay").onclick = function (e) {
        if (e.target.id === "custom-overlay") {
          state.customModalOpen = false;
          render();
        }
      });

    document.getElementById("btn-refresh-tables") &&
      (document.getElementById("btn-refresh-tables").onclick = function () {
        if (state.connInfo) loadTables(state.connInfo);
      });

    var tf = document.getElementById("table-filter");
    if (tf) {
      tf.oninput = function () {
        state.tableFilter = tf.value;
        render();
      };
    }

    document.querySelectorAll(".table-item").forEach(function (el) {
      el.onclick = function () {
        var schema = el.getAttribute("data-schema");
        var table = el.getAttribute("data-table");
        selectTable(schema, table);
      };
    });

    document.querySelectorAll(".tab[data-tab-id]").forEach(function (btn) {
      btn.onclick = function (e) {
        if (e.target.closest && e.target.closest(".tab-close")) return;
        state.activeTabId = btn.getAttribute("data-tab-id");
        render();
      };
      btn.onkeydown = function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (!e.target.closest || !e.target.closest(".tab-close")) {
            state.activeTabId = btn.getAttribute("data-tab-id");
            render();
          }
        }
      };
    });

    document.querySelectorAll(".tab-close").forEach(function (btn) {
      btn.onclick = function (e) {
        e.stopPropagation();
        var id = btn.getAttribute("data-close-tab");
        closeTab(id);
      };
    });

    document.getElementById("btn-new-console") &&
      (document.getElementById("btn-new-console").onclick = function () {
        var n = state.tabs.filter(function (t) {
          return t.type === "console";
        }).length;
        var newId = "console-" + (n + 1);
        state.tabs.push({
          type: "console",
          id: newId,
          title: "Console " + (n + 1),
          sql: "",
          loading: false,
          result: null,
        });
        state.activeTabId = newId;
        render();
      });

    document.getElementById("btn-run-sql") &&
      (document.getElementById("btn-run-sql").onclick = function () {
        runSql(state.activeTabId);
      });

    document.querySelectorAll(".filter-input").forEach(function (inp) {
      inp.oninput = function () {
        var col = inp.getAttribute("data-filter-col");
        var tab = state.tabs.find(function (t) {
          return t.id === state.activeTabId && t.type === "table";
        });
        if (!tab) return;
        if (!tab.columnFilters) tab.columnFilters = {};
        tab.columnFilters[col] = inp.value;
        var tid = tab.id;
        if (state.filterDebounceTimers[tid]) clearTimeout(state.filterDebounceTimers[tid]);
        state.filterDebounceTimers[tid] = setTimeout(function () {
          var ps =
            (tab.tableData && tab.tableData.page_size) || tab.pageSize || 50;
          loadTableData(tab.id, tab.schema, tab.table, tab.columnFilters, 1, ps);
        }, 400);
      };
    });

    document.getElementById("page-prev") &&
      (document.getElementById("page-prev").onclick = function () {
        var tab = state.tabs.find(function (t) {
          return t.id === state.activeTabId && t.type === "table";
        });
        if (!tab || !tab.tableData) return;
        var p = tab.tableData.page - 1;
        if (p < 1) return;
        var psPrev =
          (tab.tableData && tab.tableData.page_size) || tab.pageSize || 50;
        loadTableData(tab.id, tab.schema, tab.table, tab.columnFilters || {}, p, psPrev);
      });
    document.getElementById("page-next") &&
      (document.getElementById("page-next").onclick = function () {
        var tab = state.tabs.find(function (t) {
          return t.id === state.activeTabId && t.type === "table";
        });
        if (!tab || !tab.tableData) return;
        var totalPages = Math.ceil(tab.tableData.total / tab.tableData.page_size);
        var p = tab.tableData.page + 1;
        if (p > totalPages) return;
        var psNext =
          (tab.tableData && tab.tableData.page_size) || tab.pageSize || 50;
        loadTableData(tab.id, tab.schema, tab.table, tab.columnFilters || {}, p, psNext);
      });

    var pageSizeSel = document.getElementById("page-size-select");
    if (pageSizeSel) {
      pageSizeSel.onchange = function () {
        var tab = state.tabs.find(function (t) {
          return t.id === state.activeTabId && t.type === "table";
        });
        if (!tab || !tab.tableData) return;
        var sz = parseInt(pageSizeSel.value, 10);
        if (!sz || sz < 1 || sz > 1000) return;
        tab.pageSize = sz;
        loadTableData(tab.id, tab.schema, tab.table, tab.columnFilters || {}, 1, sz);
      };
    }

    bindCellTooltipDelegation();
  }

  function doConnect(info, env) {
    state.connecting = true;
    render();
    apiPost("test-connection", info)
      .then(function (res) {
        if (res.code === 200) {
          state.connInfo = info;
          state.activeEnv = env;
          showToast(res.message || "连接成功", "success");
          return loadTables(info);
        } else {
          showToast(res.message || "连接失败", "error");
        }
      })
      .catch(function (e) {
        showToast(e.message || "连接失败", "error");
      })
      .finally(function () {
        state.connecting = false;
        render();
      });
  }

  function loadTables(info) {
    state.tablesLoading = true;
    render();
    return apiPost("tables", info)
      .then(function (res) {
        if (res.code === 200) {
          state.tables = res.data || [];
        } else {
          showToast(res.message || "获取表列表失败", "error");
        }
      })
      .catch(function (e) {
        showToast(e.message || "获取表列表失败", "error");
      })
      .finally(function () {
        state.tablesLoading = false;
        render();
      });
  }

  function selectTable(schema, table) {
    var tid = tableTabId(schema, table);
    var existing = state.tabs.find(function (t) {
      return t.id === tid;
    });
    if (existing) {
      state.activeTabId = tid;
      render();
      return;
    }
    state.tabs.push({
      type: "table",
      id: tid,
      title: schema + "." + table,
      schema: schema,
      table: table,
      tableData: null,
      loading: true,
      refreshing: false,
      columnFilters: {},
      pageSize: 50,
    });
    state.activeTabId = tid;
    render();
    loadTableData(tid, schema, table, {}, 1, 50);
  }

  function loadTableData(tabId, schema, table, filters, page, pageSize) {
    if (!state.connInfo) return;
    var tab = state.tabs.find(function (t) {
      return t.id === tabId;
    });
    if (tab) {
      if (!tab.tableData) tab.loading = true;
      else tab.refreshing = true;
    }
    render();

    var body = Object.assign({}, state.connInfo, {
      schema: schema,
      table: table,
      page: page || 1,
      page_size: pageSize || 50,
    });
    var ft = {};
    if (filters) {
      Object.keys(filters).forEach(function (k) {
        if (filters[k] != null && String(filters[k]).trim() !== "") {
          ft[k] = String(filters[k]).trim();
        }
      });
    }
    if (Object.keys(ft).length) body.filters = ft;

    apiPost("table-data", body)
      .then(function (res) {
        var t = state.tabs.find(function (x) {
          return x.id === tabId;
        });
        if (res.code === 200 && t) {
          t.tableData = res.data;
          if (res.data && res.data.page_size != null) {
            t.pageSize = res.data.page_size;
          }
          t.loading = false;
          t.refreshing = false;
        } else {
          if (t) {
            t.loading = false;
            t.refreshing = false;
          }
          showToast(res.message || "加载失败", "error");
        }
      })
      .catch(function (e) {
        var t = state.tabs.find(function (x) {
          return x.id === tabId;
        });
        if (t) {
          t.loading = false;
          t.refreshing = false;
        }
        showToast(e.message || "加载失败", "error");
      })
      .finally(function () {
        render();
      });
  }

  function runSql(tabId) {
    syncSqlFromEditor();
    var tab = state.tabs.find(function (t) {
      return t.id === tabId && t.type === "console";
    });
    var sqlToRun = getConsoleSqlToExecute();
    if (!tab || !sqlToRun) {
      showToast("请输入 SQL，或选中要执行的片段", "error");
      return;
    }
    if (!state.connInfo) {
      showToast("请先连接数据库", "error");
      return;
    }

    var exec = function () {
      tab.loading = true;
      tab.result = null;
      render();
      apiPost("execute", Object.assign({}, state.connInfo, { sql: sqlToRun, max_rows: 1000 }))
        .then(function (res) {
          if (res.code === 200) {
            tab.result = res.data;
          } else {
            showToast(res.message || "执行失败", "error");
          }
        })
        .catch(function (e) {
          showToast(e.message || "执行失败", "error");
        })
        .finally(function () {
          tab.loading = false;
          render();
        });
    };

    if (HIGH_RISK_SQL.test(sqlToRun)) {
      if (!confirm("检测到可能包含 DROP/TRUNCATE 等高危语句，确认在测试环境执行？")) return;
    }
    exec();
  }

  function closeTab(id) {
    if (state.tabs.length <= 1) {
      showToast("至少保留一个标签", "error");
      return;
    }
    state.tabs = state.tabs.filter(function (t) {
      return t.id !== id;
    });
    if (state.activeTabId === id) {
      state.activeTabId = state.tabs[state.tabs.length - 1].id;
    }
    render();
  }

  render();
