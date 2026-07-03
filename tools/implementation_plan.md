# 3rabbitz 문서 사이트 마크다운 수집기 (Python GUI + EXE)

## 배경

대상 사이트는 `https://docs.tobesoft.com/nexacro_n_v24_ko` 등 3rabbitz 기반 문서 플랫폼입니다.
사이트 구조를 분석한 결과:

- 왼쪽 사이드바에 트리 메뉴 (문서 목록 / 챕터 구조)가 있습니다.
- 각 챕터 페이지의 콘텐츠 영역 우측 상단에 "마크다운" 버튼이 있습니다.
- 버튼 클릭 시 팝업이 표시되며, "마크다운으로 복사" 버튼을 누르면 클립보드로 마크다운이 복사됩니다.
- 사이트는 JavaScript SPA 구조이므로 Selenium을 통한 브라우저 자동화가 필요합니다.

## 사용자 확인 필요 사항

> [!IMPORTANT]
> 이 프로그램은 Selenium + Chrome WebDriver를 사용하여 실제 브라우저를 제어합니다. 실행 시 Chrome 브라우저가 자동으로 열리며, 작업이 완료되면 자동 종료됩니다.

> [!WARNING]
> EXE 빌드를 위해 `pyinstaller` 패키지가 필요합니다. 설치 후 진행합니다.

## 오픈 질문

- 특정 문서(레퍼런스 가이드 등) 하나만 수집하는 것인지, 아니면 URL에 따라 여러 문서를 수집할 수 있게 하는 것인지? → **URL 입력을 받으므로 범용적으로 구현합니다.**

## 제안하는 변경 사항

### Python 프로그램 (`scripts/md_collector.py`)

#### [NEW] [md_collector.py](file:///d:/git_prj/REQM/scripts/md_collector.py)

**기능:**
1. **URL 입력**: tkinter GUI 창에서 대상 문서 사이트 URL을 입력 받음
2. **메뉴 탐색**: Selenium을 사용해 왼쪽 사이드바의 트리 메뉴를 순차적으로 클릭
3. **마크다운 복사**: 각 페이지에서 마크다운 버튼 클릭 → 팝업에서 "마크다운으로 복사" 클릭
4. **파일 저장**: 클립보드의 마크다운 내용을 `D:\git_prj\REQM\레퍼런스가이드\{메뉴명}.md`로 저장
5. **진행 상황 표시**: tkinter 프로그레스 바 + 로그 텍스트 영역으로 실시간 진행률 표시

**기술 스택:**
- `selenium` + `webdriver-manager`: 브라우저 자동화 및 ChromeDriver 자동 관리
- `tkinter`: GUI (URL 입력, 진행 상황 표시, 시작/중지 버튼)
- `pyperclip`: 클립보드 접근

**GUI 구성:**
- URL 입력 필드 (기본값: `https://docs.tobesoft.com/nexacro_n_v24_ko`)
- 저장 경로 표시/변경 필드
- [시작] 버튼, [중지] 버튼
- 프로그레스 바 (전체 진행률)
- 로그 출력 영역 (스크롤 가능)

### EXE 빌드

#### PyInstaller를 사용한 빌드
```
pyinstaller --onefile --windowed --name "MD_Collector" scripts/md_collector.py
```

## 검증 계획

### 자동 테스트 및 검증
1. Python 스크립트를 직접 실행하여 기본 URL로 2~3개 메뉴 항목의 마크다운 수집이 정상 동작하는지 확인
2. `D:\git_prj\REQM\레퍼런스가이드` 폴더에 `.md` 파일이 정상 생성되는지 확인
3. EXE 빌드 후 실행 가능 여부 확인

### 수동 확인
- 생성된 `.md` 파일의 내용이 올바른 마크다운 형식인지 사용자 직접 확인
