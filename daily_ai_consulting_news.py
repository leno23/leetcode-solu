import re
from typing import List, Dict

class DailyAIConsultingNews:
    def __init__(self):
        self.title = ""
        self.date = ""
        self.body = ""
        self.items = []

    def parse(self) -> None:
        """Parse the body content into structured news items."""
        if not self.body:
            self.items = []
            return

        # Split body into lines and strip whitespace
        lines = [line.strip() for line in self.body.split('\n')]

        # Extract title and date from header
        title_line = next((line for line in lines if line.startswith('##')), '')
        if title_line:
            self.title = title_line[2:].strip()
        
        date_match = re.search(r'\d{4} 年 \d{1,2} 月 \d{1,2} 日', self.body)
        if date_match:
            self.date = date_match.group()

        # Find the start of news items (after "## 今日 AI 咨询行业要点")
        item_start_idx = -1
        for i, line in enumerate(lines):
            if line.startswith('## 今日 AI 咨询行业要点'):
                item_start_idx = i + 1
                break

        if item_start_idx == -1:
            self.items = []
            return

        # Collect all lines from item start onward
        content_lines = lines[item_start_idx:]
        items = []
        current_item = None

        reference_pattern = re.compile(r'^[-*] 参考：$|^\[参考\]$')

        for line in content_lines:
            # Match numbered headlines (### 1., ### 2., etc.)
            headline_match = re.match(r'^###\s*\d+\.\s*(.+)$', line)
            if headline_match:
                if current_item is not None:
                    items.append(current_item)
                current_item = {
                    'id': len(items) + 1,
                    'headline': headline_match.group(1).strip(),
                    'summary': '',
                    'references': []
                }
                continue

            if current_item is None:
                continue

            # Check for reference lines
            if re.match(r'^[-*]\s*参考：', line) or line.startswith('Reference:'):
                # Extract URL from markdown link if present
                url_match = re.search(r'\[.*?\]\((https?://[^\)]+)\)', line)
                if url_match:
                    current_item['references'].append(url_match.group(1))
                else:
                    # Fallback: extract any URL
                    url_only = re.search(r'(https?://[^\s]+)', line)
                    if url_only:
                        current_item['references'].append(url_only.group(1))
                continue

            # Accumulate summary text (skip separators)
            if line in ['---', '--', '']:
                continue

            # If no current item, skip
            if not current_item:
                continue

            # Add to summary if not a new section
            if not line.startswith('###'):
                if current_item['summary']:
                    current_item['summary'] += ' ' + line
                else:
                    current_item['summary'] = line

        # Append last item
        if current_item is not None:
            items.append(current_item)

        self.items = items

    def get_items(self) -> List[Dict]:
        """Return parsed news items."""
        if not self.items:
            self.parse()
        return self.items

    def to_dict(self) -> Dict:
        """Convert to dictionary format."""
        return {
            'title': self.title,
            'date': self.date,
            'items': self.get_items()
        }