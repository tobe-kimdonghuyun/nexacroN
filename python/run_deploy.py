from __future__ import annotations

import argparse
import os
import re
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path

from common import (base_dir, find_config, get_project_root, load_config,
                    log_debug, log_error, log_info, log_warn,
                    resolve_path, set_log_level, setup_stdio)

try:
    import winreg
except ImportError:
    winreg = None  # type: ignore[assignment]

VERSION_PATTERN   = re.compile(r'"version"\s*:\s*"([^"]+)"')
COMPONENT_FOLDERS = [
    "ComComp", "CompBase", "CompBaseEx", "DesignComp", "DeviceAPI",
    "Graphics", "Grid", "ListView", "MobileComp", "Push", "XAgent",
]

PROJECT_ROOT = Path()
START_BAT    = Path()


# ── config 검증 ───────────────────────────────────────────────────────────────

def _validate(cfg: dict[str, str]) -> None:
    required = ["ProjectPath", "OutputPath", "DeployPath", "NexacroLibPath", "GenerateRule"]
    missing  = [k for k in required if k not in cfg]
    if missing:
        raise ValueError(f"config 필수 항목 누락: {', '.join(missing)}")


# ── JAVA_HOME 탐색 ────────────────────────────────────────────────────────────

def _java_home_candidate(value: str) -> Path:
    """Return the JAVA_HOME directory for either a home path or java.exe path."""
    p = Path(value.strip().strip('"'))
    if p.name.lower() == "java.exe":
        return p.parent.parent
    return p


def _valid_java_home(value: str) -> str | None:
    if not value:
        return None
    home = _java_home_candidate(value)
    return str(home) if (home / "bin" / "java.exe").exists() else None


def find_java_home(cfg: dict[str, str] | None = None) -> str:
    cfg = cfg or {}

    config_java_home = _valid_java_home(cfg.get("JAVA_HOME", ""))
    if config_java_home:
        return config_java_home

    env_java_home = os.environ.get("JAVA_HOME", "").strip()
    java_home = _valid_java_home(env_java_home)
    if java_home:
        return java_home
    if env_java_home:
        log_warn(f"JAVA_HOME is set but invalid: {env_java_home}")

    log_info("[INFO] JAVA_HOME 미설정. 자동 탐색 중...")

    fixed = Path(r"C:\microsoft-jdk-21.0.9-windows-x64\jdk-21.0.9+10")
    if (fixed / "bin" / "java.exe").exists():
        return str(fixed)

    if winreg:
        for reg_path in (r"SOFTWARE\JavaSoft\JDK",
                         r"SOFTWARE\JavaSoft\Java Runtime Environment"):
            try:
                with winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, reg_path) as k:
                    ver = winreg.QueryValueEx(k, "CurrentVersion")[0]
                with winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, rf"{reg_path}\{ver}") as k:
                    java_home = _valid_java_home(winreg.QueryValueEx(k, "JavaHome")[0])
                    if java_home:
                        return java_home
            except OSError:
                continue

    java_exe = shutil.which("java")
    if java_exe:
        return str(Path(java_exe).parent.parent)

    raise RuntimeError("JAVA_HOME 을 찾을 수 없습니다. 환경변수 JAVA_HOME 을 설정하세요.")


# ── 단계별 함수 ───────────────────────────────────────────────────────────────

def step4_clean_dirs(output: Path, deploy: Path) -> None:
    for p in (output, deploy):
        if p.exists():
            log_debug(f"[INFO] 삭제: {p}")
            shutil.rmtree(p)
        p.mkdir(parents=True)
        log_debug(f"[INFO] 생성: {p}")


def step8_run_deploy(cfg: dict[str, str], root: Path, java_home: str) -> None:
    env = os.environ.copy()
    env["JAVA_HOME"] = java_home

    cmd = [
        "cmd", "/c", str(START_BAT),
        "-P", str(resolve_path(cfg["ProjectPath"],    root)),
        "-B", str(resolve_path(cfg["NexacroLibPath"], root)),
        "-O", str(resolve_path(cfg["OutputPath"],     root)),
        "-GENERATERULE", str(resolve_path(cfg["GenerateRule"], root)),
        "-D", str(resolve_path(cfg["DeployPath"],     root)),
    ]
    if cfg.get("-MERGE"):    cmd.append("-MERGE")
    if cfg.get("-COMPRESS"): cmd.append("-COMPRESS")
    if cfg.get("-SHRINK"):   cmd.append("-SHRINK")

    log_info(f"[INFO] 배포 실행: {START_BAT.name}")
    log_debug(f"[INFO] 실행 명령: {' '.join(cmd)}")
    result = subprocess.run(cmd, cwd=START_BAT.parent, env=env,
                            stdin=subprocess.DEVNULL)
    if result.returncode != 0:
        raise RuntimeError(f"배포 실행 실패 (exit code: {result.returncode})")


def step9_build_engine(cfg: dict[str, str], root: Path, engine_dir: Path) -> None:
    log_info(f"[INFO] deploy_engine 생성: {engine_dir}")
    if engine_dir.exists():
        shutil.rmtree(engine_dir)
    engine_dir.mkdir(parents=True)

    nexlib_src = resolve_path(cfg["DeployPath"], root) / "nexacrolib"
    if nexlib_src.exists():
        shutil.copytree(nexlib_src, engine_dir / "nexacrolib")
        log_debug("[INFO] nexacrolib 복사 완료")
    else:
        log_warn(f"nexacrolib 없음: {nexlib_src}")

    gr_src = resolve_path(cfg["GenerateRule"], root)
    if gr_src.exists():
        shutil.copytree(gr_src, engine_dir / gr_src.name)
        log_debug(f"[INFO] GenerateRule 복사 완료: {gr_src.name}")
    else:
        log_warn(f"GenerateRule 없음: {gr_src}")


def step10_copy_components(engine_dir: Path) -> None:
    comp_src  = PROJECT_ROOT / "nexacrolib" / "nexacrolib" / "component"
    comp_dest = engine_dir / "nexacrolib" / "component"
    comp_dest.mkdir(parents=True, exist_ok=True)

    count = sum(
        1 for f in comp_src.glob("*.json")
        if shutil.copy2(f, comp_dest / f.name) or True
    )
    log_info(f"[INFO] component JSON 복사: {count}개")

    for folder in COMPONENT_FOLDERS:
        src_folder = comp_src / folder
        if not src_folder.exists():
            continue
        for sub in (d for d in src_folder.iterdir() if d.is_dir()):
            shutil.copytree(sub, comp_dest / folder / sub.name, dirs_exist_ok=True)
    log_debug("[INFO] component 하위 폴더 복사 완료")


def step10_1_replace_min_json(engine_dir: Path) -> None:
    comp_dest = engine_dir / "nexacrolib" / "component"
    if not comp_dest.exists():
        log_warn("component 폴더 없음, min.json 교체 건너뜀")
        return
    replaced = 0
    for min_file in comp_dest.rglob("*.min.json"):
        base_file = min_file.parent / min_file.name.replace(".min.json", ".json")
        if base_file.exists():
            base_file.unlink()
        min_file.rename(base_file)
        replaced += 1
    log_info(f"[INFO] min.json 교체: {replaced}개" if replaced else "[INFO] *.min.json 없음, 건너뜀")


def step10_2_copy_nexacrolib_json(engine_dir: Path) -> None:
    src = PROJECT_ROOT / "nexacrolib" / "nexacrolib" / "nexacrolib.json"
    dst = engine_dir / "nexacrolib" / "nexacrolib.json"
    if src.exists():
        shutil.copy2(src, dst)
        log_debug("[INFO] nexacrolib.json 복사 완료")
    else:
        log_warn(f"nexacrolib.json 없음: {src}")


def step10_3_copy_designcomp(engine_dir: Path) -> None:
    src = PROJECT_ROOT / "nexacrolib" / "nexacrolib" / "component" / "DesignComp"
    dst = engine_dir / "nexacrolib" / "component" / "DesignComp"
    if src.exists():
        shutil.copytree(src, dst, dirs_exist_ok=True)
        log_debug("[INFO] DesignComp 복사 완료")
    else:
        log_warn(f"DesignComp 없음: {src}")


def step10_4_copy_resource_json(engine_dir: Path) -> None:
    src = PROJECT_ROOT / "nexacrolib" / "nexacrolib" / "resources" / "Resource.json"
    dst = engine_dir / "nexacrolib" / "resources" / "Resource.json"
    dst.parent.mkdir(parents=True, exist_ok=True)
    if src.exists():
        shutil.copy2(src, dst)
        log_debug("[INFO] Resource.json 복사 완료")
    else:
        log_warn(f"Resource.json 없음: {src}")


def step11_copy_framework(engine_dir: Path) -> None:
    fw_src  = PROJECT_ROOT / "nexacrolib" / "nexacrolib" / "framework"
    fw_dest = engine_dir / "nexacrolib" / "framework"
    fw_dest.mkdir(parents=True, exist_ok=True)

    min_json = fw_src / "Framework.min.json"
    if min_json.exists():
        shutil.copy2(min_json, fw_dest / "Framework.json")
        log_debug("[INFO] Framework.min.json -> Framework.json 완료")
    else:
        log_warn(f"Framework.min.json 없음: {min_json}")

    metainfo = fw_src / "metainfo"
    if metainfo.exists():
        shutil.copytree(metainfo, fw_dest / "metainfo", dirs_exist_ok=True)
        log_debug("[INFO] metainfo 복사 완료")
    else:
        log_warn(f"metainfo 없음: {metainfo}")


def step12_replace_version(engine_dir: Path) -> None:
    log_info(f"\n[INFO] version 문자열 교체: {engine_dir / 'nexacrolib'}")
    pattern     = re.compile(r'"version"\s*:\s*"21\.0\.0\.9999"')
    replacement = '"version": "24.0.0.9999"'
    count = 0
    for json_file in (engine_dir / "nexacrolib").rglob("*.json"):
        try:
            content     = json_file.read_text(encoding="utf-8")
            new_content = pattern.sub(replacement, content)
            if content != new_content:
                json_file.write_text(new_content, encoding="utf-8")
                count += 1
        except Exception as e:
            log_warn(f"{json_file.name} 처리 실패: {e}")
    log_info(f"[INFO] version 교체 완료: {count}개")


def step13_zip(engine_dir: Path, ignore: bool) -> None:
    if ignore:
        log_info("\n[INFO] zip 생성 건너뜀 (-ignore)")
        return

    nexlib_json = engine_dir / "nexacrolib" / "nexacrolib.json"
    version = ""
    try:
        m = VERSION_PATTERN.search(nexlib_json.read_text(encoding="utf-8"))
        if m:
            version = m.group(1)
    except Exception:
        pass

    version_tag = f"({version})" if version else ""
    zip_name    = f"nexacrolib_Merge_Compress_Shrink{version_tag}.zip"
    zip_out     = engine_dir / zip_name

    log_info(f"\n[INFO] zip 압축: {zip_out}")
    if zip_out.exists():
        zip_out.unlink()

    try:
        with zipfile.ZipFile(zip_out, "w", zipfile.ZIP_DEFLATED) as zf:
            for f in engine_dir.rglob("*"):
                if f.is_file() and f != zip_out:
                    zf.write(f, f.relative_to(engine_dir))
        log_info(f"[INFO] zip 생성 완료: {zip_out}")
    except Exception as e:
        log_warn(f"zip 생성 실패: {e}")


# ── run / main ────────────────────────────────────────────────────────────────

def run(cfg: dict[str, str], root: Path, ignore: bool = False) -> None:
    global PROJECT_ROOT, START_BAT
    PROJECT_ROOT = root
    START_BAT    = root / "Jar" / "bin" / "start.bat"

    _validate(cfg)

    output_path = resolve_path(cfg["OutputPath"], root)
    deploy_path = resolve_path(cfg["DeployPath"], root)
    engine_dir  = root / "deploy_engine"

    step4_clean_dirs(output_path, deploy_path)

    java_home = find_java_home(cfg)
    log_info(f"[INFO] JAVA_HOME: {java_home}")

    if not START_BAT.exists():
        raise FileNotFoundError(f"start.bat 없음: {START_BAT}")

    step8_run_deploy(cfg, root, java_home)
    step9_build_engine(cfg, root, engine_dir)
    step10_copy_components(engine_dir)
    step10_1_replace_min_json(engine_dir)
    step10_2_copy_nexacrolib_json(engine_dir)
    step10_3_copy_designcomp(engine_dir)
    step10_4_copy_resource_json(engine_dir)
    step11_copy_framework(engine_dir)
    step12_replace_version(engine_dir)
    step13_zip(engine_dir, ignore)

    log_info("\n[SUCCESS] 배포 완료")


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Nexacro 배포 파이프라인",
        allow_abbrev=False,
    )
    parser.add_argument("-config", metavar="FILE")
    parser.add_argument("-ignore", action="store_true")
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

    if not cfg_path or not cfg_path.exists():
        log_error("config 파일을 찾을 수 없습니다.")
        sys.exit(1)

    cfg  = load_config(cfg_path)
    root = get_project_root(cfg)
    set_log_level(cfg.get("LOG", "DEBUG"))

    try:
        run(cfg, root, ignore=args.ignore)
    except Exception as e:
        log_error(str(e))
        sys.exit(1)


if __name__ == "__main__":
    main()
