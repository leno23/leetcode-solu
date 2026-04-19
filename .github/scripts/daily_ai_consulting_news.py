#!/usr/bin/env python3
"""Fetch AI consulting headlines from Google News RSS and emit a Chinese issue body."""

from __future__ import annotations

import html
import os
import re
import sys
import urllib.request
from datetime import datetime, timedelta, timezone
from xml.etree import ElementTree as ET

RSS_URL = (
    "https://news.google.com/rss/search?"
    "q=AI+consulting+enterprise+strategy&hl=en-US&gl=US&ceid=US:en"
)
UA = "Mozilla/5.0 (compatible; leetcode-solu-daily-news/1.0)"


def _clean_description(raw: str | None, max_len: int = 400) -> str | None:
    if not raw:
        return None
    text = html.unescape(re.sub(r"<[^>]+>", " ", raw))
    text = re.sub(r"\s+", " ", text).strip()
    if not text:
        return None
    if len(text) > max_len:
        return text[: max_len - 1].rstrip() + "…"
    return text


def fetch_items(limit: int = 5) -> list[tuple[str, str, str | None]]:
    req = urllib.request.Request(RSS_URL, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=25) as r:
        root = ET.fromstring(r.read())
    out: list[tuple[str, str, str | None]] = []
    for item in root.findall(".//item"):
        if len(out) >= limit:
            break
        title_el = item.find("title")
        link_el = item.find("link")
        desc_el = item.find("description")
        title = (title_el.text or "").strip()
        link = (link_el.text or "").strip()
        blurb = _clean_description(desc_el.text if desc_el is not None else None)
        if title and link:
            out.append((title, link, blurb))
    return out


def main() -> None:
    # Optional override for workflow_dispatch / testing (ISO date YYYY-MM-DD)
    date_override = os.environ.get("NEWS_DATE")
    if date_override:
        display_date = date_override
    else:
        # Search date in Asia/Shanghai (matches 09:00 local cron intent)
        tz_sh = timezone(timedelta(hours=8))
        display_date = datetime.now(tz_sh).strftime("%Y-%m-%d")

    items = fetch_items(5)
    if not items:
        print("No RSS items retrieved.", file=sys.stderr)
        sys.exit(1)

    lines = [
        "## 检索信息",
        "",
        f"- **检索日期**：{display_date}",
        f"- **检索关键词**：AI consulting / enterprise strategy（Google News RSS）",
        "",
        "## 今日要点（摘要）",
        "",
        "以下为当日 RSS 中与人工智能咨询、企业采纳与战略相关的头条摘录；标题与链接来自资讯聚合源，原文以链接为准。",
        "",
    ]
    for i, (title, link, blurb) in enumerate(items, start=1):
        lines.append(f"### {i}. {title}")
        lines.append("")
        if blurb:
            redundant = blurb.casefold().startswith(title[: min(80, len(title))].casefold())
            if blurb.casefold() == title.casefold():
                redundant = True
            if not redundant:
                lines.append(f"- **简要说明**：{blurb}")
                lines.append("")
        lines.append(f"- **参考链接**：<{link}>")
        lines.append("")

    lines.extend(
        [
            "---",
            "",
            "*本 Issue 由仓库定时工作流自动生成；如需调整检索词或频次，请修改 `.github/workflows/daily-ai-consulting-news.yml` 与脚本。*",
            "",
        ]
    )

    print("\n".join(lines).rstrip() + "\n")


if __name__ == "__main__":
    main()
