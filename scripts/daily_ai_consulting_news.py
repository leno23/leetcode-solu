#!/usr/bin/env python3
"""Fetch AI consulting headlines from Google News RSS and print a Chinese issue body."""
from __future__ import annotations

import html
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

# 聚焦：咨询公司与 AI 厂商合作、企业 AI 转型资金与战略
RSS_QUERY = '("AI consulting" OR "generative AI" McKinsey OR Accenture OpenAI OR BCG AI OR Deloitte AI OR "consulting firms" enterprise AI)'
MAX_ITEMS = 20


def fetch_rss() -> str:
    q = urllib.parse.quote(RSS_QUERY)
    url = f"https://news.google.com/rss/search?q={q}&hl=zh-CN&gl=CN&ceid=CN:zh-Hans"
    req = urllib.request.Request(url, headers={"User-Agent": "leetcode-solu-daily-news/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8", errors="replace")


def strip_html(s: str) -> str:
    s = html.unescape(s)
    out: list[str] = []
    i, n = 0, len(s)
    while i < n:
        if s[i] == "<":
            j = s.find(">", i)
            i = j + 1 if j != -1 else n
            continue
        out.append(s[i])
        i += 1
    return "".join(out).strip()


def parse_items(xml_text: str) -> list[tuple[str, str]]:
    root = ET.fromstring(xml_text)
    channel = root.find("channel")
    if channel is None:
        return []
    items: list[tuple[str, str]] = []
    for item in channel.findall("item")[:MAX_ITEMS]:
        title_el = item.find("title")
        link_el = item.find("link")
        title = strip_html(title_el.text or "") if title_el is not None else ""
        link = (link_el.text or "").strip() if link_el is not None else ""
        if title:
            items.append((title, link))
    return items


def build_body(search_date: str, items: list[tuple[str, str]]) -> str:
    lines = [
        "## 检索日期",
        "",
        search_date,
        "",
        "## 今日 AI 咨询行业要点（摘要）",
        "",
        "以下为 **Google News RSS** 中与 AI 咨询、企业生成式 AI、头部咨询公司相关的报道标题与链接（自动抓取，供交叉参考）。",
        "",
    ]
    for i, (title, link) in enumerate(items[:5], 1):
        desc = title[:200] + ("…" if len(title) > 200 else "")
        lines.append(f"### {i}. {desc}")
        lines.append("")
        if link:
            lines.append(f"- 参考链接：{link}")
        lines.append("")
    if not items:
        lines.append("_（RSS 暂无可解析条目，请稍后重试或检查网络。）")
        lines.append("")
    lines.extend(
        [
            "---",
            "",
            "*本 issue 由定时工作流自动生成；正文为中文摘要，原始标题多为外文。*",
        ]
    )
    return "\n".join(lines)


def main() -> int:
    now = datetime.now(timezone.utc)
    search_date = now.strftime("%Y-%m-%d（UTC）")
    try:
        xml_text = fetch_rss()
        items = parse_items(xml_text)
    except Exception as e:
        body = "\n".join(
            [
                "## 检索日期",
                "",
                search_date,
                "",
                "## 获取新闻失败",
                "",
                f"错误：{e}",
                "",
                "请检查工作流网络或 RSS 可用性。",
            ]
        )
        print(body, end="")
        return 0
    body = build_body(search_date, items)
    print(body, end="")
    return 0


if __name__ == "__main__":
    sys.exit(main())
