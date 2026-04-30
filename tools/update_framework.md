# update_framework.bat

소스 저장소에서 Nexacro 프레임워크 파일을 가져와 로컬 nexacrolib 폴더에 복사하고, 선택적으로 버전 변경 및 zip 압축까지 수행하는 배포 준비 스크립트.

---

## 사용법

```bat
update_framework.bat <branch명> [옵션...]
```

### 옵션

| 옵션 | 설명 |
|---|---|
| `<branch명>` | 소스 저장소에서 checkout할 브랜치 이름. 생략 시 실행 중 입력 요청 |
| `-version <값>` | nexacrolib 하위 모든 JSON 파일의 `"version"` 값을 지정한 값으로 변경 |
| `-ignore` | [5/5] zip 압축 단계를 건너뜀 |
| `-help` | 도움말 출력. 다른 옵션과 함께 사용해도 도움말만 출력되고 종료 |

### 예시

```bat
rem 기본 실행
update_framework.bat main

rem 버전 변경 포함
update_framework.bat main -version "24.0.0.1031"

rem zip 생성 생략
update_framework.bat main -ignore

rem 버전 변경 + zip 생략
update_framework.bat main -version "24.0.0.1031" -ignore

rem 도움말 출력 (다른 옵션 무시)
update_framework.bat -help
update_framework.bat main -version "24.0.0.1031" -help
```

---

## 경로 설정

| 변수 | 값 | 설명 |
|---|---|---|
| `SOURCE_DIR` | `E:\git\Antigravity_WORK800\WORK800` | 소스 저장소 루트 |
| `FRAMEWORK_SRC` | `SOURCE_DIR\Lib\FrameworkJS` | 프레임워크 소스 경로 |
| `PROJECT_ROOT` | 스크립트 위치 기준 상위 폴더 | 프로젝트 루트 |
| `DEST_DIR` | `PROJECT_ROOT\nexacrolib\nexacrolib` | 프레임워크 복사 대상 경로 |
| `GENERATERULE_DEST` | `PROJECT_ROOT\nexacrolib\generate` | Generate Rule 복사 대상 경로 |

---

## 실행 단계

### [1/5] 소스 저장소 업데이트

```
SOURCE_DIR 으로 이동
git checkout <branch>
git pull origin <branch>
```

- 지정한 브랜치로 checkout 후 최신 커밋을 pull
- 실패 시 즉시 중단 (errorlevel 체크)
- 완료 후 현재 커밋 해시(`COMMIT_HASH`)와 커밋 메시지(`COMMIT_MSG`)를 기록

### [2/5] 프레임워크 파일 복사

```
FRAMEWORK_SRC\component  →  DEST_DIR\component
FRAMEWORK_SRC\framework  →  DEST_DIR\framework
FRAMEWORK_SRC\resources  →  DEST_DIR\resources
FRAMEWORK_SRC\nexacrolib.json  →  DEST_DIR\nexacrolib.json
```

- 기존 폴더가 있으면 삭제 후 새로 복사 (`xcopy /E /I /Y`)
- `nexacrolib.json`은 단독으로 복사

### [버전 변경] JSON version 값 일괄 수정 *(옵션)*

`-version` 옵션이 지정된 경우에만 실행.

- `update_version.ps1`을 호출해 `DEST_DIR` 하위의 **모든 `.json` 파일**을 재귀 탐색
- `"version":"기존값"` 패턴을 `-version`으로 지정한 값으로 치환
- 변경된 파일명은 `[CHANGED] 파일명` 형태로 출력

### [3/5] JS 파일 UTF-8 BOM 변환

```
convert_utf8bom.ps1 실행 → DEST_DIR 내 모든 JS 파일 인코딩 변환
```

- `convert_utf8bom.ps1`을 통해 Nexacro 런타임이 요구하는 UTF-8 BOM 형식으로 변환

### [4/5] Generate Rule 복사

```
TiMetainfoLib\res\*       →  nexacrolib\generate\
TiGenerateLib\Template\24\*  →  nexacrolib\generate\
```

- 기존 `generate` 폴더를 삭제 후 재생성
- 두 소스 경로의 파일을 동일 대상 폴더에 병합 복사

### [5/5] zip 압축 *(옵션)*

`-ignore` 옵션이 없을 때 실행.

```
nexacrolib\nexacrolib  +  nexacrolib\generate
→  nexacrolib\nexacrolib_noMerge_noCompress_noShrink(버전).zip
```

- 압축 전 `get_version.ps1`으로 `nexacrolib.json`의 version 값을 읽어 파일명에 포함
- `Compress-Archive`(PowerShell)로 압축
- 기존 zip 파일이 있으면 먼저 삭제 후 재생성

| 상황 | 생성 파일명 |
|---|---|
| version 정상 읽힘 | `nexacrolib_noMerge_noCompress_noShrink(24.0.0.1031).zip` |
| version 읽기 실패 | `nexacrolib_noMerge_noCompress_noShrink.zip` |

---

## 완료 메시지

모든 단계가 성공하면 아래 정보를 출력:

```
[SUCCESS] All steps completed successfully.
         Branch  : main
         Hash    : abc1234...
         Message : 커밋 메시지
         Version : 24.0.0.1031   ← -version 옵션 사용 시만 출력
```

---

## 관련 파일

| 파일 | 역할 |
|---|---|
| `update_version.ps1` | JSON 파일 내 version 값 치환 |
| `convert_utf8bom.ps1` | JS 파일 UTF-8 BOM 인코딩 변환 |
| `get_version.ps1` | JSON 파일에서 version 값 추출 (zip 파일명 생성에 사용) |
