# run_Deploy.bat

`deploy_config.txt` 설정을 읽어 Nexacro 프로젝트를 빌드/배포하고, 배포 결과물을 `deploy_engine` 폴더로 정리한 뒤 zip으로 압축하는 전체 배포 파이프라인 스크립트.

---

## 사용법

```bat
run_Deploy.bat [옵션...]
```

### 옵션

| 옵션 | 설명 |
|---|---|
| `-config <파일명 또는 경로>` | 사용할 config 파일 지정. 생략 시 `deploy_config.txt` 사용 |
| `-ignore` | zip 압축 단계([13]) 건너뜀 |

### 예시

```bat
rem 기본 실행 (deploy_config.txt 사용)
run_Deploy.bat

rem 파일명만 지정 (tools 폴더 기준 탐색)
run_Deploy.bat -config deploy_config_dev.txt

rem 전체 경로 지정
run_Deploy.bat -config "D:\configs\my_config.txt"

rem config 지정 + zip 생략
run_Deploy.bat -config deploy_config_dev.txt -ignore
```

### config 파일 탐색 규칙

1. `-config`에 지정한 경로가 그대로 존재하면 → 해당 경로 사용
2. 존재하지 않으면 → `tools` 폴더 기준 상대 경로로 탐색
3. `-config` 생략 시 → `tools\deploy_config.txt` 사용

---

## 설정 파일: `deploy_config.txt`

`=` 구분자로 키-값을 정의한다.

```ini
ProjectPath=D:\git_prj\nexacroN\UI_source\nexa24_deploy_sample_prj\nexa24_deploy_sample_prj.xprj
OutputPath=D:\git_prj\nexacroN\output\nexa24_deploy_sample_prj
DeployPath=D:\git_prj\nexacroN\deploy\nexa24_deploy_sample_prj
NexacroLibPath=D:\git_prj\nexacroN\nexacrolib\nexacrolib
GenerateRule=D:\git_prj\nexacroN\nexacrolib\generate
-MERGE
-COMPRESS
-SHRINK
```

### 설정 항목

| 키 | 필수 | 설명 |
|---|---|---|
| `ProjectPath` | ✅ | 배포할 Nexacro 프로젝트 파일 (`.xprj`) 경로 |
| `OutputPath` | ✅ | 빌드 중간 출력 폴더 경로 |
| `DeployPath` | ✅ | 배포 결과물 폴더 경로 |
| `NexacroLibPath` | ✅ | nexacrolib 라이브러리 폴더 경로 |
| `GenerateRule` | ✅ | Generate Rule 폴더 경로 |
| `-MERGE` | ➖ | 파일 머지 옵션 (키만 있으면 활성화) |
| `-COMPRESS` | ➖ | 압축 옵션 (키만 있으면 활성화) |
| `-SHRINK` | ➖ | Shrink 옵션 (키만 있으면 활성화) |

---

## 실행 단계

### [1] config 파일 파싱

- `-config` 옵션으로 파일을 지정하지 않으면 `tools\deploy_config.txt` 사용
- 지정한 파일이 존재하지 않으면 `tools` 폴더 기준 상대 경로로 재탐색
- 파일이 없으면 즉시 오류 종료
- `=` 기준으로 키-값 분리하여 환경 변수로 설정
- 필수 항목이 하나라도 누락되면 오류 종료

### [2] OutputPath / DeployPath 초기화

- 기존 폴더가 있으면 삭제 후 재생성
- 매 실행마다 클린 상태에서 빌드

### [3] JAVA_HOME 탐색

환경 변수 `JAVA_HOME`이 설정되지 않은 경우 아래 순서로 자동 탐색:

| 우선순위 | 방법 |
|---|---|
| 1 | 고정 경로 (`C:\microsoft-jdk-21.0.9-windows-x64\...`) 존재 확인 |
| 2 | 레지스트리 JDK 항목 (`HKLM\SOFTWARE\JavaSoft\JDK`) |
| 3 | 레지스트리 JRE 항목 (`HKLM\SOFTWARE\JavaSoft\Java Runtime Environment`) |
| 4 | `PATH`의 `java.exe` 위치에서 역산 |

모두 실패 시 오류 종료.

### [4] start.bat 존재 확인

- `D:\git_prj\nexacroN\Jar\bin\start.bat` 파일 존재 여부 확인
- 없으면 오류 종료

### [5] 배포 명령 실행

아래 형태로 `start.bat`을 호출:

```bat
start.bat -P <ProjectPath> -B <NexacroLibPath> -O <OutputPath>
          -GENERATERULE <GenerateRule> -D <DeployPath>
          [-MERGE] [-COMPRESS] [-SHRINK]
```

- `Jar\bin` 폴더로 이동 후 실행 (상대 경로 해석을 위해)

### [6] deploy_engine 폴더 생성 및 파일 복사

배포 완료 후 `deploy_engine` 폴더에 배포 엔진용 파일 구성:

```
deploy_engine\
├── nexacrolib\              ← DeployPath\nexacrolib 복사
└── <GenerateRule 폴더명>\   ← GenerateRule 폴더 복사
```

### [7] component 파일 정리 (10번 단계)

`nexacrolib\nexacrolib\component` → `deploy_engine\nexacrolib\component` 복사:

- 루트의 `*.json` 파일 복사
- 아래 하위 폴더들의 서브폴더를 재귀 복사:
  `ComComp`, `CompBase`, `CompBaseEx`, `DesignComp`, `DeviceAPI`,
  `Graphics`, `Grid`, `ListView`, `MobileComp`, `Push`, `XAgent`

### [8] *.min.json → *.json 교체 (10-1번 단계)

`deploy_engine\nexacrolib\component` 내에서:

- `파일명.min.json`이 존재하면 대응하는 `파일명.json`을 삭제
- `파일명.min.json`을 `파일명.json`으로 이름 변경
- 교체된 파일 수 출력

### [9] 단일 JSON 파일 복사 (10-2 ~ 10-4 단계)

| 소스 | 대상 | 설명 |
|---|---|---|
| `nexacrolib\nexacrolib\nexacrolib.json` | `deploy_engine\nexacrolib\nexacrolib.json` | 라이브러리 메타 정보 |
| `nexacrolib\nexacrolib\component\DesignComp` | `deploy_engine\nexacrolib\component\DesignComp` | 디자인 컴포넌트 폴더 |
| `nexacrolib\nexacrolib\resources\Resource.json` | `deploy_engine\nexacrolib\resources\Resource.json` | 리소스 정보 |

### [10] Framework 파일 복사 (11번 단계)

```
nexacrolib\nexacrolib\framework\Framework.min.json
→ deploy_engine\nexacrolib\framework\Framework.json  (이름 변경하여 복사)

nexacrolib\nexacrolib\framework\metainfo\
→ deploy_engine\nexacrolib\framework\metainfo\
```

### [11] 버전 문자열 교체 (12번 단계)

`deploy_engine\nexacrolib` 하위의 모든 `.json` 파일에서:

```
"version": "21.0.0.9999"  →  "version": "24.0.0.9999"
```

처리된 파일 수를 출력.

### [12] zip 압축 (13번 단계)

`-ignore` 옵션이 없을 때만 실행.

```
deploy_engine\*
→ deploy_engine\nexacrolib_Merge_Compress_Shrink.zip
```

- `Compress-Archive`(PowerShell)로 `deploy_engine` 전체를 압축
- 기존 zip이 있으면 먼저 삭제 후 재생성
- `-ignore` 지정 시 이 단계를 건너뜀

---

## 전체 파이프라인 요약

```
config 파일 결정 (-config 지정 or 기본 deploy_config.txt)
    ↓
config 파일 파싱
    ↓
OutputPath / DeployPath 초기화
    ↓
JAVA_HOME 탐색
    ↓
start.bat으로 Nexacro 빌드/배포
    ↓
deploy_engine 폴더 생성
    ↓
nexacrolib + GenerateRule 복사
    ↓
component 파일 정리 + min.json 교체
    ↓
nexacrolib.json / DesignComp / Resource.json 복사
    ↓
Framework.min.json → Framework.json 복사 + metainfo 복사
    ↓
JSON version 문자열 교체
    ↓
deploy_engine → nexacrolib_Merge_Compress_Shrink.zip 압축  ← -ignore 시 생략
```

---

## 관련 파일

| 파일 | 역할 |
|---|---|
| `deploy_config.txt` | 배포 경로 및 옵션 설정 |
| `Jar\bin\start.bat` | Nexacro 빌드/배포 실행 엔진 |
