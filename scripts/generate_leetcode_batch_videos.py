#!/usr/bin/env python3
"""Batch-generate Chinese LeetCode explainer videos.

Generates lightweight 1920x1080 MP4 videos for LeetCode problem ranges.
The script fetches problem metadata from LeetCode, uses Chinese narration, and
renders educational slides with subtitles, topic tags, idea diagrams, pseudocode,
and complexity notes. It prefers OpenAI TTS when OPENAI_API_KEY is available,
then falls back to edge-tts, then to silence so the pipeline remains runnable.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import math
import os
import re
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.request
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw, ImageFont

WIDTH = 1920
HEIGHT = 1080
FPS = 24
ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "assets" / "leetcode_batch"
OUTPUT_DIR = ROOT / "output"
CACHE_PATH = ASSET_DIR / "problems_cache.json"
BG = "#0F172A"
PANEL = "#111827"
PANEL_2 = "#1E293B"
TEXT = "#E5E7EB"
MUTED = "#94A3B8"
PRIMARY = "#38BDF8"
GREEN = "#22C55E"
YELLOW = "#FACC15"
RED = "#FB7185"
PURPLE = "#A78BFA"
ORANGE = "#FB923C"
CODE_BG = "#020617"

CN_TOPIC = {
    "Array": "数组",
    "String": "字符串",
    "Hash Table": "哈希表",
    "Dynamic Programming": "动态规划",
    "Math": "数学",
    "Sorting": "排序",
    "Greedy": "贪心",
    "Depth-First Search": "深度优先搜索",
    "Breadth-First Search": "广度优先搜索",
    "Binary Search": "二分查找",
    "Two Pointers": "双指针",
    "Sliding Window": "滑动窗口",
    "Stack": "栈",
    "Queue": "队列",
    "Heap (Priority Queue)": "堆 / 优先队列",
    "Linked List": "链表",
    "Tree": "树",
    "Binary Tree": "二叉树",
    "Backtracking": "回溯",
    "Recursion": "递归",
    "Divide and Conquer": "分治",
    "Graph": "图",
    "Trie": "字典树",
    "Bit Manipulation": "位运算",
    "Database": "数据库",
    "Design": "设计",
    "Monotonic Stack": "单调栈",
    "Prefix Sum": "前缀和",
}

TITLE_FALLBACK = {
    2: "两数相加",
    3: "无重复字符的最长子串",
    4: "寻找两个正序数组的中位数",
    5: "最长回文子串",
    6: "Z 字形变换",
    7: "整数反转",
    8: "字符串转换整数 (atoi)",
    9: "回文数",
    10: "正则表达式匹配",
}


@dataclass(frozen=True)
class Problem:
    number: int
    title: str
    translated_title: str
    slug: str
    difficulty: str
    topics: list[str]


@dataclass(frozen=True)
class Segment:
    title: str
    narration: str
    visual_type: str
    duration: float = 8.0
    data: dict[str, Any] = field(default_factory=dict)


def run(cmd: list[str], *, check: bool = True) -> subprocess.CompletedProcess[str]:
    result = subprocess.run(cmd, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if check and result.returncode != 0:
        raise RuntimeError(
            "命令执行失败：" + " ".join(cmd) + f"\nstdout:\n{result.stdout}\nstderr:\n{result.stderr}"
        )
    return result


def ensure_dependencies() -> None:
    missing = [name for name in ("ffmpeg", "ffprobe") if shutil.which(name) is None]
    if missing:
        raise RuntimeError("缺少依赖：" + ", ".join(missing) + "。请先安装 ffmpeg。")


def post_json(url: str, payload: dict[str, Any], referer: str | None = None) -> dict[str, Any]:
    headers = {"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"}
    if referer:
        headers["Referer"] = referer
    request = urllib.request.Request(url, data=json.dumps(payload).encode(), headers=headers)
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.loads(response.read().decode())


def slugify_title(title: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    return slug or "leetcode-problem"


def fetch_doocs_problem_list(max_number: int, min_number: int = 1) -> list[Problem]:
    problems: list[Problem] = []
    start_bucket = (min_number // 100) * 100
    end_bucket = (max_number // 100) * 100
    headers = {"User-Agent": "Mozilla/5.0", "Accept": "application/vnd.github+json"}
    for bucket in range(start_bucket, end_bucket + 1, 100):
        folder = f"{bucket:04d}-{bucket + 99:04d}"
        url = f"https://api.github.com/repos/doocs/leetcode/contents/solution/{folder}"
        request = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(request, timeout=30) as response:
            entries = json.loads(response.read().decode())
        for entry in entries:
            name = entry.get("name", "")
            match = re.match(r"^(\d{4})\.(.+)$", name)
            if not match:
                continue
            number = int(match.group(1))
            if not min_number <= number <= max_number:
                continue
            title = match.group(2).strip()
            translated_title = TITLE_FALLBACK.get(number, title)
            problems.append(
                Problem(
                    number=number,
                    title=title,
                    translated_title=translated_title,
                    slug=slugify_title(title),
                    difficulty="Medium",
                    topics=[],
                )
            )
    return sorted(problems, key=lambda problem: problem.number)


def merge_problem_cache(cached_by_number: dict[int, Problem], fetched: list[Problem], max_number: int) -> list[Problem]:
    merged = {number: problem for number, problem in cached_by_number.items() if 1 <= number <= max_number}
    for problem in fetched:
        merged[problem.number] = problem
    return [merged[number] for number in sorted(merged)]


def write_problem_cache(problems: list[Problem]) -> None:
    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    CACHE_PATH.write_text(json.dumps([p.__dict__ for p in problems], ensure_ascii=False, indent=2), encoding="utf-8")


def fetch_problem_list(max_number: int, min_number: int = 1) -> list[Problem]:
    cached_by_number: dict[int, Problem] = {}
    if CACHE_PATH.exists():
        data = json.loads(CACHE_PATH.read_text(encoding="utf-8"))
        cached = [Problem(**item) for item in data]
        cached_by_number = {problem.number: problem for problem in cached}
        if cached and max(problem.number for problem in cached) >= max_number:
            refreshed = False
            updated: list[Problem] = []
            for problem in cached:
                if min_number <= problem.number <= max_number and problem.translated_title == problem.title:
                    problem = Problem(
                        number=problem.number,
                        title=problem.title,
                        translated_title=fetch_translated_title(problem.slug, problem.number),
                        slug=problem.slug,
                        difficulty=problem.difficulty,
                        topics=problem.topics,
                    )
                    refreshed = True
                    time.sleep(0.08)
                updated.append(problem)
            if refreshed:
                write_problem_cache(updated)
            return updated

    if os.getenv("LEETCODE_METADATA_SOURCE") == "doocs":
        fallback = fetch_doocs_problem_list(max_number, min_number)
        if fallback:
            problems = merge_problem_cache(cached_by_number, fallback, max_number)
            write_problem_cache(problems)
            return problems

    query = """
    query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
      problemsetQuestionList: questionList(categorySlug: $categorySlug, limit: $limit, skip: $skip, filters: $filters) {
        questions: data { questionFrontendId title titleSlug difficulty topicTags { name slug } }
      }
    }
    """
    try:
        raw_questions: list[dict[str, Any]] = []
        skip = 0
        page_size = 100
        while True:
            payload = {
                "query": query,
                "variables": {"categorySlug": "all-code-essentials", "skip": skip, "limit": page_size, "filters": {}},
            }
            data = post_json("https://leetcode.com/graphql", payload)
            page = data["data"]["problemsetQuestionList"]["questions"]
            if not page:
                break
            raw_questions.extend(page)
            seen_numbers = [int(item["questionFrontendId"]) for item in raw_questions if item["questionFrontendId"].isdigit()]
            if seen_numbers and max(seen_numbers) >= max_number:
                break
            skip += page_size

        problems: list[Problem] = []
        for raw in raw_questions:
            number = int(raw["questionFrontendId"])
            if not 1 <= number <= max_number:
                continue
            cached_problem = cached_by_number.get(number)
            if cached_problem:
                translated_title = cached_problem.translated_title
            elif min_number <= number <= max_number:
                translated_title = fetch_translated_title(raw["titleSlug"], number)
            else:
                translated_title = TITLE_FALLBACK.get(number, raw["title"])
            topics = [CN_TOPIC.get(tag["name"], tag["name"]) for tag in raw.get("topicTags", [])[:4]]
            problems.append(
                Problem(
                    number=number,
                    title=raw["title"],
                    translated_title=translated_title,
                    slug=raw["titleSlug"],
                    difficulty=raw["difficulty"],
                    topics=topics,
                )
            )
            time.sleep(0.08)

        write_problem_cache(problems)
        return problems
    except Exception as exc:
        print(f"[METADATA] leetcode fetch failed: {exc}; fallback to doocs metadata", file=sys.stderr)
        fallback = fetch_doocs_problem_list(max_number, min_number)
        if fallback:
            problems = merge_problem_cache(cached_by_number, fallback, max_number)
            write_problem_cache(problems)
            return problems
        raise


def fetch_translated_title(slug: str, number: int) -> str:
    query = """
    query questionData($titleSlug: String!) {
      question(titleSlug: $titleSlug) { translatedTitle }
    }
    """
    payload = {"query": query, "variables": {"titleSlug": slug}}
    try:
        data = post_json("https://leetcode.cn/graphql/", payload, referer=f"https://leetcode.cn/problems/{slug}/")
        title = data.get("data", {}).get("question", {}).get("translatedTitle")
        return title or TITLE_FALLBACK.get(number, slug.replace("-", " ").title())
    except Exception:
        return TITLE_FALLBACK.get(number, slug.replace("-", " ").title())


def topic_sentence(problem: Problem) -> str:
    if not problem.topics:
        return "这题适合先从输入输出关系入手，再抽象出状态和转移。"
    first = problem.topics[0]
    if "链表" in problem.topics:
        return "这题的关键是把链表节点当成一位一位处理，注意进位和空节点。"
    if "滑动窗口" in problem.topics:
        return "核心是维护一个窗口，让右边界扩张，必要时移动左边界。"
    if "动态规划" in problem.topics:
        return "重点是定义状态，明确状态之间如何从小问题转移到大问题。"
    if "二分查找" in problem.topics:
        return "关键是找到可以二分的单调性，每次排除一半不可能的答案。"
    if "双指针" in problem.topics:
        return "可以用两个指针从不同方向或不同速度移动，减少重复枚举。"
    if "哈希表" in problem.topics:
        return "哈希表用来记录已经见过的信息，把查找从线性降到平均常数时间。"
    if "栈" in problem.topics or "单调栈" in problem.topics:
        return "栈适合处理最近相关的元素，单调栈还能快速找到左右边界。"
    if "回溯" in problem.topics:
        return "回溯的核心是做选择、递归探索、再撤销选择。"
    return f"这题主要围绕{first}展开，先抓住约束，再选择合适的数据结构。"


def pseudo_code(problem: Problem) -> str:
    topics = set(problem.topics)
    if problem.number == 2:
        return """carry = 0
while l1 or l2 or carry:
    total = val(l1) + val(l2) + carry
    append(total % 10)
    carry = total // 10
return dummy.next"""
    if "滑动窗口" in topics:
        return """left = 0
for right in range(n):
    add(nums[right])
    while window invalid:
        remove(nums[left])
        left += 1
    update answer"""
    if "动态规划" in topics:
        return """define dp state
initialize base cases
for state in order:
    dp[state] = transition(previous states)
return final answer"""
    if "二分查找" in topics:
        return """left, right = search range
while left <= right:
    mid = (left + right) // 2
    if condition(mid):
        shrink right side
    else:
        shrink left side
return answer"""
    if "回溯" in topics:
        return """def dfs(path, choices):
    if reach target:
        save path
        return
    for choice in choices:
        choose(choice)
        dfs(path, next_choices)
        undo(choice)"""
    if "栈" in topics or "单调栈" in topics:
        return """stack = []
for x in nums:
    while stack and should_pop(stack[-1], x):
        handle(stack.pop())
    stack.append(x)
return answer"""
    if "链表" in topics:
        return """dummy = ListNode(0)
cur = dummy
while node:
    process node
    cur.next = new_node
    cur = cur.next
return dummy.next"""
    if "哈希表" in topics:
        return """seen = {}
for item in items:
    key = build_key(item)
    if key in seen:
        update answer
    seen[key] = item
return answer"""
    return """read input and constraints
choose data structure
iterate through states
update answer carefully
return answer"""


def complexity(problem: Problem) -> tuple[str, str]:
    topics = set(problem.topics)
    if "动态规划" in topics:
        return "O(n) 到 O(n²)，取决于状态数量", "O(n) 或 O(n²)"
    if "二分查找" in topics:
        return "O(log n) 或 O(n log n)", "O(1)"
    if "回溯" in topics:
        return "指数级，取决于搜索树规模", "O(n) 递归栈"
    if "排序" in topics:
        return "O(n log n)", "O(n) 或 O(1)"
    return "通常 O(n) 或 O(n log n)", "通常 O(n) 以内"


def build_segments(problem: Problem) -> list[Segment]:
    cn_title = problem.translated_title
    topic_text = "、".join(problem.topics) if problem.topics else "基础数据结构"
    time_c, space_c = complexity(problem)
    return [
        Segment(
            title=f"LeetCode {problem.number}: {cn_title}",
            visual_type="title",
            duration=8,
            narration=f"大家好，这期我们看 LeetCode 第 {problem.number} 题：{cn_title}。英文题名是 {problem.title}。这题难度是 {problem.difficulty}，常见标签包括{topic_text}。",
        ),
        Segment(
            title="先抓住题目模型",
            visual_type="problem",
            duration=10,
            narration=f"做这道题时，先别急着写代码。我们要先看清输入是什么，输出要什么，以及哪些约束会影响算法选择。{topic_sentence(problem)}",
        ),
        Segment(
            title="直观想法",
            visual_type="idea",
            duration=9,
            narration="最直接的想法通常是模拟题意，枚举所有可能情况。这样容易验证正确性，但也要马上观察有没有重复计算，能不能用状态、指针或数据结构把它压缩掉。",
        ),
        Segment(
            title="优化思路",
            visual_type="flow",
            duration=11,
            narration=f"优化的关键，是把题目抽象成{topic_text}相关的模式。每一步只保留对后续有用的信息，丢掉无关细节，这样代码会更短，也更不容易写错。",
        ),
        Segment(
            title="伪代码框架",
            visual_type="code",
            duration=12,
            narration="落到代码上，可以先写出这个框架。真正刷题时，再把变量名和边界条件补完整。重点是保证每次循环都在推进，并且答案只在合法状态下更新。",
            data={"code": pseudo_code(problem)},
        ),
        Segment(
            title="复杂度与总结",
            visual_type="summary",
            duration=10,
            narration=f"复杂度方面，这类解法的时间复杂度{time_c}，空间复杂度{space_c}。最后记住：先识别题型，再确定状态或数据结构，最后处理边界条件。",
        ),
    ]


def find_font() -> str | None:
    for path in [
        "/System/Library/Fonts/PingFang.ttc",
        "/System/Library/Fonts/STHeiti Light.ttc",
        "/Library/Fonts/Arial Unicode.ttf",
        "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
        "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]:
        if Path(path).exists():
            return path
    return None


FONT_PATH = find_font()


def font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    if FONT_PATH:
        return ImageFont.truetype(FONT_PATH, size=size, index=0)
    return ImageFont.load_default()


def text_size(draw: ImageDraw.ImageDraw, text: str, text_font: ImageFont.ImageFont) -> tuple[int, int]:
    box = draw.textbbox((0, 0), text, font=text_font)
    return box[2] - box[0], box[3] - box[1]


def wrap_text(draw: ImageDraw.ImageDraw, text: str, text_font: ImageFont.ImageFont, max_width: int) -> list[str]:
    lines: list[str] = []
    for paragraph in text.split("\n"):
        current = ""
        for char in paragraph:
            trial = current + char
            if text_size(draw, trial, text_font)[0] <= max_width:
                current = trial
            else:
                if current:
                    lines.append(current)
                current = char
        if current:
            lines.append(current)
    return lines


def draw_center(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, text_font: ImageFont.ImageFont, fill: str) -> None:
    w, h = text_size(draw, text, text_font)
    draw.text((xy[0] - w / 2, xy[1] - h / 2), text, font=text_font, fill=fill)


def rounded(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], fill: str, outline: str = "#334155", width: int = 2) -> None:
    draw.rounded_rectangle(box, radius=28, fill=fill, outline=outline, width=width)


def base_canvas(segment: Segment, problem: Problem) -> tuple[Image.Image, ImageDraw.ImageDraw]:
    image = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(image)
    for i in range(0, WIDTH, 120):
        draw.line((i, 0, i - 420, HEIGHT), fill="#13213A", width=1)
    draw.rectangle((0, 0, WIDTH, 112), fill="#020617")
    draw.text((70, 34), segment.title, font=font(40), fill=PRIMARY)
    draw.text((1540, 42), f"#{problem.number:03d} {problem.difficulty}", font=font(30), fill=MUTED)
    return image, draw


def draw_subtitle(draw: ImageDraw.ImageDraw, narration: str) -> None:
    sub_font = font(32)
    lines = wrap_text(draw, narration, sub_font, 1640)
    if len(lines) > 2:
        lines = lines[:2]
        lines[-1] = lines[-1].rstrip("，。") + "……"
    y0 = HEIGHT - 185
    rounded(draw, (140, y0, WIDTH - 140, HEIGHT - 34), "#020617", "#334155")
    y = y0 + 38
    for line in lines:
        draw_center(draw, (WIDTH // 2, y + 18), line, sub_font, "#F8FAFC")
        y += 50


def draw_tags(draw: ImageDraw.ImageDraw, tags: list[str], x: int, y: int) -> None:
    cur_x = x
    for tag in tags[:5]:
        tw, _ = text_size(draw, tag, font(28))
        rounded(draw, (cur_x, y, cur_x + tw + 46, y + 58), "#172554", PRIMARY, 2)
        draw.text((cur_x + 23, y + 13), tag, font=font(28), fill="#DBEAFE")
        cur_x += tw + 66


def draw_code(draw: ImageDraw.ImageDraw, code: str, x: int, y: int, w: int, h: int) -> None:
    rounded(draw, (x, y, x + w, y + h), CODE_BG, "#334155", 3)
    yy = y + 36
    for idx, line in enumerate(code.splitlines(), start=1):
        draw.text((x + 34, yy), f"{idx:>2}", font=font(24), fill="#64748B")
        draw.text((x + 90, yy), line, font=font(34), fill=YELLOW if idx == 1 else TEXT)
        yy += 54


def render_slide(problem: Problem, segment: Segment, out_path: Path) -> None:
    image, draw = base_canvas(segment, problem)
    if segment.visual_type == "title":
        draw_center(draw, (WIDTH // 2, 330), problem.translated_title, font(76), "#F8FAFC")
        draw_center(draw, (WIDTH // 2, 430), problem.title, font(42), PRIMARY)
        draw_tags(draw, problem.topics, 300, 545)
        draw_center(draw, (WIDTH // 2, 700), "题型识别 → 思路拆解 → 代码框架 → 复杂度", font(44), YELLOW)
    elif segment.visual_type == "problem":
        draw_center(draw, (WIDTH // 2, 210), "读题时先问三个问题", font(56), "#F8FAFC")
        cards = [("输入是什么？", PRIMARY), ("输出要什么？", GREEN), ("约束卡在哪？", YELLOW)]
        for i, (label, color) in enumerate(cards):
            x = 210 + i * 520
            rounded(draw, (x, 350, x + 460, 560), PANEL, color, 4)
            draw_center(draw, (x + 230, 455), label, font(42), color)
        draw_center(draw, (WIDTH // 2, 700), topic_sentence(problem), font(38), TEXT)
    elif segment.visual_type == "idea":
        draw_center(draw, (WIDTH // 2, 220), "先写暴力，再找重复", font(56), "#F8FAFC")
        rounded(draw, (250, 360, 780, 600), PANEL, RED, 4)
        rounded(draw, (1140, 360, 1670, 600), PANEL, GREEN, 4)
        draw_center(draw, (515, 450), "枚举 / 模拟", font(44), RED)
        draw_center(draw, (1405, 450), "状态压缩", font(44), GREEN)
        draw.line((820, 480, 1090, 480), fill=YELLOW, width=8)
        draw.polygon([(1090, 480), (1048, 452), (1048, 508)], fill=YELLOW)
        draw_center(draw, (WIDTH // 2, 730), "优化来自：少枚举、少回头、少重复计算", font(44), YELLOW)
    elif segment.visual_type == "flow":
        steps = ["识别题型", "维护关键信息", "推进状态", "更新答案"]
        for i, step in enumerate(steps):
            x = 165 + i * 430
            rounded(draw, (x, 330, x + 330, 520), PANEL_2, PRIMARY if i % 2 == 0 else GREEN, 4)
            draw_center(draw, (x + 165, 425), step, font(42), "#F8FAFC")
            if i < len(steps) - 1:
                draw.line((x + 350, 425, x + 410, 425), fill=YELLOW, width=5)
        draw_tags(draw, problem.topics, 260, 660)
    elif segment.visual_type == "code":
        draw_code(draw, segment.data["code"], 285, 205, 1350, 620)
    elif segment.visual_type == "summary":
        time_c, space_c = complexity(problem)
        rounded(draw, (280, 275, 850, 575), PANEL, GREEN, 4)
        rounded(draw, (1070, 275, 1640, 575), PANEL, PURPLE, 4)
        draw_center(draw, (565, 360), "时间复杂度", font(46), GREEN)
        draw_center(draw, (565, 470), time_c, font(36), "#F8FAFC")
        draw_center(draw, (1355, 360), "空间复杂度", font(46), PURPLE)
        draw_center(draw, (1355, 470), space_c, font(36), "#F8FAFC")
        draw_center(draw, (WIDTH // 2, 730), "模板不是背答案，而是帮你更快定位突破口。", font(42), YELLOW)
    draw_subtitle(draw, segment.narration)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    image.save(out_path, quality=94)


def generate_voice(text: str, output_path: Path) -> str:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    api_key = os.getenv("OPENAI_API_KEY")
    if api_key:
        try:
            from openai import OpenAI

            client = OpenAI(api_key=api_key)
            with client.audio.speech.with_streaming_response.create(
                model=os.getenv("OPENAI_TTS_MODEL", "gpt-4o-mini-tts"),
                voice=os.getenv("OPENAI_TTS_VOICE", "nova"),
                input=text,
                instructions=os.getenv("OPENAI_TTS_INSTRUCTIONS", "自然、亲切、口语化中文讲题，语速适中。"),
                response_format="mp3",
            ) as response:
                response.stream_to_file(output_path)
            return "openai"
        except Exception as exc:
            print(f"[TTS] OpenAI failed: {exc}; fallback to edge-tts", file=sys.stderr)
    try:
        import edge_tts

        async def save() -> None:
            voice = os.getenv("EDGE_TTS_VOICE", "zh-CN-XiaoxiaoNeural")
            rate = os.getenv("EDGE_TTS_RATE", "+0%")
            pitch = os.getenv("EDGE_TTS_PITCH", "+0Hz")
            timeout = float(os.getenv("EDGE_TTS_TIMEOUT", "90"))
            communicate = edge_tts.Communicate(text=text, voice=voice, rate=rate, pitch=pitch)
            await asyncio.wait_for(communicate.save(str(output_path)), timeout=timeout)

        asyncio.run(save())
        return "edge-tts"
    except Exception as exc:
        print(f"[TTS] edge-tts failed: {exc}; generate silence", file=sys.stderr)
        make_silence(output_path, 60)
        return "silent"


def make_silence(path: Path, duration: float) -> None:
    run([
        "ffmpeg",
        "-y",
        "-f",
        "lavfi",
        "-i",
        "anullsrc=channel_layout=stereo:sample_rate=44100",
        "-t",
        f"{duration:.3f}",
        "-q:a",
        "9",
        "-acodec",
        "libmp3lame",
        str(path),
    ])


def media_duration(path: Path) -> float:
    result = run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", str(path)], check=False)
    if result.returncode != 0:
        return 0.0
    try:
        return float(json.loads(result.stdout)["format"]["duration"])
    except Exception:
        return 0.0


def safe_name(problem: Problem) -> str:
    slug = re.sub(r"[^a-z0-9-]+", "-", problem.slug.lower()).strip("-")
    return f"leetcode_{problem.number:03d}_{slug}.mp4"


def render_problem(problem: Problem, overwrite: bool = False) -> Path:
    output_path = OUTPUT_DIR / safe_name(problem)
    if output_path.exists() and not overwrite:
        print(f"[SKIP] {output_path}")
        return output_path

    work_dir = ASSET_DIR / f"leetcode_{problem.number:03d}"
    slide_dir = work_dir / "slides"
    segment_dir = work_dir / "segments"
    audio_path = work_dir / "narration.mp3"
    for directory in (slide_dir, segment_dir):
        if directory.exists():
            shutil.rmtree(directory)
        directory.mkdir(parents=True, exist_ok=True)

    segments = build_segments(problem)
    narration = "\n".join(segment.narration for segment in segments)
    provider = generate_voice(narration, audio_path)
    audio_len = media_duration(audio_path)
    base_len = sum(segment.duration for segment in segments)
    scale = max(1.0, audio_len / base_len) if base_len else 1.0

    concat_path = work_dir / "concat.txt"
    concat_lines: list[str] = []
    for idx, segment in enumerate(segments, start=1):
        slide_path = slide_dir / f"slide_{idx:02d}.jpg"
        seg_path = segment_dir / f"segment_{idx:02d}.mp4"
        render_slide(problem, segment, slide_path)
        duration = segment.duration * scale
        run([
            "ffmpeg",
            "-y",
            "-loop",
            "1",
            "-i",
            str(slide_path),
            "-t",
            f"{duration:.3f}",
            "-vf",
            f"fps={FPS},format=yuv420p",
            "-c:v",
            "libx264",
            str(seg_path),
        ])
        concat_lines.append(f"file '{seg_path.as_posix()}'\n")
    concat_path.write_text("".join(concat_lines), encoding="utf-8")

    silent_video = work_dir / "silent.mp4"
    run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(concat_path), "-c", "copy", str(silent_video)])
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    run([
        "ffmpeg",
        "-y",
        "-i",
        str(silent_video),
        "-i",
        str(audio_path),
        "-c:v",
        "copy",
        "-c:a",
        "aac",
        "-shortest",
        str(output_path),
    ])
    print(f"[DONE] #{problem.number:03d} {problem.translated_title} -> {output_path.name} ({provider})")
    return output_path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="批量生成 LeetCode 中文题解视频")
    parser.add_argument("--start", type=int, default=2)
    parser.add_argument("--end", type=int, default=100)
    parser.add_argument("--overwrite", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        ensure_dependencies()
        problems = [p for p in fetch_problem_list(args.end, args.start) if args.start <= p.number <= args.end]
        print(f"准备生成 {len(problems)} 个视频：#{args.start} - #{args.end}")
        if args.dry_run:
            for p in problems:
                print(f"#{p.number:03d} {p.translated_title} / {p.title} / {p.difficulty} / {'、'.join(p.topics)}")
            return 0
        for problem in problems:
            render_problem(problem, overwrite=args.overwrite)
        return 0
    except Exception as exc:
        print(f"生成失败：{exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
