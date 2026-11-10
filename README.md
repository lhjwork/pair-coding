# pair-coding

사수와 한 줄씩 번갈아 짜듯, AI와 턴을 주고받으며 코드를 짜는 페어 코딩 모드.
AI가 한 줄 쓰면 내가 한 줄 쓰고, 줄마다 **무엇 / 기초 / 응용 / 흐름**을 같이 배운다.
결과물만 받는 게 아니라, 내가 설명할 수 있는 결과물을 만드는 게 목표.

- 피그마 링크(MCP), 스크린샷, 텍스트 요구사항으로 시작
- 회사 코드베이스의 기존 규칙·컴포넌트를 먼저 읽고 재사용
- Claude Code, Codex, Cursor, Copilot, Gemini CLI, 웹 채팅 어디서든 사용

## 설치

프롬프트 원본은 [`skills/pair/SKILL.md`](skills/pair/SKILL.md) 한 파일이다.

```sh
URL=https://raw.githubusercontent.com/lhjwork/pair-coding/main/skills/pair/SKILL.md
```

| 도구 | 설치 | 실행 |
|---|---|---|
| Claude Code | `/plugin marketplace add lhjwork/pair-coding` → `/plugin install pair-coding@pair-coding` | `/pair-coding:pair <목표>` |
| Codex CLI | `mkdir -p ~/.codex/prompts && curl -fsSL $URL -o ~/.codex/prompts/pair.md` | `/prompts:pair <목표>` |
| Cursor | 프로젝트에서 `mkdir -p .cursor/commands && curl -fsSL $URL -o .cursor/commands/pair.md` | `/pair <목표>` |
| GitHub Copilot (VS Code) | 프로젝트에서 `mkdir -p .github/prompts && curl -fsSL $URL -o .github/prompts/pair.prompt.md` | `/pair <목표>` |
| Gemini CLI | 아래 명령 | `/pair <목표>` |
| 웹 채팅 (claude.ai, ChatGPT 등) | 파일 내용을 첫 메시지로 붙여넣기 (또는 프로젝트 지침에 넣기) | 이어서 목표·캡처 전달 |

Gemini CLI (TOML 형식이라 감싸서 저장):
```sh
mkdir -p ~/.gemini/commands && { echo 'description = "페어 코딩"'; echo "prompt = '''"; curl -fsSL $URL | sed 's/\$ARGUMENTS/{{args}}/'; echo "'''"; } > ~/.gemini/commands/pair.toml
```

## VS Code 확장 (에디터에서 턴 보기)

AI가 매 턴 `.pair/turn.json`을 쓰면, 에디터의 해당 줄에 바로 표시된다. 어떤 AI(Claude, Codex, Gemini…)를 써도 동작.

- 사용자 줄: 하이라이트 + `👉 네 차례: ...` + 버튼 `💡 정답 보기 | ✅ 했어 | ❓ 모르겠어 | ⏭ 패스 | ⚡ 빨리 | 💬 말하기`
- AI가 쓴 줄: 줄 끝 메모, 마우스 올리면 무엇 / 기초 / 응용 / 팁
- 버튼은 이름에 claude·codex·gemini가 들어간 터미널(없으면 열린 터미널)로 보낸다. 터미널이 없으면 클립보드에 복사.

설치: [Releases](https://github.com/lhjwork/pair-coding/releases)에서 `pair-coding.vsix` 받아서
```sh
code --install-extension pair-coding.vsix
```

## 사용법

```
/pair-coding:pair 할일 목록 CLI 만들기 초보
/pair-coding:pair https://figma.com/design/... 이 화면 만들기 중급
/pair-coding:pair (캡처 붙여넣고) 이 화면 만들기
```

1. AI가 `이해한 것`과 3~5단계 계획을 보여준다.
2. AI가 한 줄 쓰고 `무엇 / 기초 / 응용 / 팁`을 설명한다.
3. `👉 네 차례` + 정답 + `흐름`이 나온다 → 에디터에서 **직접 타이핑**.
4. `했어` → 리뷰. 틀리면 `헷갈린 것 / 차이 / 여기선`으로 알려준다.

| 입력 | 동작 |
|---|---|
| `했어` | 내가 쓴 줄 리뷰 |
| `모르겠어` | 정답 줄을 조각내서 설명 |
| `패스` | AI가 대신 씀, 대신 내 말로 설명해야 넘어감 |
| `빨리` | 이번 단계만 AI가 몰아서 작성 |
| `끝` | 배운 기초→응용 정리 + 연습 과제 |

## 회사 저장소에서 쓸 때

프로젝트 폴더에 복사하는 방식(Cursor/Copilot)은 커밋되지 않게:
```sh
printf '.cursor/commands/pair.md\n.github/prompts/pair.prompt.md\nLEARNED.md\n' >> .git/info/exclude
```

## 라이선스

MIT
