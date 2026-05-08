# Nexacro 배포 파이프라인 사용 설명서

## 파일 구성

```
python/
├── common.py              공통 유틸리티 (경로 해석, config 파싱)
├── nexacro_config.txt     통합 설정 파일 (환경에 맞게 편집)
├── nexacro_pipeline.py    통합 실행기 (3단계 순서 자동 실행)
├── update_jar.py          [1단계] JAR 다운로드
├── update_framework.py    [2단계] 프레임워크 파일 복사
└── run_deploy.py          [3단계] Nexacro 빌드 및 배포
```

---

## 최초 설정 (PC 이동 시 필수)

`nexacro_config.txt` 파일을 열고 환경에 맞게 수정합니다.

```ini
# 프로젝트 루트 (다른 경로에 설치한 경우만 명시)
PROJECT_ROOT=D:\내_프로젝트\nexacroN

# [2단계] 소스 저장소 경로 (PC마다 다름 - 필수)
SOURCE_DIR=E:\git\Antigravity_WORK800\WORK800
```

> **상대 경로**: `Jar`, `nexacrolib\nexacrolib` 처럼 드라이브 없이 시작하면
> PROJECT_ROOT 기준으로 자동 변환됩니다.
> 별도 지정이 없는 항목은 기본값으로 동작합니다.

---

## 실행 방법

### 통합 실행 (권장)

3단계를 순서대로 자동 실행합니다.

```bat
python nexacro_pipeline.py
```

또는 exe 빌드 후:

```bat
nexacro_pipeline.exe
```

#### 주요 옵션

| 옵션 | 설명 |
|---|---|
| `-config FILE` | config 파일 지정 (생략 시 자동 탐색) |
| `-branch BRANCH` | [2단계] 브랜치 오버라이드 |
| `-version VER` | [2단계] version 값 오버라이드 |
| `-skip-jar` | [1단계] JAR 업데이트 건너뜀 |
| `-skip-framework` | [2단계] 프레임워크 업데이트 건너뜀 |
| `-skip-deploy` | [3단계] 배포 건너뜀 |
| `-ignore` | zip 파일 생성 건너뜀 (2·3단계 모두 적용) |

#### 사용 예시

```bat
# 전체 실행
nexacro_pipeline.exe

# 브랜치 지정
nexacro_pipeline.exe -branch develop

# 버전 변경 포함
nexacro_pipeline.exe -branch main -version 24.0.0.1031

# JAR 업데이트 없이 2·3단계만
nexacro_pipeline.exe -skip-jar

# 특정 config 파일 사용
nexacro_pipeline.exe -config nexacro_config_dev.txt

# zip 없이 빠른 빌드
nexacro_pipeline.exe -ignore
```

---

### 단독 실행

각 단계를 개별적으로 실행할 수 있습니다.

#### [1단계] JAR 업데이트

```bat
update_jar.exe
```

서버에서 최신 JAR 패키지를 다운로드해 `Jar/` 폴더에 설치합니다.

---

#### [2단계] 프레임워크 업데이트

```bat
update_framework.exe [branch] [옵션]
```

| 인자/옵션 | 설명 |
|---|---|
| `branch` | 브랜치명 (생략 시 입력 요청 또는 config 의 BRANCH 사용) |
| `-version VER` | JSON 파일의 version 값 변경 |
| `-ignore` | zip 생성 건너뜀 |
| `-config FILE` | config 파일 지정 |

```bat
update_framework.exe main
update_framework.exe main -version 24.0.0.1031
update_framework.exe -ignore
```

---

#### [3단계] 배포

```bat
run_deploy.exe [옵션]
```

| 옵션 | 설명 |
|---|---|
| `-config FILE` | config 파일 지정 |
| `-ignore` | zip 생성 건너뜀 |

```bat
run_deploy.exe
run_deploy.exe -ignore
run_deploy.exe -config nexacro_config_dev.txt
```

---

## exe 빌드 방법

PyInstaller를 사용합니다.

```bat
pip install pyinstaller

# 통합 실행기 (권장)
pyinstaller --onefile --name nexacro_pipeline nexacro_pipeline.py

# 단독 실행기 개별 빌드
pyinstaller --onefile --name update_jar       update_jar.py
pyinstaller --onefile --name update_framework update_framework.py
pyinstaller --onefile --name run_deploy       run_deploy.py
```

빌드된 exe 는 `dist/` 폴더에 생성됩니다.

### exe 배치 규칙

```
nexacroN\
├── tools\                ← exe 를 여기에 복사 (tools/ 또는 python/)
│   └── nexacro_pipeline.exe
│   └── nexacro_config.txt   ← exe 와 같은 폴더에 위치
├── Jar\
├── nexacrolib\
└── deploy_engine\
```

> exe 는 반드시 PROJECT_ROOT 의 **한 단계 하위 폴더**에 위치해야 합니다.
> `nexacro_config.txt` 에 `PROJECT_ROOT` 를 명시하면 위치 제한 없이 사용할 수 있습니다.

---

## config 파일 상세 설명

### 공통 항목

| 키 | 필수 | 기본값 | 설명 |
|---|---|---|---|
| `PROJECT_ROOT` | ➖ | exe 위치의 상위 폴더 | 프로젝트 루트 절대 경로 |
| `LOG` | ➖ | `INFO` | 로그 출력 모드 (`INFO` 또는 `DEBUG`) |

### 파이프라인 제어 항목 (통합 실행기 전용)

| 키 | 기본값 | 설명 |
|---|---|---|
| `SKIP_JAR=1` | `0` | [1단계] JAR 업데이트 건너뜀 |
| `SKIP_FRAMEWORK=1` | `0` | [2단계] 프레임워크 업데이트 건너뜀 |
| `SKIP_DEPLOY=1` | `0` | [3단계] 배포 건너뜀 |
| `IGNORE=1` 또는 `-IGNORE` | — | zip 파일 생성 건너뜀 (2·3단계 모두 적용) |

> `-IGNORE` 는 플래그 형식으로도 사용할 수 있습니다 (`-MERGE`, `-COMPRESS` 방식과 동일).

```ini
# 예시: JAR 업데이트 없이 실행하고 zip 도 생성하지 않음
SKIP_JAR=1
-IGNORE
```

### [1단계] update_jar

| 키 | 필수 | 기본값 | 설명 |
|---|---|---|---|
| `JAR_SERVER_URL` | ➖ | 내부 서버 URL | JAR 다운로드 서버 |
| `JAR_DIR` | ➖ | `Jar` | JAR 저장 폴더 |

### [2단계] update_framework

| 키 | 필수 | 기본값 | 설명 |
|---|---|---|---|
| `SOURCE_DIR` | ✅ | — | 소스 저장소 절대 경로 |
| `BRANCH` | ➖ | 실행 중 입력 | checkout 브랜치 |
| `VERSION` | ➖ | 변경 없음 | JSON version 값 |
| `NEXACROLIB_DIR` | ➖ | `nexacrolib\nexacrolib` | 복사 대상 폴더 |
| `GENERATE_DIR` | ➖ | `nexacrolib\generate` | Generate Rule 폴더 |

### [3단계] run_deploy

| 키 | 필수 | 설명 |
|---|---|---|
| `ProjectPath` | ✅ | `.xprj` 프로젝트 파일 경로 |
| `OutputPath` | ✅ | 빌드 중간 출력 폴더 |
| `DeployPath` | ✅ | 배포 결과물 폴더 |
| `NexacroLibPath` | ✅ | nexacrolib 라이브러리 폴더 |
| `GenerateRule` | ✅ | Generate Rule 폴더 |
| `-MERGE` | ➖ | 머지 옵션 활성화 |
| `-COMPRESS` | ➖ | 압축 옵션 활성화 |
| `-SHRINK` | ➖ | Shrink 옵션 활성화 |

### zip 파일 생성 동작

- zip 생성 시 **동일 파일명이 존재하면 자동으로 삭제 후 재생성**합니다.
- 삭제 시 `[INFO] 기존 zip 파일 삭제: <파일명>` 로그가 출력됩니다.
- `-IGNORE` 또는 `IGNORE=1` 설정 시 zip 생성 단계 자체를 건너뜁니다.

---

## 로그 출력 모드

`nexacro_config.txt` 의 `LOG` 값으로 출력 상세도를 선택합니다.

### INFO 모드 (기본값)

단계 시작·완료, 건수 요약, 경고·에러만 출력합니다. 결과 확인에 적합합니다.

```
[1/5] 소스 저장소 업데이트: E:\git\... (branch: master)
[2/5] 프레임워크 복사 -> ...
[INFO] 변경된 파일: 3개
[3/5] JS 파일 UTF-8 BOM 변환: ...
[INFO] 변환된 파일: 120개
[5/5] zip 압축 -> ...
[INFO] zip 생성 완료: nexacrolib_noMerge_noCompress_noShrink(...).zip
[SUCCESS] 프레임워크 업데이트 완료
```

### DEBUG 모드

INFO 출력에 더해 파일별 상세 처리 내역, 다운로드 진행률 등을 모두 출력합니다.
문제 발생 시 원인 추적에 적합합니다.

```
[2/5] 프레임워크 복사 -> ...
      component 복사 완료
      framework 복사 완료
      nexacrolib.json 복사 완료
[INFO] JSON version -> 24.0.0.1032
      [CHANGED] nexacrolib.json
      [CHANGED] Framework.json
[INFO] 변경된 파일: 3개
[INFO] 다운로드: http://...
     1,024 KB / 20,480 KB  (5%)
     ...
```

### 설정 방법

```ini
# nexacro_config.txt
LOG=INFO    # 간소화 출력 (기본값 — 생략 가능)
LOG=DEBUG   # 상세 출력
```

---

## 여러 환경 config 분리 예시

```
tools/
├── nexacro_config.txt          # 기본 (main 브랜치)
├── nexacro_config_dev.txt      # 개발 환경
└── nexacro_config_release.txt  # 릴리즈 환경
```

```bat
# 개발 환경 빌드
nexacro_pipeline.exe -config nexacro_config_dev.txt

# 릴리즈 빌드
nexacro_pipeline.exe -config nexacro_config_release.txt -version 24.0.0.1031
```

---

## 최소 요구사항

| 항목 | 버전 |
|---|---|
| Python | 3.8 이상 |
| PyInstaller | 5.x 이상 (exe 빌드 시) |
| Git | 설치 및 PATH 등록 필요 |
| Java | `C:\microsoft-jdk-21.0.9-windows-x64\...` 또는 레지스트리/PATH 등록 |
