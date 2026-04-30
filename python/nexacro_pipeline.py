from __future__ import annotations

import argparse
import sys
from pathlib import Path

from common import (base_dir, find_config, get_project_root, load_config,
                    log_info, log_error, set_log_level, setup_stdio)
import update_jar
import update_framework
import run_deploy


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Nexacro 배포 파이프라인 통합 실행기\n"
                    "순서: [1] update_jar → [2] update_framework → [3] run_deploy",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        allow_abbrev=False,
    )
    parser.add_argument("-config",  metavar="FILE",
                        help="config 파일 경로/파일명 (생략 시 nexacro_config*.txt 자동 탐색)")
    parser.add_argument("-branch",  metavar="BRANCH",
                        help="[2단계] 브랜치명 오버라이드 (config 의 BRANCH 보다 우선)")
    parser.add_argument("-version", metavar="VER",
                        help="[2단계] version 값 오버라이드 (config 의 VERSION 보다 우선)")
    parser.add_argument("-skip-jar",       action="store_true", help="[1단계] JAR 업데이트 건너뜀")
    parser.add_argument("-skip-framework", action="store_true", help="[2단계] 프레임워크 업데이트 건너뜀")
    parser.add_argument("-skip-deploy",    action="store_true", help="[3단계] 배포 건너뜀")
    parser.add_argument("-ignore",         action="store_true", help="zip 파일 생성 건너뜀 (2·3단계 모두 적용)")
    return parser.parse_args()


def _separator(title: str) -> None:
    bar = "=" * 60
    log_info(f"\n{bar}")
    log_info(f"  {title}")
    log_info(f"{bar}")


def main() -> None:
    setup_stdio()
    args       = parse_args()
    script_dir = base_dir()

    # ── config 파일 결정 ──────────────────────────────────────────
    if args.config:
        p        = Path(args.config)
        cfg_path = p if p.is_absolute() and p.exists() else script_dir / args.config
        if not cfg_path.exists():
            log_error(f"config 파일을 찾을 수 없습니다: {cfg_path}")
            sys.exit(1)
    else:
        cfg_path = find_config(script_dir)
        if not cfg_path:
            log_error("nexacro_config*.txt 파일을 찾을 수 없습니다.")
            log_error("nexacro_config.txt 를 생성하고 설정을 입력하세요.")
            sys.exit(1)

    log_info(f"[INFO] Config: {cfg_path}")
    cfg  = load_config(cfg_path)
    root = get_project_root(cfg)
    set_log_level(cfg.get("LOG", "DEBUG"))
    log_info(f"[INFO] PROJECT_ROOT: {root}")
    log_info(f"[INFO] LOG 레벨: {cfg.get('LOG', 'DEBUG')}")

    # 인자 우선, 없으면 config 값 사용
    skip_jar       = args.skip_jar       or cfg.get("SKIP_JAR",       "0") == "1"
    skip_framework = args.skip_framework or cfg.get("SKIP_FRAMEWORK", "0") == "1"
    skip_deploy    = args.skip_deploy    or cfg.get("SKIP_DEPLOY",    "0") == "1"
    ignore         = args.ignore         or cfg.get("IGNORE",         "0") == "1"

    results: dict[str, str] = {}

    # ── [1단계] update_jar ───────────────────────────────────────
    if skip_jar:
        log_info("\n[1/3] JAR 업데이트 건너뜀 (SKIP_JAR)")
        results["JAR"] = "SKIPPED"
    else:
        _separator("[1/3] JAR 업데이트")
        try:
            update_jar.run(cfg, root)
            results["JAR"] = "OK"
        except Exception as e:
            log_error(f"JAR 업데이트 실패: {e}")
            results["JAR"] = f"FAILED: {e}"
            sys.exit(1)

    # ── [2단계] update_framework ─────────────────────────────────
    if skip_framework:
        log_info("\n[2/3] 프레임워크 업데이트 건너뜀 (SKIP_FRAMEWORK)")
        results["FRAMEWORK"] = "SKIPPED"
    else:
        _separator("[2/3] 프레임워크 업데이트")
        try:
            update_framework.run(
                cfg, root,
                branch=args.branch  or "",
                version=args.version or "",
                ignore=ignore,
            )
            results["FRAMEWORK"] = "OK"
        except Exception as e:
            log_error(f"프레임워크 업데이트 실패: {e}")
            results["FRAMEWORK"] = f"FAILED: {e}"
            sys.exit(1)

    # ── [3단계] run_deploy ───────────────────────────────────────
    if skip_deploy:
        log_info("\n[3/3] 배포 건너뜀 (SKIP_DEPLOY)")
        results["DEPLOY"] = "SKIPPED"
    else:
        _separator("[3/3] 배포")
        try:
            run_deploy.run(cfg, root, ignore=ignore)
            results["DEPLOY"] = "OK"
        except Exception as e:
            log_error(f"배포 실패: {e}")
            results["DEPLOY"] = f"FAILED: {e}"
            sys.exit(1)

    # ── 최종 결과 요약 ───────────────────────────────────────────
    _separator("파이프라인 완료")
    for step, status in results.items():
        icon = "✓" if status in ("OK", "SKIPPED") else "✗"
        log_info(f"  {icon}  {step:<12} {status}")
    log_info("")


if __name__ == "__main__":
    main()
