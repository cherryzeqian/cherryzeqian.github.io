"""Render the same static navigation into every public route (no runtime JS)."""
from pathlib import Path
import re
ROOT = Path(__file__).resolve().parents[1]
PAGES = ['index.html', 'about/index.html', 'penny/index.html', 'nextbit/index.html', 'tencent/index.html', 'gamefi-life/index.html', 'gamefi-life-old/index.html', 'resume/index.html']
for name in PAGES:
    path = ROOT / name
    text = path.read_text()
    base = './' if name == 'index.html' else '../'
    about = ' aria-current="page"' if name.startswith('about/') else ''
    work = ' aria-current="location"' if name.startswith(('penny/', 'nextbit/', 'tencent/', 'gamefi-life')) else ''
    header = f'''<!-- shared-navigation:start -->
<header id="portfolio-nav">
  <div class="portfolio-nav-inner">
    <a class="portfolio-brand" href="{base}index.html" aria-label="Cherry Li, home">cherry li<span aria-hidden="true">*</span></a>
    <nav aria-label="Main navigation">
      <a href="{base}index.html#work"{work}>Work <span aria-hidden="true">↘</span></a>
      <a href="{base}about/"{about}>About</a>
      <a href="mailto:cherryzeqian@gmail.com">Say hello <span aria-hidden="true">↗</span></a>
    </nav>
  </div>
</header>
<!-- shared-navigation:end -->'''
    if '<!-- shared-navigation:start -->' in text:
        text = re.sub(r'<!-- shared-navigation:start -->[\s\S]*?<!-- shared-navigation:end -->', lambda _:header, text)
    elif name in ('index.html', 'about/index.html', 'penny/index.html'):
        text, count = re.subn(r'<header class="(?:site-header wrap|about-header)">[\s\S]*?</header>', lambda _:header, text, count=1)
        assert count == 1, name
    else:
        text, count = re.subn(r'(<body\b[^>]*>)', lambda m:m[0]+'\n'+header, text, count=1)
        assert count == 1, name
    if 'assets/shared/navigation.css' not in text:
        text = text.replace('</head>', f'<link rel="stylesheet" href="{base}assets/shared/navigation.css">\n</head>', 1)
    path.write_text(text)
