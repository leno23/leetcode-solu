#!/usr/bin/env python3
"""Generate a Chinese LeetCode 001 Two Sum explainer video.

The script prefers OpenAI TTS when OPENAI_API_KEY is available. If not, it tries
macOS `say` as a local Chinese voice fallback, then falls back to silent audio.
Visuals are generated with Pillow and assembled with ffmpeg, so the final video
requires no manual editing.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import math
import os
import platform
import shutil
import subprocess
import sys
import textwrap
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw, ImageFont

WIDTH = 1920
HEIGHT = 1080
FPS = 24
FRAME_STEP = 0.5
ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "assets" / "leetcode_001"
FRAME_DIR = ASSET_DIR / "frames"
AUDIO_DIR = ASSET_DIR / "audio"
OUTPUT_DIR = ROOT / "output"
OUTPUT_PATH = OUTPUT_DIR / "leetcode_001_two_sum.mp4"
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

CODE_SNIPPET = """def twoSum(nums, target):
    seen = {}

    for i, num in enumerate(nums):
        need = target - num

        if need in seen:
            return [seen[need], i]

        seen[num] = i

    return []"""


@dataclass(frozen=True)
class Segment:
    title: str
    narration: str
    duration: float
    visual_type: str
    code: str | None = None
    data: dict[str, Any] = field(default_factory=dict)


def build_segments() -> list[Segment]:
    return [
        Segment(
            title="LeetCode 1：两数之和",
            narration="大家好，这期我们来看 LeetCode 第一题：两数之和。这道题很经典，主要考察哈希表的使用。别担心，我们会从最直观的想法开始，一步一步把它优化到一次遍历。",
            duration=17,
            visual_type="title",
        ),
        Segment(
            title="题目到底在问什么？",
            narration="题目给我们一个数组 nums，还有一个目标值 target。我们要找出两个不同位置的数字，让它们相加正好等于 target，最后返回这两个数字的下标。注意，返回的是下标，不是数字本身。",
            duration=19,
            visual_type="problem",
            data={"nums": [2, 7, 11, 15], "target": 9},
        ),
        Segment(
            title="先看一个例子",
            narration="比如 nums 等于二、七、十一、十五，target 等于九。数组里二加七正好是九，所以答案就是下标零和一下标一，也就是返回 [0, 1]。这个例子很简单，但它能帮我们看清楚要找的东西。",
            duration=20,
            visual_type="example",
            data={"nums": [2, 7, 11, 15], "target": 9, "answer": [0, 1]},
        ),
        Segment(
            title="暴力解法：枚举每一对",
            narration="最直接的想法，是用两层循环。第一层固定一个数字，第二层去后面找另一个数字，看看两者相加是不是 target。这个方法很好理解，也一定能找到答案，但问题是，如果数组很长，枚举每一对会比较慢，时间复杂度是 O(n 平方)。",
            duration=23,
            visual_type="bruteforce",
            data={"nums": [2, 7, 11, 15], "target": 9},
        ),
        Segment(
            title="优化关键：先找需要的数",
            narration="更好的思路是反过来想。遍历到当前数字 x 的时候，我不再盲目地找所有搭档，而是计算我需要谁。也就是 need 等于 target 减 x。只要 need 之前出现过，当前数字和之前那个数字就能组成答案。",
            duration=22,
            visual_type="hash_idea",
            data={"nums": [2, 7, 11, 15], "target": 9},
        ),
        Segment(
            title="哈希表推演",
            narration="我们用一个哈希表 seen，记录已经看过的数字和它的下标。先看到二，需要七，哈希表里还没有七，就把二和下标零存进去。接着看到七，需要二，而二已经在哈希表里了，所以立刻返回 [0, 1]。",
            duration=24,
            visual_type="hash_walkthrough",
            data={"nums": [2, 7, 11, 15], "target": 9},
        ),
        Segment(
            title="Python 代码讲解",
            narration="代码其实很短。seen 是哈希表。每次循环里，先算 need。如果 need 已经在 seen 里面，就返回 seen 里保存的下标和当前下标。否则，把当前数字 num 和它的下标 i 存进去。遍历结束还没找到，就返回空数组。",
            duration=24,
            visual_type="code",
            code=CODE_SNIPPET,
        ),
        Segment(
            title="复杂度分析",
            narration="这个哈希表做法只遍历数组一次。每次查找和插入哈希表，平均都是 O(1)，所以总时间复杂度是 O(n)。哈希表最多存 n 个元素，所以空间复杂度是 O(n)。这就是两数之和最常用、也最推荐的写法。",
            duration=20,
            visual_type="complexity",
        ),
        Segment(
            title="总结",
            narration="最后总结一下：暴力法是枚举两数，思路直观但比较慢。哈希表法的核心，是边遍历边记录已经出现过的数字，并且每次只检查当前数字需要的搭档有没有出现。记住这个思路，很多数组查找类题目都会变得清晰很多。",
            duration=20,
            visual_type="summary",
        ),
    ]


def run(cmd: list[str], *, check: bool = True) -> subprocess.CompletedProcess[str]:
    result = subprocess.run(cmd, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if check and result.returncode != 0:
        joined = " ".join(cmd)
        raise RuntimeError(f"命令执行失败：{joined}\nstdout:\n{result.stdout}\nstderr:\n{result.stderr}")
    return result


def ensure_dependencies() -> None:
    missing = []
    if shutil.which("ffmpeg") is None:
        missing.append("ffmpeg")
    if shutil.which("ffprobe") is None:
        missing.append("ffprobe")
    if missing:
        raise RuntimeError("缺少依赖：" + ", ".join(missing) + "。请先安装 ffmpeg，例如 macOS: brew install ffmpeg")


def find_font() -> str | None:
    candidates = [
        "/System/Library/Fonts/PingFang.ttc",
        "/System/Library/Fonts/STHeiti Light.ttc",
        "/Library/Fonts/Arial Unicode.ttf",
        "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
        "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for candidate in candidates:
        if Path(candidate).exists():
            return candidate
    return None


FONT_PATH = find_font()


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    if FONT_PATH:
        return ImageFont.truetype(FONT_PATH, size=size, index=0)
    return ImageFont.load_default()


def text_size(draw: ImageDraw.ImageDraw, text: str, text_font: ImageFont.ImageFont) -> tuple[int, int]:
    box = draw.textbbox((0, 0), text, font=text_font)
    return box[2] - box[0], box[3] - box[1]


def draw_text_center(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int],
    text: str,
    text_font: ImageFont.ImageFont,
    fill: str = TEXT,
) -> None:
    width, height = text_size(draw, text, text_font)
    draw.text((xy[0] - width / 2, xy[1] - height / 2), text, font=text_font, fill=fill)


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


def draw_wrapped(
    draw: ImageDraw.ImageDraw,
    text: str,
    xy: tuple[int, int],
    text_font: ImageFont.ImageFont,
    max_width: int,
    fill: str = TEXT,
    line_gap: int = 14,
) -> int:
    y = xy[1]
    for line in wrap_text(draw, text, text_font, max_width):
        draw.text((xy[0], y), line, font=text_font, fill=fill)
        y += text_size(draw, line, text_font)[1] + line_gap
    return y


def rounded_rect(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], fill: str, outline: str | None = None, width: int = 2) -> None:
    draw.rounded_rectangle(box, radius=28, fill=fill, outline=outline, width=width)


def base_canvas(title: str) -> tuple[Image.Image, ImageDraw.ImageDraw]:
    image = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 0, WIDTH, HEIGHT), fill=BG)
    for i in range(0, WIDTH, 120):
        draw.line((i, 0, i - 420, HEIGHT), fill="#13213A", width=1)
    draw.rectangle((0, 0, WIDTH, 112), fill="#020617")
    draw.text((80, 34), title, font=font(42), fill=PRIMARY)
    draw.text((1580, 42), "LeetCode 001", font=font(30), fill=MUTED)
    return image, draw


def draw_subtitle(draw: ImageDraw.ImageDraw, narration: str) -> None:
    sub_font = font(34)
    lines = wrap_text(draw, narration, sub_font, 1620)
    if len(lines) > 2:
        lines = lines[:2]
        lines[-1] = lines[-1].rstrip("，。") + "……"
    line_height = 48
    box_height = 70 + line_height * len(lines)
    y0 = HEIGHT - box_height - 28
    rounded_rect(draw, (150, y0, WIDTH - 150, HEIGHT - 34), "#020617", outline="#334155", width=2)
    y = y0 + 32
    for line in lines:
        draw_text_center(draw, (WIDTH // 2, y + 18), line, sub_font, fill="#F8FAFC")
        y += line_height


def draw_array(draw: ImageDraw.ImageDraw, nums: list[int], x: int, y: int, highlight: set[int] | None = None, need_index: int | None = None) -> None:
    highlight = highlight or set()
    cell_w = 170
    cell_h = 110
    gap = 22
    for i, num in enumerate(nums):
        left = x + i * (cell_w + gap)
        color = GREEN if i in highlight else PANEL_2
        outline = YELLOW if need_index == i else PRIMARY
        rounded_rect(draw, (left, y, left + cell_w, y + cell_h), color, outline=outline, width=4)
        draw_text_center(draw, (left + cell_w // 2, y + 42), str(num), font(44), fill="#FFFFFF")
        draw_text_center(draw, (left + cell_w // 2, y + 92), f"idx {i}", font(24), fill="#DBEAFE")


def draw_key_value_table(draw: ImageDraw.ImageDraw, items: list[tuple[str, str]], x: int, y: int, title: str = "seen 哈希表") -> None:
    rounded_rect(draw, (x, y, x + 520, y + 420), PANEL, outline="#334155", width=3)
    draw_text_center(draw, (x + 260, y + 42), title, font(34), fill=PURPLE)
    draw.line((x + 50, y + 86, x + 470, y + 86), fill="#475569", width=2)
    draw.text((x + 70, y + 108), "数字", font=font(28), fill=MUTED)
    draw.text((x + 300, y + 108), "下标", font=font(28), fill=MUTED)
    if not items:
        draw_text_center(draw, (x + 260, y + 250), "暂时为空", font(32), fill=MUTED)
    for row, (k, v) in enumerate(items):
        yy = y + 162 + row * 68
        rounded_rect(draw, (x + 55, yy, x + 465, yy + 52), "#0B1220", outline="#1E40AF", width=2)
        draw.text((x + 82, yy + 10), k, font=font(28), fill=YELLOW)
        draw.text((x + 325, yy + 10), v, font=font(28), fill=GREEN)


def draw_code_block(draw: ImageDraw.ImageDraw, code: str, x: int, y: int, w: int, h: int) -> None:
    rounded_rect(draw, (x, y, x + w, y + h), CODE_BG, outline="#334155", width=3)
    code_font = font(32)
    colors = {
        "def": PURPLE,
        "for": PURPLE,
        "in": PURPLE,
        "if": PURPLE,
        "return": RED,
        "seen": YELLOW,
        "need": ORANGE,
        "target": PRIMARY,
        "num": GREEN,
        "i": GREEN,
    }
    yy = y + 40
    for line_no, line in enumerate(code.splitlines(), start=1):
        draw.text((x + 34, yy), f"{line_no:>2}", font=font(24), fill="#64748B")
        xx = x + 90
        if not line:
            yy += 42
            continue
        indent = len(line) - len(line.lstrip(" "))
        draw.text((xx, yy), " " * indent, font=code_font, fill=TEXT)
        xx += indent * 16
        for token in split_code_tokens(line.lstrip(" ")):
            fill = colors.get(token.strip(), TEXT)
            if token.strip().isdigit():
                fill = YELLOW
            draw.text((xx, yy), token, font=code_font, fill=fill)
            xx += text_size(draw, token, code_font)[0]
        yy += 48


def split_code_tokens(line: str) -> list[str]:
    tokens: list[str] = []
    current = ""
    separators = set("()[]{}:,.=+- ")
    for char in line:
        if char in separators:
            if current:
                tokens.append(current)
                current = ""
            tokens.append(char)
        else:
            current += char
    if current:
        tokens.append(current)
    return tokens


def render_segment(segment: Segment, elapsed: float) -> Image.Image:
    image, draw = base_canvas(segment.title)
    if segment.visual_type == "title":
        draw_text_center(draw, (WIDTH // 2, 330), "Two Sum / 两数之和", font(78), fill="#F8FAFC")
        draw_text_center(draw, (WIDTH // 2, 438), "从暴力枚举到哈希表一次遍历", font(44), fill=PRIMARY)
        draw_array(draw, [2, 7, 11, 15], 560, 575, highlight={0, 1})
        draw_text_center(draw, (WIDTH // 2, 760), "2 + 7 = 9  →  返回 [0, 1]", font(46), fill=YELLOW)
    elif segment.visual_type == "problem":
        draw_wrapped(draw, "输入：整数数组 nums、目标值 target", (210, 210), font(48), 1500, fill="#F8FAFC")
        draw_wrapped(draw, "输出：两个数的下标，使 nums[i] + nums[j] == target", (210, 310), font(44), 1500, fill=TEXT)
        draw_wrapped(draw, "关键点：返回下标；两个位置不能相同；题目通常保证有唯一答案。", (210, 430), font(38), 1500, fill=MUTED)
        draw_array(draw, segment.data["nums"], 480, 590)
        draw_text_center(draw, (WIDTH // 2, 780), f"target = {segment.data['target']}", font(48), fill=YELLOW)
    elif segment.visual_type == "example":
        draw_text_center(draw, (WIDTH // 2, 210), "示例：nums = [2, 7, 11, 15]，target = 9", font(48), fill="#F8FAFC")
        draw_array(draw, segment.data["nums"], 480, 360, highlight={0, 1})
        draw.line((650, 535, 840, 535), fill=YELLOW, width=6)
        draw_text_center(draw, (WIDTH // 2, 635), "nums[0] + nums[1] = 2 + 7 = 9", font(52), fill=YELLOW)
        draw_text_center(draw, (WIDTH // 2, 740), "答案：[0, 1]", font(60), fill=GREEN)
    elif segment.visual_type == "bruteforce":
        draw_text_center(draw, (WIDTH // 2, 205), "暴力：检查每一对数字", font(52), fill="#F8FAFC")
        draw_array(draw, segment.data["nums"], 480, 330, highlight={0, 1})
        pairs = ["(0,1)", "(0,2)", "(0,3)", "(1,2)", "(1,3)", "(2,3)"]
        for idx, pair in enumerate(pairs):
            x = 430 + (idx % 3) * 360
            y = 560 + (idx // 3) * 100
            rounded_rect(draw, (x, y, x + 230, y + 64), "#1F2937", outline=GREEN if idx == 0 else "#475569", width=3)
            draw_text_center(draw, (x + 115, y + 31), pair, font(32), fill=GREEN if idx == 0 else TEXT)
        draw_text_center(draw, (WIDTH // 2, 820), "两层循环 → 时间复杂度 O(n²)", font(50), fill=RED)
    elif segment.visual_type == "hash_idea":
        draw_text_center(draw, (WIDTH // 2, 190), "把“找一对”变成“查一个需要的数”", font(50), fill="#F8FAFC")
        rounded_rect(draw, (230, 300, 820, 620), PANEL, outline=PRIMARY, width=3)
        rounded_rect(draw, (1100, 300, 1690, 620), PANEL, outline=GREEN, width=3)
        draw_text_center(draw, (525, 375), "当前数字 x", font(46), fill=PRIMARY)
        draw_text_center(draw, (525, 485), "need = target - x", font(48), fill=YELLOW)
        draw_text_center(draw, (1395, 375), "哈希表 seen", font(46), fill=GREEN)
        draw_text_center(draw, (1395, 485), "查 need 是否出现过", font(42), fill=TEXT)
        draw.line((850, 460, 1060, 460), fill=YELLOW, width=6)
        draw.polygon([(1060, 460), (1025, 438), (1025, 482)], fill=YELLOW)
        draw_text_center(draw, (WIDTH // 2, 760), "出现过 → 找到答案；没出现 → 存当前数字", font(46), fill="#F8FAFC")
    elif segment.visual_type == "hash_walkthrough":
        nums = segment.data["nums"]
        phase = min(1, int(elapsed / max(segment.duration / 2, 1)))
        if phase == 0:
            draw_text_center(draw, (WIDTH // 2, 200), "i = 0, num = 2, need = 7", font(50), fill="#F8FAFC")
            draw_array(draw, nums, 330, 340, highlight={0})
            draw_key_value_table(draw, [], 1220, 300)
            draw_text_center(draw, (WIDTH // 2, 780), "7 不在 seen 里，把 2 → 0 存进去", font(46), fill=YELLOW)
        else:
            draw_text_center(draw, (WIDTH // 2, 200), "i = 1, num = 7, need = 2", font(50), fill="#F8FAFC")
            draw_array(draw, nums, 330, 340, highlight={1}, need_index=0)
            draw_key_value_table(draw, [("2", "0")], 1220, 300)
            draw_text_center(draw, (WIDTH // 2, 780), "2 已经出现过 → 返回 [0, 1]", font(52), fill=GREEN)
    elif segment.visual_type == "code":
        draw_code_block(draw, segment.code or CODE_SNIPPET, 250, 175, 1420, 690)
        rounded_rect(draw, (1320, 250, 1660, 390), "#172554", outline=PRIMARY, width=3)
        draw_text_center(draw, (1490, 295), "核心判断", font(30), fill=PRIMARY)
        draw_text_center(draw, (1490, 345), "need in seen", font(34), fill=YELLOW)
    elif segment.visual_type == "complexity":
        rounded_rect(draw, (260, 260, 870, 620), PANEL, outline=GREEN, width=4)
        rounded_rect(draw, (1050, 260, 1660, 620), PANEL, outline=PURPLE, width=4)
        draw_text_center(draw, (565, 350), "时间复杂度", font(48), fill=GREEN)
        draw_text_center(draw, (565, 480), "O(n)", font(92), fill="#F8FAFC")
        draw_text_center(draw, (565, 575), "数组只遍历一遍", font(34), fill=MUTED)
        draw_text_center(draw, (1355, 350), "空间复杂度", font(48), fill=PURPLE)
        draw_text_center(draw, (1355, 480), "O(n)", font(92), fill="#F8FAFC")
        draw_text_center(draw, (1355, 575), "哈希表最多存 n 个数", font(34), fill=MUTED)
        draw_text_center(draw, (WIDTH // 2, 765), "查找 + 插入平均 O(1)", font(48), fill=YELLOW)
    elif segment.visual_type == "summary":
        bullets = [
            "暴力法：枚举两数，直观但 O(n²)",
            "哈希表法：边遍历边记录已经出现的数字",
            "当前数字只需要检查 target - num",
            "一次遍历完成，时间复杂度 O(n)",
        ]
        y = 250
        for idx, bullet in enumerate(bullets, start=1):
            rounded_rect(draw, (310, y, 1610, y + 90), "#111827", outline="#334155", width=3)
            draw_text_center(draw, (370, y + 45), str(idx), font(38), fill=YELLOW)
            draw.text((440, y + 22), bullet, font=font(38), fill=TEXT)
            y += 120
        draw_text_center(draw, (WIDTH // 2, 830), "下期见！", font(58), fill=PRIMARY)
    else:
        draw_text_center(draw, (WIDTH // 2, HEIGHT // 2), segment.title, font(60), fill=TEXT)
    draw_subtitle(draw, segment.narration)
    return image


def generate_voice(text: str, output_path: Path) -> str:
    """Generate one narration file and return provider name."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    api_key = os.getenv("OPENAI_API_KEY")
    if api_key:
        model = os.getenv("OPENAI_TTS_MODEL", "gpt-4o-mini-tts")
        voice = os.getenv("OPENAI_TTS_VOICE", "nova")
        instructions = os.getenv(
            "OPENAI_TTS_INSTRUCTIONS",
            "请用自然、亲切、口语化的中文讲解，像真人老师在给初学者讲题。语速适中，重点处稍作停顿，不要像朗读教材。",
        )
        try:
            from openai import OpenAI

            client = OpenAI(api_key=api_key)
            with client.audio.speech.with_streaming_response.create(
                model=model,
                voice=voice,
                input=text,
                instructions=instructions,
                response_format="mp3",
            ) as response:
                response.stream_to_file(output_path)
            return f"OpenAI TTS ({model}/{voice})"
        except Exception as exc:  # noqa: BLE001 - explicit runtime fallback message
            print(f"[TTS] OpenAI TTS 失败，改用本地/静音方案：{exc}", file=sys.stderr)
    else:
        print("[TTS] 未检测到 OPENAI_API_KEY，尝试 edge-tts 中文神经网络语音；若不可用再使用本地/静音方案。")

    edge_provider = generate_edge_tts(text, output_path)
    if edge_provider:
        return edge_provider

    if platform.system() == "Darwin" and shutil.which("say"):
        aiff_path = output_path.with_suffix(".aiff")
        voices = run(["say", "-v", "?"], check=False).stdout
        voice_candidates = [
            "Eddy (中文（中国大陆）)",
            "Flo (中文（中国大陆）)",
            "Sandy (中文（中国大陆）)",
            "Shelley (中文（中国大陆）)",
            "Tingting",
            "Meijia",
        ]
        voice = next((candidate for candidate in voice_candidates if candidate in voices), None)
        cmd = ["say"]
        if voice:
            cmd.extend(["-v", voice])
        cmd.extend(["-r", "185", "-o", str(aiff_path), text])
        result = run(cmd, check=False)
        if result.returncode == 0 and aiff_path.exists():
            run(["ffmpeg", "-y", "-i", str(aiff_path), "-codec:a", "libmp3lame", "-q:a", "4", str(output_path)])
            return f"macOS say ({voice or 'default'})"
        print(f"[TTS] macOS say 失败：{result.stderr}", file=sys.stderr)

    return "silent-placeholder"


def generate_edge_tts(text: str, output_path: Path) -> str | None:
    """Generate speech with Microsoft Edge neural TTS when installed."""
    try:
        import edge_tts
    except ImportError:
        print("[TTS] edge-tts 未安装；可执行 python3 -m pip install -r requirements.txt 后获得更自然的无 Key 中文语音。", file=sys.stderr)
        return None

    voice = os.getenv("EDGE_TTS_VOICE", "zh-CN-XiaoxiaoNeural")
    rate = os.getenv("EDGE_TTS_RATE", "+0%")
    pitch = os.getenv("EDGE_TTS_PITCH", "+0Hz")

    async def save() -> None:
        communicate = edge_tts.Communicate(text=text, voice=voice, rate=rate, pitch=pitch)
        await communicate.save(str(output_path))

    try:
        asyncio.run(save())
    except Exception as exc:  # noqa: BLE001 - runtime fallback should keep video generation available
        print(f"[TTS] edge-tts 失败，改用本地/静音方案：{exc}", file=sys.stderr)
        return None
    return f"edge-tts ({voice}, rate={rate}, pitch={pitch})"


def audio_duration(path: Path) -> float:
    result = run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", str(path)],
        check=False,
    )
    if result.returncode != 0:
        return 0.0
    data = json.loads(result.stdout or "{}")
    try:
        return float(data.get("format", {}).get("duration", 0.0))
    except (TypeError, ValueError):
        return 0.0


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


def prepare_audio(segments: list[Segment]) -> tuple[list[float], str, Path]:
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    durations: list[float] = []
    providers: list[str] = []
    audio_files: list[Path] = []
    for idx, segment in enumerate(segments, start=1):
        audio_path = AUDIO_DIR / f"segment_{idx:02d}.mp3"
        provider = generate_voice(segment.narration, audio_path)
        if provider == "silent-placeholder" or not audio_path.exists():
            make_silence(audio_path, segment.duration)
        measured = audio_duration(audio_path)
        durations.append(max(measured, segment.duration if measured <= 0 else measured))
        providers.append(provider)
        audio_files.append(audio_path)

    concat_file = AUDIO_DIR / "concat_audio.txt"
    concat_file.write_text("".join(f"file '{path.as_posix()}'\n" for path in audio_files), encoding="utf-8")
    narration_path = AUDIO_DIR / "narration.mp3"
    run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(concat_file), "-c", "copy", str(narration_path)])
    provider_summary = ", ".join(sorted(set(providers)))
    return durations, provider_summary, narration_path


def render_frames(segments: list[Segment], durations: list[float]) -> int:
    if FRAME_DIR.exists():
        shutil.rmtree(FRAME_DIR)
    FRAME_DIR.mkdir(parents=True, exist_ok=True)
    frame_index = 0
    if len(segments) != len(durations):
        raise RuntimeError("视频片段数量和音频时长数量不一致")
    for segment, duration in zip(segments, durations):
        count = max(1, math.ceil(duration / FRAME_STEP))
        for local_index in range(count):
            elapsed = min(local_index * FRAME_STEP, duration)
            image = render_segment(segment, elapsed)
            repeat = max(1, int(FPS * FRAME_STEP))
            for _ in range(repeat):
                frame_index += 1
                image.save(FRAME_DIR / f"frame_{frame_index:06d}.jpg", quality=92)
    return frame_index


def assemble_video(frame_count: int, narration_path: Path) -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    if frame_count <= 0:
        raise RuntimeError("没有生成任何视频帧")
    temp_video = ASSET_DIR / "silent_video.mp4"
    run([
        "ffmpeg",
        "-y",
        "-framerate",
        str(FPS),
        "-i",
        str(FRAME_DIR / "frame_%06d.jpg"),
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-r",
        str(FPS),
        str(temp_video),
    ])
    run([
        "ffmpeg",
        "-y",
        "-i",
        str(temp_video),
        "-i",
        str(narration_path),
        "-c:v",
        "copy",
        "-c:a",
        "aac",
        "-shortest",
        str(OUTPUT_PATH),
    ])


def print_plan(segments: list[Segment]) -> None:
    print("视频结构：")
    for idx, segment in enumerate(segments, start=1):
        print(f"  {idx:02d}. {segment.title} / {segment.visual_type} / 约 {segment.duration:.0f}s")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="生成 LeetCode 001 两数之和中文题解视频")
    parser.add_argument("--dry-run", action="store_true", help="只打印视频结构，不生成音频和视频")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    segments = build_segments()
    print_plan(segments)
    if args.dry_run:
        return 0
    try:
        ensure_dependencies()
        ASSET_DIR.mkdir(parents=True, exist_ok=True)
        print("\nStep 1/3: 生成旁白音频...")
        durations, provider_summary, narration_path = prepare_audio(segments)
        print(f"TTS 提供方：{provider_summary}")
        print("\nStep 2/3: 渲染 1920x1080 画面和字幕...")
        frame_count = render_frames(segments, durations)
        print(f"已生成帧数：{frame_count}")
        print("\nStep 3/3: 合成 mp4...")
        assemble_video(frame_count, narration_path)
        total_duration = sum(durations)
        print("\n生成完成")
        print(f"视频路径：{OUTPUT_PATH}")
        print(f"视频时长：约 {total_duration / 60:.1f} 分钟")
        return 0
    except Exception as exc:  # noqa: BLE001 - CLI entrypoint should explain failure clearly
        print(f"\n生成失败：{exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
