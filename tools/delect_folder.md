# delect_folder.bat

프로젝트 루트의 빌드/배포 산출물 폴더를 일괄 삭제하는 정리 스크립트.

---

## 사용법

```bat
delect_folder.bat
```

인자 없음. 실행하면 즉시 대상 폴더를 삭제한다.

> **주의**: 삭제 전 확인 없이 바로 실행되므로 필요한 파일이 없는지 확인 후 실행.

---

## 삭제 대상

스크립트 위치 기준 상위 폴더(`PROJECT_ROOT`) 아래의 다음 폴더를 삭제한다.

| 폴더 | 설명 |
|---|---|
| `deploy` | 배포 빌드 산출물 |
| `deploy_engine` | run_Deploy.bat이 생성하는 배포 엔진 패키지 |
| `output` | 빌드 중간 출력물 |
| `nexacrolib` | 프레임워크 라이브러리 파일 |

---

## 실행 로직

```
PROJECT_ROOT = 스크립트 위치의 상위 폴더

for each 폴더 in (deploy, deploy_engine, output, nexacrolib):
    폴더 존재 시 → rd /s /q 로 삭제
    폴더 없음 시 → [SKIP] 메시지 출력
```

- 폴더가 존재하지 않으면 건너뜀 (`[SKIP]` 출력)
- 삭제 실패 시 `[WARN]` 경고 출력 후 나머지 폴더 계속 처리
- 모든 처리 완료 후 `[DONE] Cleanup complete.` 출력

---

## 사용 시나리오

- `update_framework.bat` 재실행 전 기존 nexacrolib 초기화
- `run_Deploy.bat` 재실행 전 deploy / output / deploy_engine 초기화
- 전체 클린 빌드가 필요할 때 모든 산출물 일괄 제거
