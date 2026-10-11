#!/usr/bin/env python3
"""Dependency-free structural/link checker; no external requests."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import re

ROOT = Path(__file__).resolve().parents[1]
class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.links = []
        self.h1 = 0
        self.main = 0
        self.title = 0
        self.viewport = False
        self.errors = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get("id"):
            if attrs["id"] in self.ids:
                self.errors.append("duplicate id: " + attrs["id"])
            self.ids.add(attrs["id"])
        self.h1 += tag == "h1"
        self.main += tag == "main"
        self.title += tag == "title"
        self.viewport |= tag == "meta" and attrs.get("name") == "viewport"
        for key in ("href", "src"):
            if attrs.get(key):
                self.links.append(attrs[key])

pages = {}
errors = []
for path in sorted(ROOT.rglob("*.html")):
    parser = Page()
    parser.feed(path.read_text())
    pages[path] = parser
    if parser.h1 != 1 or parser.main != 1 or parser.title != 1 or not parser.viewport:
        errors.append(str(path.relative_to(ROOT)) + ": missing/duplicate heading, main, title or viewport")
    errors.extend(str(path.relative_to(ROOT)) + ": " + error for error in parser.errors)

for path, parser in pages.items():
    for link in parser.links:
        url = urlsplit(link)
        if url.scheme or url.netloc:
            continue
        target = (path.parent / unquote(url.path)).resolve() if url.path else path
        if target.is_dir():
            target /= "index.html"
        if not target.is_relative_to(ROOT) or not target.is_file():
            errors.append(str(path.relative_to(ROOT)) + ": missing local target " + link)
        elif url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:
            errors.append(str(path.relative_to(ROOT)) + ": missing fragment " + link)

for css in ROOT.rglob("*.css"):
    for reference in re.findall(r'url\(["\x27]?([^)"\x27]+)', css.read_text()):
        if reference.startswith("data:") or urlsplit(reference).scheme:
            continue
        if not (css.parent / reference).is_file():
            errors.append(str(css.relative_to(ROOT)) + ": missing CSS asset " + reference)
if errors:
    raise SystemExit("\n".join(errors))
print("PASS: " + str(len(pages)) + " static pages; local links, anchors, IDs and assets resolve.")
