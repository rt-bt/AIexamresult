import { scrapeSarkariExam } from './lib/sources/index.js';

const items = await scrapeSarkariExam();
console.log('Total items:', items.length);
items.slice(0, 30).forEach(i => console.log(i.title.slice(0,60), '|', i.category, '|', i.url));

const alp = items.find(i => i.title.includes('RRB ALP'));
const raj = items.find(i => i.title.includes('Rajasthan'));
const aiims = items.find(i => i.title.includes('AIIMS'));
const cgl = items.find(i => i.title.includes('SSC CGL'));
console.log('---');
console.log('RRB ALP found:', !!alp, alp?.url);
console.log('Rajasthan SET found:', !!raj, raj?.url);
console.log('AIIMS CRE found:', !!aiims, aiims?.url);
console.log('SSC CGL found:', !!cgl, cgl?.url);
