from __future__ import annotations

import re
import shutil
import sys
import urllib.parse
import urllib.request
import zipfile
from html.parser import HTMLParser
from pathlib import Path

from common import (base_dir, find_config, get_project_root,
                    load_config, resolve_path, setup_stdio)

_BASE_URL_DEFAULT = (
    "http://59.10.169.82:9900/NexacroN/serverN/Deploy_JAVA/%EB%B6%84%EB%A6%AC_Jar/"
)

# run() / main() 에서 설정되는 전역 변수
BASE_URL   = _BASE_URL_DEFAULT
TARGET_DIR = Path()


# ── HTML 링크 파싱 ─────────────────────────────────────────────────────────────

class _LinkParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag == "a":
            for name, value in attrs:
                if name == "href" and value:
                    self.links.append(value)


def _fetch_links(url: str) -> list[str]:
    with urllib.request.urlopen(url) as resp:
        html = resp.read().decode("utf-8", errors="replace")
    parser = _LinkParser()
    parser.feed(html)
    return [urllib.parse.urljoin(url, href) for href in parser.links]


# ── 최신 연도 / 파일 탐색 ──────────────────────────────────────────────────────

def _latest_year() -> str:
    links = _fetch_links(BASE_URL)
    years = [
        m.group(1)
        for href in links
        if (m := re.search(r'/(\d{4})/?$', href))
    ]
    if not years:
        raise RuntimeError("연도 폴더를 찾을 수 없습니다.")
    return sorted(years, reverse=True)[0]


def _latest_file(year_url: str) -> str:
    links = _fetch_links(year_url)
    files = [
        urllib.parse.unquote(href.rstrip("/").split("/")[-1])
        for href in links
        if re.search(r'\.(zip|jar)$', href, re.IGNORECASE)
    ]
    if not files:
        raise RuntimeError("zip/jar 파일을 찾을 수 없습니다.")
    return sorted(files, reverse=True)[0]


# ── 다운로드 ──────────────────────────────────────────────────────────────────

def _download(url: str, dest: Path) -> None:
    print(f"[INFO] 다운로드: {url}")
    with urllib.request.urlopen(url) as resp:
        total    = int(resp.headers.get("Content-Length", 0))
        received = 0
        chunk    = 1024 * 256
        with open(dest, "wb") as f:
            while True:
                data = resp.read(chunk)
                if not data:
                    break
                f.write(data)
                received += len(data)
                if total:
                    print(f"\r     {received // 1024:,} KB / {total // 1024:,} KB"
                          f"  ({received * 100 // total}%)", end="", flush=True)
    print()


def _extract(zip_path: Path, dest: Path) -> None:
    with zipfile.ZipFile(zip_path, "r") as zf:
        zf.extractall(dest)


def _move(src: Path, dest_dir: Path) -> None:
    dst = dest_dir / src.name
    if dst.exists():
        shutil.rmtree(dst) if dst.is_dir() else dst.unlink()
    shutil.move(str(src), dest_dir)


# ── 단계별 함수 ───────────────────────────────────────────────────────────────

def step0_clean(target: Path) -> None:
    print(f"[0] 대상 폴더 초기화: {target}")
    if target.exists():
        for item in target.iterdir():
            print(f"    -> 삭제: {item.name}")
            shutil.rmtree(item) if item.is_dir() else item.unlink()
    else:
        target.mkdir(parents=True)
        print(f"    -> 생성: {target}")


def step1_find_year() -> str:
    year = _latest_year()
    print(f"[1] 최신 연도: {year}")
    return year


def step2_find_file(year: str) -> tuple[str, str]:
    year_url = f"{BASE_URL}{year}/"
    fname    = _latest_file(year_url)
    print(f"[2] 최신 파일: {fname}")
    return year_url, fname


def step3_download(year_url: str, fname: str) -> Path:
    file_url      = year_url + urllib.parse.quote(fname)
    download_path = TARGET_DIR / "download.zip"
    _download(file_url, download_path)
    return download_path


def step4_extract_level1(download_path: Path) -> Path:
    print("[4] 1차 압축 해제...")
    level1 = TARGET_DIR / "level1"
    level1.mkdir()
    _extract(download_path, level1)
    download_path.unlink()
    return level1


def step5_extract_level2(level1: Path) -> None:
    inner_zips = list(level1.glob("*.zip"))
    if inner_zips:
        print(f"[5] 중첩 ZIP 발견: {inner_zips[0].name} — 2차 압축 해제...")
        _extract(inner_zips[0], TARGET_DIR)
        for item in level1.iterdir():
            if item.suffix.lower() != ".zip":
                _move(item, TARGET_DIR)
    else:
        print("[5] 중첩 ZIP 없음 — 1차 해제 결과를 최종 위치로 이동...")
        for item in level1.iterdir():
            _move(item, TARGET_DIR)


def step6_cleanup(level1: Path) -> None:
    if level1.exists():
        shutil.rmtree(level1)
        print("[6] 임시 폴더 정리 완료")


def step7_flatten() -> None:
    subdirs = [d for d in TARGET_DIR.iterdir() if d.is_dir()]
    if len(subdirs) == 1 and re.match(r'^NexacroN_Deploy_JAVA_', subdirs[0].name):
        sub = subdirs[0]
        print(f"[7] 단일 서브폴더 감지 — 콘텐츠를 상위로 이동: {sub.name}")
        for item in list(sub.iterdir()):
            _move(item, TARGET_DIR)
        sub.rmdir()


# ── run / main ────────────────────────────────────────────────────────────────

def run(cfg: dict[str, str], root: Path) -> None:
    """pipeline 또는 단독 실행 공통 진입점."""
    global BASE_URL, TARGET_DIR
    BASE_URL   = cfg.get("JAR_SERVER_URL", _BASE_URL_DEFAULT)
    TARGET_DIR = resolve_path(cfg.get("JAR_DIR", "Jar"), root)

    print("==========================================")
    print("Updating JAR (BUNRI_JAR)...")
    print(f"[INFO] 대상 폴더: {TARGET_DIR}")

    step0_clean(TARGET_DIR)
    year            = step1_find_year()
    year_url, fname = step2_find_file(year)
    dl              = step3_download(year_url, fname)
    level1          = step4_extract_level1(dl)
    step5_extract_level2(level1)
    step6_cleanup(level1)
    step7_flatten()

    print("[Done] JAR 업데이트 완료.")
    print("==========================================")


def main() -> None:
    setup_stdio()
    script_dir = base_dir()
    cfg_path   = find_config(script_dir)
    cfg        = load_config(cfg_path) if cfg_path else {}
    root       = get_project_root(cfg)

    try:
        run(cfg, root)
    except Exception as e:
        print(f"\n[Error] {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
