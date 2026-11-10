// AI가 쓰는 .pair/turn.json 을 읽어서 에디터 줄 위에 페어 턴을 그린다.
// 형식은 skills/pair/SKILL.md 의 "에디터 연동" 참고.
const vscode = require('vscode');

let state = null; // turn.json 내용
let root = null;
const lensChanged = new vscode.EventEmitter();

const turnDeco = vscode.window.createTextEditorDecorationType({
  isWholeLine: true,
  backgroundColor: new vscode.ThemeColor('editor.wordHighlightStrongBackground'),
  after: { margin: '0 0 0 2em', color: new vscode.ThemeColor('editorCodeLens.foreground'), fontWeight: 'bold' },
});
const after = (color, extra) => ({ margin: '0 0 0 2em', color: new vscode.ThemeColor(color), ...extra });
// kind별 모양: ai = AI가 쓴 줄 설명, ok = 맞음, error = 틀린 부분(match)에 물결 밑줄
const noteDecos = {
  ai: vscode.window.createTextEditorDecorationType({ after: after('editorCodeLens.foreground', { fontStyle: 'italic' }) }),
  ok: vscode.window.createTextEditorDecorationType({ after: after('testing.iconPassed') }),
  error: vscode.window.createTextEditorDecorationType({
    textDecoration: 'underline wavy',
    color: new vscode.ThemeColor('errorForeground'),
    backgroundColor: new vscode.ThemeColor('inputValidation.errorBackground'),
    border: '1px solid',
    borderColor: new vscode.ThemeColor('editorError.foreground'),
    overviewRulerColor: new vscode.ThemeColor('editorError.foreground'),
  }), // 라벨을 글자 바로 뒤에 붙이면 줄 중간이 밀려서, error는 툴팁만

};

// 이렇게 넣으면(파일 언어로 하이라이트) + 결과
const tryIt = (x, lang, title = '▶ 이렇게 넣으면') =>
  (x.example ? `\n\n**${title}**\n\`\`\`${lang}\n${x.example}\n\`\`\`` : '') +
  (x.result ? `\n\n**◀ 결과**\n\`\`\`text\n${x.result}\n\`\`\`` : '');

// 기초 개념: 뭐야 → 여기서 어떻게 → 왜 이걸 → 넣어보면 (항상 같은 순서)
const concept = (c, lang) => c ? `\n\n---\n\n### 🧱 기초: ${c.name || ''}` +
  (c.what ? `\n\n**1. 뭐야?**\n\n${c.what}` : '') +
  (c.where ? `\n\n**2. 여기서 어떻게 쓰였어?**\n\n${c.where}` : '') +
  (c.why ? `\n\n**3. 왜 이걸 골랐어?**\n\n${c.why}` : '') +
  tryIt(c, lang, '4. 넣어보면') : '';

// 툴팁: 라벨 + 설명(마크다운) + 기초 개념 + 이렇게 넣으면 + 결과
const tip = (label, detail, n, lang) => new vscode.MarkdownString(
  (label ? `**${label}**\n\n` : '') + (detail || '') + concept(n.concept, lang) + tryIt(n, lang));

// match가 있으면 그 글자 범위만, 없으면 줄 전체. match가 줄에서 사라졌으면(=고쳤으면) null.
function noteRange(doc, n) {
  const line = doc.lineAt(lineOf(doc, n.line));
  if (!n.match) return line.range;
  const i = line.text.indexOf(n.match);
  return i < 0 ? null : new vscode.Range(line.lineNumber, i, line.lineNumber, i + n.match.length);
}

const isTarget = (doc) => state && root && doc.uri.fsPath === vscode.Uri.joinPath(root, state.file).fsPath;
// ponytail: 줄 번호는 AI가 쓴 시점 기준. 사용자가 위쪽에 줄을 추가하면 밀린다 → AI가 매 턴 turn.json을 다시 쓰므로 충분.
const lineOf = (doc, n) => Math.min(Math.max(n - 1, 0), doc.lineCount - 1);

const turnHover = (t, lang) => tip('👉 네 차례',
  `${t.todo}\n\n**정답** (먼저 직접 써보기)\n\`\`\`${lang}\n${t.answer}\n\`\`\`\n\n${t.detail || ''}`, t, lang);

function render() {
  for (const ed of vscode.window.visibleTextEditors) {
    if (!isTarget(ed.document)) {
      ed.setDecorations(turnDeco, []);
      for (const d of Object.values(noteDecos)) ed.setDecorations(d, []);
      continue;
    }
    const doc = ed.document;
    const t = state.turn;
    ed.setDecorations(turnDeco, t ? [{
      range: doc.lineAt(lineOf(doc, t.line)).range,
      hoverMessage: turnHover(t, doc.languageId),
      renderOptions: { after: { contentText: `👉 네 차례: ${t.todo}` } },
    }] : []);
    for (const [kind, deco] of Object.entries(noteDecos)) {
      ed.setDecorations(deco, (state.notes || [])
        .filter((n) => (n.kind || 'ai') === kind)
        .map((n) => ({ n, range: noteRange(doc, n) }))
        .filter((x) => x.range)
        .map(({ n, range }) => ({
          range,
          hoverMessage: tip(n.label, n.detail, n, doc.languageId),
          renderOptions: kind === 'error' ? undefined : { after: { contentText: n.label } },
        })));
    }
  }
}

async function load(uri, reveal) {
  try { state = JSON.parse(Buffer.from(await vscode.workspace.fs.readFile(uri)).toString('utf8')); }
  catch { state = null; }
  render();
  lensChanged.fire();
  if (reveal && state?.turn) {
    const doc = await vscode.workspace.openTextDocument(vscode.Uri.joinPath(root, state.file));
    const ed = await vscode.window.showTextDocument(doc, { preview: false });
    const pos = new vscode.Position(lineOf(doc, state.turn.line), 0);
    ed.selection = new vscode.Selection(pos, pos);
    ed.revealRange(new vscode.Range(pos, pos), vscode.TextEditorRevealType.InCenter);
  }
}

// AI 터미널(claude/codex/gemini…)에 말 전달. 없으면 클립보드에 복사.
async function say(text) {
  const term = vscode.window.terminals.find((t) => /claude|codex|gemini|aider|cursor/i.test(t.name)) || vscode.window.activeTerminal;
  if (term) { term.show(); term.sendText(text); return; }
  await vscode.env.clipboard.writeText(text);
  vscode.window.showInformationMessage(`AI 채팅창에 "${text}" 붙여넣기 (클립보드에 복사됨)`);
}

function activate(ctx) {
  root = vscode.workspace.workspaceFolders?.[0]?.uri;
  if (!root) return;
  const uri = vscode.Uri.joinPath(root, '.pair/turn.json');
  const watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(root, '.pair/turn.json'));

  ctx.subscriptions.push(
    watcher,
    watcher.onDidCreate(() => load(uri, true)),
    watcher.onDidChange(() => load(uri, true)),
    watcher.onDidDelete(() => load(uri, false)),
    vscode.window.onDidChangeVisibleTextEditors(render),
    vscode.workspace.onDidChangeTextDocument((e) => isTarget(e.document) && render()),
    vscode.commands.registerCommand('pair.say', async (text) => {
      text ??= await vscode.window.showInputBox({ prompt: 'AI에게 보낼 말' });
      if (text) say(text);
    }),
    vscode.commands.registerCommand('pair.peek', async () => {
      if (!state?.turn) return;
      await load(uri, true);
      vscode.commands.executeCommand('editor.action.showHover');
    }),
    vscode.languages.registerCodeLensProvider({ scheme: 'file' }, {
      onDidChangeCodeLenses: lensChanged.event,
      provideCodeLenses(doc) {
        if (!isTarget(doc) || !state.turn) return [];
        const r = new vscode.Range(lineOf(doc, state.turn.line), 0, lineOf(doc, state.turn.line), 0);
        const btn = (title, command, args) => new vscode.CodeLens(r, { title, command, arguments: args });
        return [
          btn('💡 정답 보기', 'pair.peek'),
          btn('✅ 했어', 'pair.say', ['했어']),
          btn('❓ 모르겠어', 'pair.say', ['모르겠어']),
          btn('⏭ 패스', 'pair.say', ['패스']),
          btn('⚡ 빨리', 'pair.say', ['빨리']),
          btn('💬 말하기', 'pair.say'),
        ];
      },
    }),
  );
  load(uri, false);
}

module.exports = { activate, deactivate() {} };
