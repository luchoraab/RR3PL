"""Check local links and assets in the site's five entry pages."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
PAGES = [ROOT / route / "index.html" for route in ("", "motors", "logistica", "digital", "luciano-raab")]


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.ids = set()
        self.links = []
        self.feed(path.read_text(encoding="utf-8"))

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get("id"):
            self.ids.add(attrs["id"])
        for key in ("href", "src", "poster"):
            if attrs.get(key):
                self.links.append(attrs[key])


pages = {path: Page(path) for path in PAGES}
errors = []
for path, page in pages.items():
    for link in page.links:
        url = urlsplit(link)
        if url.scheme or url.netloc:
            continue
        root_target = unquote(url.path)
        target = (ROOT / root_target.lstrip("/") if root_target.startswith("/") else
                  path.parent / root_target if root_target else path).resolve()
        if target.is_dir():
            target /= "index.html"
        if not target.is_file() or (url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids):
            errors.append(f"{path.relative_to(ROOT)}: {link}")

if errors:
    raise SystemExit("\n".join(errors))
print(f"Enlaces y recursos locales verificados en {len(pages)} páginas.")
