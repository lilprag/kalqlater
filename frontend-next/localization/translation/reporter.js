import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

export function translationSummary(reports) {
  const locales = reports.map((report) => ({
    language: report.locale,
    files: report.files,
    words: report.words,
    missing: report.missing.length,
    englishResidue: report.englishResidue.length,
    placeholderErrors: report.placeholderErrors.length,
    jsonErrors: report.jsonErrors.length,
    schemaErrors: report.schemaErrors.length,
    completion: report.completion,
    publishReady: report.publishReady,
  }));
  return Object.freeze({ locales, publishReady: locales.filter((locale) => locale.publishReady).map((locale) => locale.language) });
}

export function translationMarkdown(summary) {
  const rows = summary.locales.map((locale) => `| ${locale.language} | ${locale.files} | ${locale.words} | ${locale.missing} | ${locale.englishResidue} | ${locale.placeholderErrors} | ${locale.jsonErrors + locale.schemaErrors} | ${locale.completion}% | ${locale.publishReady ? 'Yes' : 'No'} |`);
  return `# Translation readiness report\n\n| Language | Files | Words | Missing | English residue | Placeholder errors | JSON/schema errors | Complete | Publish ready |\n| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |\n${rows.join('\n')}\n\nPublish-ready locales: ${summary.publishReady.length ? summary.publishReady.join(', ') : 'None'}\n`;
}

export async function writeTranslationReports({ reports, reportsDirectory }) {
  const summary = translationSummary(reports);
  await mkdir(reportsDirectory, { recursive: true });
  await Promise.all([
    writeFile(path.join(reportsDirectory, 'translation-report.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8'),
    writeFile(path.join(reportsDirectory, 'translation-report.md'), translationMarkdown(summary), 'utf8'),
  ]);
  return summary;
}
