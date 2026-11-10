# pair-coding

사수와 한 줄씩 번갈아 짜듯, AI와 턴을 주고받으며 코드를 짜는 페어 코딩 모드.
AI가 한 줄 쓰면 내가 한 줄 쓰고, 줄마다 **무엇 / 기초 / 응용 / 흐름**을 같이 배운다.
결과물만 받는 게 아니라, **내가 설명할 수 있는 결과물**을 만드는 게 목표.

- 피그마 링크(MCP), 스크린샷, 텍스트 요구사항으로 시작
- 회사 코드베이스의 기존 규칙·컴포넌트를 먼저 읽고 재사용
- 설명은 터미널이 아니라 **에디터 코드 줄 위에** 툴팁으로 (VS Code 확장)
- Claude Code, Codex, Cursor, Copilot, Gemini CLI, 웹 채팅 어디서든 사용

```
3   Name NVARCHAR(100) NOT NULL,             🤖 상품명 컬럼      ← 마우스 올리면 무엇/기초/응용/팁 + 예시 코드
4   Stock INT NOT NULL CHECK (Stock >= 0),                      ← 틀린 부분은 빨간 물결 + 툴팁 설명
                                     ~~~
    💡 정답 보기 | ✅ 했어 | ❓ 모르겠어 | ⏭ 패스 | ⚡ 빨리 | 💬 말하기
5   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓      👉 네 차례: 가격 컬럼 추가
```

---

## 처음 시작하기 (Claude Code + VS Code, 5분)

### 준비물
- [VS Code](https://code.visualstudio.com/)
- [Claude Code](https://claude.com/claude-code) (터미널에서 `claude` 실행되면 OK)

### 1단계. VS Code 확장 설치 (처음 한 번)
1. [Releases](https://github.com/lhjwork/pair-coding/releases/latest)에서 `pair-coding.vsix` 다운로드
2. 터미널에서:
   ```sh
   code --install-extension ~/Downloads/pair-coding.vsix
   ```
3. **VS Code를 `⌘Q`로 완전히 종료했다가 다시 열기** (창만 닫으면 새 버전이 안 잡힘)

### 2단계. Claude Code 플러그인 설치 (처음 한 번)
아무 터미널에서 `claude` 실행 후:
```
/plugin marketplace add lhjwork/pair-coding
/plugin install pair-coding@pair-coding
```
→ "Install for you (user scope)" 선택 → `/reload-plugins`

### 3단계. 연습할 폴더 열기
```sh
mkdir -p ~/Desktop/pair-practice && code ~/Desktop/pair-practice
```
VS Code 아래 터미널(`` ⌃` ``)을 열고 `claude` 실행.
(꼭 **VS Code 안의 터미널**에서 실행해야 에디터 버튼이 AI에게 전달된다)

### 4단계. 시작
```
/pair-coding:pair 파이썬으로 할일 목록 CLI 만들기 초보
```

### 5단계. 한 턴 진행해보기
1. AI가 `이해한 것`과 3~5단계 계획을 보여준다 → 괜찮으면 `좋아`
2. AI가 첫 줄을 쓰면 파일이 에디터에 자동으로 열린다
   - AI가 쓴 줄 끝 `🤖 ...` 에 **마우스를 올리면** 무엇 / 팁 + 🧱 기초 4칸 (1. 뭐야? → 2. 여기서 어떻게 쓰였어? → 3. 왜 이걸 골랐어? → 4. 넣어보면 → 결과)
3. 하이라이트된 줄 = **내 차례**
   - `👉 네 차례: ...` 를 보고 먼저 혼자 써본다
   - 막히면 위의 `💡 정답 보기` (정답 + 흐름 + 기초→응용)
   - 정답은 **복사하지 말고 직접 타이핑** → `⌘S` 저장
4. `✅ 했어` 버튼 클릭 (또는 터미널에 `했어`)
   - 맞으면 줄 끝에 초록 `✅`
   - 틀리면 틀린 글자에 **빨간 물결** → 마우스 올리면 `헷갈린 것 / 차이 / 여기선`
   - 고치면 빨간 표시가 저절로 사라진다 → 다시 `✅ 했어`
5. 반복. 단계가 끝나면 AI가 알려주는 실행 명령을 직접 입력 (`! python todo.py` 처럼 `!` 붙이면 Claude Code 안에서 실행)
6. 그만할 때 `끝` → 오늘 배운 기초→응용 정리 + 다음 연습 과제

### 쓸 수 있는 말 (버튼 또는 터미널 입력)

| 입력 | 동작 |
|---|---|
| `했어` | 내가 쓴 줄 리뷰 |
| `모르겠어` | 정답 줄을 조각내서 설명 |
| `패스` | AI가 대신 씀, 대신 내 말로 설명해야 넘어감 |
| `빨리` | 이번 단계만 AI가 몰아서 작성 (마감 급할 때) |
| `끝` | 배운 기초→응용 정리 + 연습 과제 |

### 시작하는 다른 방법

```
/pair-coding:pair https://figma.com/design/... 이 화면 만들기 중급   ← 피그마 MCP 연결 시
/pair-coding:pair (캡처 이미지 붙여넣고) 이 화면 만들기
/pair-coding:pair 로그인 실패하면 에러 문구 띄우기
```
레벨: `초보`(문법·개념 위주) / `중급`(설계 이유·대안 비교 위주). 생략하면 초보.

---

## 문제 해결

| 증상 | 해결 |
|---|---|
| 에디터에 아무 표시가 없다 | 프로젝트에 `.pair/turn.json`이 생겼는지 확인. 없으면 AI에게 "에디터 연동으로 해줘 (.pair/turn.json)" |
| 툴팁에 예시 코드가 안 나온다 / 예전 모양이다 | VS Code를 `⌘Q`로 **완전히** 종료 후 다시 열기. `⌘⇧P` → `Developer: Show Running Extensions`에서 버전 확인 |
| AI가 코드에 `-- 👉` 주석을 넣거나 `PAIR.md`를 만든다 | 플러그인이 옛 버전. `/plugin` → pair-coding 업데이트 → `/reload-plugins`. 프로젝트 `CLAUDE.md`에 예전 규칙이 있으면 지우기 |
| `✅ 했어` 버튼을 눌러도 AI가 반응 없다 | `claude`를 VS Code **안의 터미널**에서 실행했는지 확인. 터미널이 없으면 클립보드에 복사되니 채팅창에 붙여넣기 |
| 표시 위치가 한두 줄 밀린다 | 위쪽에 줄을 추가해서 그렇다. 다음 턴에 AI가 다시 맞춘다 |

---

## 다른 AI 도구에서 쓰기

프롬프트 원본은 [`skills/pair/SKILL.md`](skills/pair/SKILL.md) 한 파일이다. VS Code 확장은 어떤 AI든 `.pair/turn.json`만 쓰면 동작한다.

```sh
URL=https://raw.githubusercontent.com/lhjwork/pair-coding/main/skills/pair/SKILL.md
```

| 도구 | 설치 | 실행 |
|---|---|---|
| Codex CLI | `mkdir -p ~/.codex/prompts && curl -fsSL $URL -o ~/.codex/prompts/pair.md` | `/prompts:pair <목표>` |
| Cursor | 프로젝트에서 `mkdir -p .cursor/commands && curl -fsSL $URL -o .cursor/commands/pair.md` | `/pair <목표>` |
| GitHub Copilot (VS Code) | 프로젝트에서 `mkdir -p .github/prompts && curl -fsSL $URL -o .github/prompts/pair.prompt.md` | `/pair <목표>` |
| Gemini CLI | 아래 명령 | `/pair <목표>` |
| 웹 채팅 (claude.ai, ChatGPT 등) | 파일 내용을 첫 메시지로 붙여넣기 (또는 프로젝트 지침에 넣기) | 이어서 목표·캡처 전달 (에디터 연동 없음) |

Gemini CLI (TOML 형식이라 감싸서 저장):
```sh
mkdir -p ~/.gemini/commands && { echo 'description = "페어 코딩"'; echo "prompt = '''"; curl -fsSL $URL | sed 's/\$ARGUMENTS/{{args}}/'; echo "'''"; } > ~/.gemini/commands/pair.toml
```

## 회사 저장소에서 쓸 때

페어 코딩 파일이 커밋되지 않게:
```sh
printf '.pair/\nLEARNED.md\n.cursor/commands/pair.md\n.github/prompts/pair.prompt.md\n' >> .git/info/exclude
```

## 라이선스

MIT
