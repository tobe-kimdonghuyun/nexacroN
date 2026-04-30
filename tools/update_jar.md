# update_jar.bat

사내 파일 서버에서 최신 Nexacro Deploy JAVA(JAR) 패키지를 자동으로 다운로드하여 로컬 `Jar` 폴더에 설치하는 스크립트.

---

## 사용법

```bat
update_jar.bat
```

인자 없음. 실행하면 자동으로 서버에서 최신 파일을 탐색하여 설치한다.

---

## 경로 설정

| 항목 | 값 |
|---|---|
| 다운로드 서버 URL | `http://59.10.169.82:9900/NexacroN/serverN/Deploy_JAVA/분리_Jar/` |
| 설치 대상 폴더 | `D:\git_prj\nexacroN\Jar` |

---

## 실행 단계 (`update_jar.ps1`)

`update_jar.bat`은 `update_jar.ps1`을 호출하는 래퍼 스크립트이며, 실제 로직은 PS1에 있다.

### [0] 대상 폴더 초기화

- `Jar` 폴더가 존재하면 내부 파일을 전부 삭제
- 폴더가 없으면 새로 생성

### [1] 최신 연도 폴더 탐색

- 서버 목록 페이지에서 `YYYY` 형식의 폴더 링크를 수집
- 가장 최신 연도 폴더를 선택

### [2] 최신 파일 탐색

- 선택된 연도 폴더 내에서 `.zip` 또는 `.jar` 파일 목록을 수집
- 이름 내림차순으로 정렬 후 첫 번째 파일(최신)을 선택

### [3] 파일 다운로드

- 선택된 파일을 `Jar\download.zip`으로 다운로드

### [4] 1차 압축 해제

- `download.zip`을 `Jar\level1` 임시 폴더에 압축 해제

### [5] 2차 압축 해제 (이중 압축 처리)

- `level1` 폴더 내에 중첩된 `.zip` 파일이 있으면 `Jar` 폴더에 직접 압축 해제
- 중첩 zip 외의 파일(`.json` 등)도 `Jar` 폴더로 이동
- 중첩 zip이 없으면 `level1` 내용을 그대로 `Jar` 폴더로 이동

### [6] 임시 폴더 정리

- `level1` 임시 폴더 삭제

### [7] 단일 서브폴더 구조 처리

- `Jar` 폴더 내에 `NexacroN_Deploy_JAVA_`로 시작하는 단일 폴더만 있는 경우
- 해당 폴더의 내용을 `Jar` 루트로 끌어올리고 빈 폴더 삭제

---

## 완료 메시지

```
[Done] All tasks completed successfully.
```

실패 시:

```
[Error] Task failed.
```

---

## 관련 파일

| 파일 | 역할 |
|---|---|
| `update_jar.ps1` | 실제 다운로드 및 설치 로직 |
