#!/usr/bin/env python3
"""
Build script to package the application into a single self-contained HTML file.
Inlines CSS and JavaScript into the HTML file.

Usage:
    python build.py              # Dry run (shows output without writing)
    python build.py --live       # Actually writes the bundled file
"""

import argparse
import re
from pathlib import Path


def inline_assets(html_content: str, css_content: str, js_content: str) -> str:
    """
    Replace CSS and JS link/script tags with inline content.
    """
    # Replace <link rel="stylesheet" href="style.css"> with inline <style>
    css_pattern = r'<link[^>]*href=["\']style\.css["\'][^>]*>'
    inline_css = f'<style>\n{css_content}\n    </style>'
    html_content = re.sub(css_pattern, inline_css, html_content)

    # Replace <script src="script.js"></script> with inline <script>
    js_pattern = r'<script[^>]*src=["\']script\.js["\'][^>]*></script>'
    inline_js = f'<script>\n{js_content}\n    </script>'
    html_content = re.sub(js_pattern, inline_js, html_content)

    return html_content


def build(dry_run: bool = True):
    """
    Build the single-file HTML bundle.

    Args:
        dry_run: If True, only show what would be done without writing files
    """
    project_dir = Path(__file__).parent

    # Read source files
    html_path = project_dir / "index.html"
    css_path = project_dir / "style.css"
    js_path = project_dir / "script.js"
    output_dir = project_dir / "dist"
    output_path = output_dir / "index.html"

    print(f"Reading source files...")
    print(f"  - {html_path}")
    print(f"  - {css_path}")
    print(f"  - {js_path}")

    html_content = html_path.read_text(encoding='utf-8')
    css_content = css_path.read_text(encoding='utf-8')
    js_content = js_path.read_text(encoding='utf-8')

    # Build the bundled HTML
    bundled_html = inline_assets(html_content, css_content, js_content)

    # Calculate sizes
    original_size = len(html_content) + len(css_content) + len(js_content)
    bundled_size = len(bundled_html)

    print(f"\nBundle statistics:")
    print(f"  Original total size: {original_size:,} bytes")
    print(f"  Bundled size: {bundled_size:,} bytes")
    print(f"  Difference: {bundled_size - original_size:+,} bytes")

    if dry_run:
        print(f"\n🔍 DRY RUN: Would write to {output_path}")
        print(f"   Run with --live to actually create the file")
        print(f"\nFirst 500 characters of bundled output:")
        print("-" * 80)
        print(bundled_html[:500])
        print("-" * 80)
    else:
        print(f"\n✅ Creating output directory: {output_dir}")
        output_dir.mkdir(exist_ok=True)
        print(f"   Writing bundled file to {output_path}")
        output_path.write_text(bundled_html, encoding='utf-8')

        # Create CNAME for surge.sh
        cname_path = output_dir / "CNAME"
        cname_path.write_text("flame-and-forget.surge.sh\n", encoding='utf-8')

        print(f"   Successfully created {output_path.relative_to(project_dir)} ({bundled_size:,} bytes)")
        print(f"   Created {cname_path.relative_to(project_dir)} for surge.sh deployment")


def main():
    parser = argparse.ArgumentParser(
        description='Build a single self-contained HTML file',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python build.py              # Preview what will be built (dry run)
  python build.py --live       # Actually build the file
        """
    )
    parser.add_argument(
        '--live',
        action='store_true',
        help='Actually write the bundled file (default is dry run)'
    )

    args = parser.parse_args()
    build(dry_run=not args.live)


if __name__ == '__main__':
    main()
