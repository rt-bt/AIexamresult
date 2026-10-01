const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('data/posts');
let shortCount = 0;
let total = 0;
const lengths = [];

files.forEach(f => {
  if (!f.endsWith('.json')) return;
  total++;
  const post = JSON.parse(fs.readFileSync(path.join('data/posts', f), 'utf8'));
  const title = (post.title || '').trim();
  const cat = post.category || 'Government Exam';
  const tLower = title.toLowerCase();
  const catLower = cat.toLowerCase();

  let intentSuffix = '';
  if (catLower.includes('job') || tLower.includes('recruitment') || tLower.includes('vacancy') || tLower.includes('apply') || tLower.includes('online form')) {
    intentSuffix = tLower.includes('online form') ? 'Apply Online' : 'Online Form 2026, Notification PDF';
  } else if (catLower.includes('admit') || tLower.includes('admit card') || tLower.includes('hall ticket')) {
    intentSuffix = 'Admit Card 2026 Download Link';
  } else if (catLower.includes('result') || tLower.includes('result') || tLower.includes('score')) {
    intentSuffix = 'Result 2026 Direct Link, Scorecard';
  } else if (catLower.includes('answer') || tLower.includes('answer key')) {
    intentSuffix = 'Answer Key 2026 Objection Link';
  } else if (catLower.includes('syllabus')) {
    intentSuffix = 'Syllabus & Exam Pattern 2026 PDF';
  } else if (catLower.includes('admission')) {
    intentSuffix = 'Admission Online Form 2026';
  }

  const rawIntro = (post.intro || '').replace(/\[adinserter[^\]]*\]/gi, '').replace(/<[^>]*>/g, '').trim();
  let desc = '';

  if (rawIntro.length > 50) {
    const introSnip = rawIntro.substring(0, 200).replace(/\s+\S*$/, '');
    desc = introSnip + '… Check full notification & details at All India Exam Result.';
  } else {
    const dateHint = post.importantDates?.find((d) =>
      /last|apply|exam date|admit/i.test(d)
    );
    const dateStr = dateHint ? ' ' + dateHint.replace(/^.*?:/, '').trim() + '.' : '.';
    if (intentSuffix.includes('Online Form') || catLower.includes('job')) {
      desc = `${title}: Check eligibility criteria, age limit, application fee, last date to apply${dateStr} Download official notification PDF at All India Exam Result.`;
    } else if (intentSuffix.includes('Admit Card') || catLower.includes('admit')) {
      desc = `${title}: Download admit card, check exam date, reporting time & exam city slip${dateStr} Direct login link at All India Exam Result.`;
    } else if (intentSuffix.includes('Result') || catLower.includes('result')) {
      desc = `${title}: Check result, download scorecard, cut-off marks & qualifying merit list${dateStr} Direct official link at All India Exam Result.`;
    } else {
      desc = `${title}: Check important dates, application fee, eligibility & official direct links${dateStr} Complete details at All India Exam Result.`;
    }
  }

  if (desc.length < 120) {
    const extra = catLower.includes('job') || tLower.includes('recruitment')
      ? ' Apply online for latest govt job 2026 at All India Exam Result.'
      : catLower.includes('result') || tLower.includes('result')
      ? ' Download result & scorecard 2026 at All India Exam Result.'
      : catLower.includes('admit') || tLower.includes('admit card')
      ? ' Download admit card & check exam date 2026 at All India Exam Result.'
      : ' Get latest govt exam updates 2026 at All India Exam Result.';
    desc = desc.replace(/\.\s*$/, '') + extra;
  }

  if (desc.length > 165) desc = desc.substring(0, 160) + '…';

  lengths.push(desc.length);
  if (desc.length < 130) {
    shortCount++;
    if (shortCount <= 5) {
      console.log(`[Short ${desc.length}] ${f}: "${desc}"`);
    }
  }
});

console.log(`Total analyzed: ${total}`);
console.log(`Descriptions < 130 chars: ${shortCount}`);
console.log(`Descriptions < 140 chars: ${lengths.filter(l => l < 140).length}`);
console.log(`Min length: ${Math.min(...lengths)}, Max length: ${Math.max(...lengths)}`);
