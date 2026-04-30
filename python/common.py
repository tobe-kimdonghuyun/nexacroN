from __future__ import annotations

import sys
from pathlib import Path


def base_dir() -> Path:
    """PyInstaller exe 또는 .py 스크립트 위치를 반환."""
    if getattr(sys, "frozen", False):
        return Path(sys.executable).resolve().parent
    return Path(__file__).resolve().parent


def load_config(path: Path) -> dict[str, str]:
    """key=value 및 -FLAG 형식의 config 파일을 파싱."""
    cfg: dict[str, str] = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("-"):
            cfg[line.upper()] = "1"
        elif "=" in line:
            k, _, v = line.partition("=")
            cfg[k.strip()] = v.strip()
    return cfg


def find_config(search_dir: Path, pattern: str = "nexacro_config*.txt") -> Path | None:
    """search_dir 에서 pattern 에 맞는 config 파일을 자동 탐색.
    1개면 자동 선택, 여러 개면 목록 출력 후 선택 요청."""
    files = sorted(search_dir.glob(pattern))
    if not files:
        return None
    if len(files) == 1:
        print(f"[INFO] Config 자동 선택: {files[0].name}")
        return files[0]
    print("[INFO] 여러 config 파일이 발견되었습니다:")
    for f in files:
        print(f"       - {f.name}")
    print()
    sel = input("사용할 파일명을 입력하세요: ").strip()
    chosen = search_dir / sel if sel else files[0]
    return chosen if chosen.exists() else files[0]


def get_project_root(cfg: dict[str, str]) -> Path:
    """PROJECT_ROOT 결정.
    우선순위: config 명시 > exe/스크립트 위치의 바로 위 폴더."""
    if "PROJECT_ROOT" in cfg:
        return Path(cfg["PROJECT_ROOT"]).resolve()
    return base_dir().parent


def resolve_path(value: str, root: Path) -> Path:
    """절대 경로면 그대로, 상대 경로면 root 기준 절대 경로로 변환."""
    p = Path(value)
    return p.resolve() if p.is_absolute() else (root / p).resolve()


def setup_stdio() -> None:
    """Windows cmd 인코딩 문제 방지."""
    if sys.stdout and hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if sys.stderr and hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
