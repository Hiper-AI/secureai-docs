#!/usr/bin/env node
// Calcula el próximo tag de versión (CalVer) para .github/workflows/release-tag.yml.
// Copia de Hiper-AI/secureai scripts/release/nextTag.mjs (con su test): si cambia la regla, cambiala allá y copiala.
//
//   main   v26.10.20  (la fecha del push a main; si ese día ya hubo uno: v26.10.20.1, v26.10.20.2, ...)
//
// release/beta no se versiona: lo que hay en beta es la punta de la rama. Los tags viejos (v1.1.24, ...) no matchean
// TAG_RE y se ignoran; los v26.10.14-beta.N de cuando beta sí se taggeaba matchean pero no cuentan como estables.
// Uso: node scripts/release/nextTag.mjs [--today yy.mm.dd]
// Imprime un JSON { tag, skip, reason, notesStartTag }. Sólo lee git; no crea nada.
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const TZ = 'America/Argentina/Buenos_Aires';
const TAG_RE = /^v(\d{2})\.(\d{2})\.(\d{2})(?:\.(\d+))?(?:-beta\.(\d+))?$/;

export function parseTag(tag) {
  const m = TAG_RE.exec(tag);
  if (!m || (m[4] && m[5])) return null;
  return {
    tag,
    base: `${m[1]}.${m[2]}.${m[3]}`,
    hotfix: m[4] ? Number(m[4]) : 0,
    beta: m[5] !== undefined ? Number(m[5]) : null,
  };
}

// yy.mm.dd en hora de Buenos Aires: la promoción es de Juan, no de UTC.
export function todayBase(now = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', { timeZone: TZ, year: '2-digit', month: '2-digit', day: '2-digit' })
      .formatToParts(now).map((p) => [p.type, p.value]),
  );
  return `${parts.year}.${parts.month}.${parts.day}`;
}

/**
 * @param {object} i
 * @param {string}   i.today      yy.mm.dd
 * @param {string[]} i.allTags    todos los tags del repo
 * @param {string[]} i.headTags   los tags que ya apuntan al commit de este push
 * @returns {{ tag: string|null, skip: boolean, reason: string }}
 */
export function nextTag({ today, allTags, headTags = [] }) {
  const stables = allTags.map(parseTag).filter((p) => p && p.beta === null);

  const onHead = headTags.map(parseTag).find((p) => p && p.beta === null);
  if (onHead) return { tag: null, skip: true, reason: `el commit ya tiene tag (${onHead.tag})` };

  const sameDay = stables.filter((p) => p.base === today);
  if (!sameDay.length) return { tag: `v${today}`, skip: false, reason: 'push a main' };
  return { tag: `v${today}.${Math.max(...sameDay.map((p) => p.hotfix)) + 1}`, skip: false, reason: 'otro push a main el mismo día' };
}

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).split('\n').map((s) => s.trim()).filter(Boolean);

function main() {
  const arg = (name) => {
    const i = process.argv.indexOf(`--${name}`);
    return i > -1 ? process.argv[i + 1] : undefined;
  };
  const result = nextTag({
    today: arg('today') ?? todayBase(),
    allTags: git('tag', '--list'),
    headTags: git('tag', '--points-at', 'HEAD'),
  });
  // Punto de partida de las notas: la última estable (incluidos los v1.1.x viejos), así el changelog de una versión es
  // todo lo que salió desde la versión anterior. Los -beta.N viejos se saltean.
  const previous = git('tag', '--list', '--sort=-creatordate').filter((t) => t !== result.tag);
  const notesStartTag = previous.find((t) => !t.includes('-beta.'));
  process.stdout.write(`${JSON.stringify({ ...result, notesStartTag: notesStartTag ?? null })}\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
