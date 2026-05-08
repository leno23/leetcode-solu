#!/usr/bin/env python3
"""
Fetch recent AI consulting headlines (Google News RSS), format a Chinese summary,
and open a GitHub issue. Intended for scheduled CI (GITHUB_TOKEN) or local runs (GH_TOKEN).
"""
from __future__ import annotations

import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

OWNER = "leno23"
REPO = "leetcode-solu"
RSS_QUERY = "AI consulting enterprise transformation OR AI advisory McKinsey Deloitte"
MAX_ITEMS = 5


def utc_today() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")


def github_request(method: str, url: str, token: str, data: dict | None = None) -> tuple[int, dict | list | None]:
    body = json.dumps(data).encode() if data is not None else None
    req = urllib.request.Request(
        url,
        data=body,
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "Content-Type": "application/json",
        },
        method=method,
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        raw = resp.read().decode()
        return resp.status, json.loads(raw) if raw else None


def issue_exists_for_date(token: str, date_str: str) -> bool:
    """Avoid duplicate daily issues if workflow retries or overlaps."""
    want = f"Daily AI Consulting News - {date_str}"
    page = 1
    while page <= 5:
        url = (
            f"https://api.github.com/repos/{OWNER}/{REPO}/issues"
            f"?state=all&per_page=100&page={page}&sort=created&direction=desc"
        )
        req = urllib.request.Request(
            url,
            headers={
                "Authorization": f"Bearer {token}",
                "Accept": "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
            },
            method="GET",
        )
        with urllib.request.urlopen(req, timeout=30) as resp:
            issues = json.loads(resp.read().decode())
        if not issues:
            break
        for issue in issues:
            if issue.get("title") == want:
                return True
        page += 1
    return False


def fetch_google_news_rss() -> list[dict[str, str]]:
    params = urllib.parse.urlencode(
        {"q": RSS_QUERY, "hl": "en", "gl": "US", "ceid": "US:en"}
    )
    url = f"https://news.google.com/rss/search?{params}"
    req = urllib.request.Request(url, headers={"User-Agent": "leetcode-solu-daily-news/1.0"})
    with urllib.request.urlopen(req, timeout=45) as resp:
        xml_data = resp.read()

    root = ET.fromstring(xml_data)
    channel = root.find("channel")
    if channel is None:
        return []

    items: list[dict[str, str]] = []
    for item in channel.findall("item"):
        title_el = item.find("title")
        link_el = item.find("link")
        pub_el = item.find("pubDate")
        desc_el = item.find("description")
        title = (title_el.text or "").strip() if title_el is not None else ""
        link = (link_el.text or "").strip() if link_el is not None else ""
        pub = (pub_el.text or "").strip() if pub_el is not None else ""
        desc = (desc_el.text or "").strip() if desc_el is not None else ""
        desc = re.sub(r"<[^>]+>", "", desc)
        desc = re.sub(r"\s+", " ", desc)[:400]
        if title and link:
            items.append({"title": title, "link": link, "pubDate": pub, "description": desc})
        if len(items) >= MAX_ITEMS:
            break
    return items


def build_issue_body(search_date: str, rows: list[dict[str, str]]) -> str:
    lines = [
        "## 搜索日期",
        "",
        f"**{search_date}**（UTC）",
        "",
        "---",
        "",
        "## 要闻速览",
        "",
        "以下为基于公开 RSS 聚合的 **AI 咨询 / 企业 AI 转型** 相关要闻摘要（标题多为英文原文，便于检索）。",
        "",
    ]
    if not rows:
        lines.extend(
            [
                "*本期未能拉取到 RSS 条目，请检查网络或稍后重试。*",
                "",
            ]
        )
    for i, row in enumerate(rows, start=1):
        lines.extend(
            [
                f"### {i}. {row['title']}",
                "",
                f"- **发布时间**：{row['pubDate'] or '—'}",
                f"- **简述**：{row['description'] or '（摘要暂无）'}",
                f"- **来源链接**：{row['link']}",
                "",
            ]
        )
    lines.extend(
        [
            "---",
            "",
            "## 说明",
            "",
            "*本 Issue 由仓库定时任务自动生成；摘要取自新闻聚合源，请以原文为准。*",
        ]
    )
    return "\n".join(lines)


def main() -> int:
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if not token:
        print("GITHUB_TOKEN or GH_TOKEN is required", file=sys.stderr)
        return 1

    date_str = utc_today()
    if issue_exists_for_date(token, date_str):
        print(f"Issue for {date_str} already exists; skipping.")
        return 0

    rows = fetch_google_news_rss()
    body = build_issue_body(date_str, rows)
    title = f"Daily AI Consulting News - {date_str}"

    api = f"https://api.github.com/repos/{OWNER}/{REPO}/issues"
    payload = {"title": title, "body": body}
    try:
        status, data = github_request("POST", api, token, payload)
        if status == 201 and isinstance(data, dict):
            print("Created:", data.get("html_url"))
            return 0
        print("Unexpected response:", status, data, file=sys.stderr)
        return 1
    except urllib.error.HTTPError as e:
        print(e.code, e.read().decode()[:4000], file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
