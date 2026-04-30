from __future__ import annotations

import argparse
import re
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path

from common import (base_dir, find_config, get_project_root,
                    load_config, resolve_path, setup_stdio)

UTF8_BOM = b"\xef\xbb\xbf"

# run() / main() 에서 설정되는 전역 변수
SOURCE_DIR    = Path()
FRAMEWORK_SRC = Path()
GEN_SRC1      = Path()
GEN_SRC2      = Path()

VERSION_PATTERN = re.compile(r'"version"\s*:\s*"[^"]*"')


# ── git ──────────────────────────────────────────────────────────────────────

def git(args: list[str], cwd: Path) -> str:
    result = subprocess.run(
        ["git", "-c", "i18n.logoutputencoding=utf-8"] + args,
        cwd=cwd, capture_output=True, text=True,
        encoding="utf-8", errors="replace",
    )
    if result.returncode != 0:
        print(f"[ERROR] git {' '.join(args)} 실패\n{result.stderr.strip()}")
        sys.exit(result.returncode)
    return result.stdout.strip()


def step1_git_update(branch: str) -> tuple[str, str]:
    print(f"[1/5] 소스 저장소 업데이트: {SOURCE_DIR}  (branch: {branch})")
    git(["checkout", branch], SOURCE_DIR)
    git(["pull", "origin", branch], SOURCE_DIR)
    commit_hash = git(["rev-parse", "HEAD"], SOURCE_DIR)
    commit_msg  = git(["log", "-1", "--pretty=format:%s"], SOURCE_DIR)
    return commit_hash, commit_msg


# ── 파일 복사 ─────────────────────────────────────────────────────────────────

def copy_dir(src: Path, dst: Path) -> None:
    if dst.exists():
        shutil.rmtree(dst)
    shutil.copytree(src, dst)


def step2_copy_framework(dest_dir: Path) -> bool:
    print(f"[2/5] 프레임워크 복사 -> {dest_dir}")
    dest_dir.mkdir(parents=True, exist_ok=True)
    ok = True
    for folder in ("component", "framework", "resources"):
        try:
            copy_dir(FRAMEWORK_SRC / folder, dest_dir / folder)
        except Exception as e:
            print(f"[ERROR] {folder} 복사 실패: {e}")
            ok = False
    try:
        shutil.copy2(FRAMEWORK_SRC / "nexacrolib.json", dest_dir / "nexacrolib.json")
    except Exception as e:
        print(f"[ERROR] nexacrolib.json 복사 실패: {e}")
        ok = False
    return ok


# ── version 변경 ──────────────────────────────────────────────────────────────

def step_update_version(dest_dir: Path, version: str) -> bool:
    print(f"[INFO] JSON version -> {version}")
    replacement = f'"version":"{version}"'
    changed = 0
    ok = True
    for json_file in dest_dir.rglob("*.json"):
        try:
            content     = json_file.read_text(encoding="utf-8")
            new_content = VERSION_PATTERN.sub(replacement, content)
            if content != new_content:
                json_file.write_text(new_content, encoding="utf-8")
                print(f"[CHANGED] {json_file.name}")
                changed += 1
        except Exception as e:
            print(f"[WARN] {json_file.name} 처리 실패: {e}")
            ok = False
    print(f"[INFO] 변경된 파일: {changed}개")
    return ok


# ── UTF-8 BOM 변환 ────────────────────────────────────────────────────────────

def _decode(raw: bytes) -> str:
    for enc in ("utf-8-sig", "utf-8", "cp949"):
        try:
            return raw.decode(enc)
        except UnicodeDecodeError:
            continue
    return raw.decode("utf-8", errors="replace")


def step3_convert_utf8bom(dest_dir: Path) -> bool:
    print(f"[3/5] JS 파일 UTF-8 BOM 변환: {dest_dir}")
    converted = 0
    ok = True
    for js_file in dest_dir.rglob("*.js"):
        try:
            raw = js_file.read_bytes()
            if raw.startswith(UTF8_BOM):
                continue
            js_file.write_bytes(UTF8_BOM + _decode(raw).encode("utf-8"))
            converted += 1
        except Exception as e:
            print(f"[WARN] {js_file.name} 변환 실패: {e}")
            ok = False
    print(f"[INFO] 변환된 파일: {converted}개")
    return ok


# ── Generate Rule 복사 ────────────────────────────────────────────────────────

def step4_copy_generate(gen_dest: Path) -> bool:
    print(f"[4/5] Generate Rule 복사 -> {gen_dest}")
    if gen_dest.exists():
        shutil.rmtree(gen_dest)
    gen_dest.mkdir(parents=True)
    ok = True
    for src in (GEN_SRC1, GEN_SRC2):
        try:
            for item in src.iterdir():
                dst = gen_dest / item.name
                if item.is_dir():
                    shutil.copytree(item, dst, dirs_exist_ok=True)
                else:
                    shutil.copy2(item, dst)
        except Exception as e:
            print(f"[ERROR] Generate Rule 복사 실패 ({src.name}): {e}")
            ok = False
    return ok


# ── zip 압축 ──────────────────────────────────────────────────────────────────

def _get_version(dest_dir: Path) -> str:
    try:
        content = (dest_dir / "nexacrolib.json").read_text(encoding="utf-8")
        m = re.search(r'"version"\s*:\s*"([^"]+)"', content)
        return m.group(1) if m else ""
    except Exception:
        return ""


def step5_zip(nexacrolib_root: Path, dest_dir: Path, gen_dest: Path) -> bool:
    version     = _get_version(dest_dir)
    version_tag = f"({version})" if version else ""
    zip_name    = f"nexacrolib_noMerge_noCompress_noShrink{version_tag}.zip"
    zip_out     = nexacrolib_root / zip_name
    print(f"[5/5] zip 압축 -> {zip_out}")
    if zip_out.exists():
        zip_out.unlink()
    try:
        with zipfile.ZipFile(zip_out, "w", zipfile.ZIP_DEFLATED) as zf:
            for folder in (dest_dir, gen_dest):
                base = folder.parent
                for f in folder.rglob("*"):
                    if f.is_file():
                        zf.write(f, f.relative_to(base))
        print(f"[INFO] zip 생성 완료: {zip_out}")
        return True
    except Exception as e:
        print(f"[WARN] zip 생성 실패: {e}")
        return False


# ── run / main ────────────────────────────────────────────────────────────────

def run(cfg: dict[str, str], root: Path,
        branch: str = "", version: str = "", ignore: bool = False) -> None:
    """pipeline 또는 단독 실행 공통 진입점."""
    global SOURCE_DIR, FRAMEWORK_SRC, GEN_SRC1, GEN_SRC2

    if "SOURCE_DIR" not in cfg:
        raise ValueError("config 에 SOURCE_DIR 이 없습니다.")

    SOURCE_DIR    = Path(cfg["SOURCE_DIR"]).resolve()
    FRAMEWORK_SRC = SOURCE_DIR / "Lib" / "FrameworkJS"
    GEN_SRC1      = SOURCE_DIR / "Tools" / "Lib" / "TiMetainfoLib" / "res"
    GEN_SRC2      = SOURCE_DIR / "Tools" / "Lib" / "TiGenerateLib" / "Template" / "24"

    dest    = resolve_path(cfg.get("NEXACROLIB_DIR", r"nexacrolib\nexacrolib"), root)
    gen     = resolve_path(cfg.get("GENERATE_DIR",   r"nexacrolib\generate"),   root)
    nexroot = dest.parent

    branch  = branch  or cfg.get("BRANCH",  "")
    version = version or cfg.get("VERSION", "")

    if not branch:
        branch = input("branch 명을 입력하세요: ").strip()
    if not branch:
        raise ValueError("branch 명이 필요합니다.")

    ok = True
    commit_hash, commit_msg = step1_git_update(branch)

    if not step2_copy_framework(dest):
        ok = False
    if version:
        if not step_update_version(dest, version):
            ok = False
    if not step3_convert_utf8bom(dest):
        ok = False
    if not step4_copy_generate(gen):
        ok = False

    if ignore:
        print("\n[5/5] zip 생성 건너뜀 (-ignore)")
    else:
        if not step5_zip(nexroot, dest, gen):
            ok = False

    print()
    if ok:
        print("[SUCCESS] 프레임워크 업데이트 완료")
        print(f"          Branch  : {branch}")
        print(f"          Hash    : {commit_hash}")
        print(f"          Message : {commit_msg}")
        if version:
            print(f"          Version : {version}")
    else:
        raise RuntimeError("일부 단계가 실패했습니다.")


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Nexacro 프레임워크 업데이트",
        allow_abbrev=False,
    )
    parser.add_argument("branch",   nargs="?", default=None, help="브랜치명 (생략 시 입력 요청)")
    parser.add_argument("-config",  metavar="FILE", help="config 파일 경로/파일명")
    parser.add_argument("-version", metavar="VER",  help="version 값 변경")
    parser.add_argument("-ignore",  action="store_true", help="zip 생성 건너뜀")
    return parser.parse_args()


def main() -> None:
    setup_stdio()
    args       = _parse_args()
    script_dir = base_dir()

    if args.config:
        p        = Path(args.config)
        cfg_path = p if p.is_absolute() and p.exists() else script_dir / args.config
    else:
        cfg_path = find_config(script_dir)

    cfg  = load_config(cfg_path) if cfg_path and cfg_path.exists() else {}
    root = get_project_root(cfg)

    try:
        run(cfg, root,
            branch=args.branch or "",
            version=args.version or "",
            ignore=args.ignore)
    except Exception as e:
        print(f"\n[ERROR] {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
