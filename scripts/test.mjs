import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const out = path.resolve('dist');
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()?files(path.join(dir,x.name)):[path.join(dir,x.name)]);}
const all = files(out);
const htmlFiles = all.filter(f=>f.endsWith('.html'));
const posts = JSON.parse(fs.readFileSync('content/posts.json','utf8'));
assert.equal(new Set(posts.map(p=>p.slug)).size,posts.length,'Duplicate article slug');
assert.equal(htmlFiles.length,posts.length+2,'Expected homepage, articles, and 404');
let count=0;
for(const file of htmlFiles){
 const html=fs.readFileSync(file,'utf8');
 assert.match(html,/<html lang="zh-CN">/);
 assert.match(html,/<meta name="viewport"/);
 assert.equal((html.match(/<h1(?:\s[^>]*)?>/g)||[]).length,1,`One h1 in ${file}`);
 assert(!/https?:\/\/(localhost|127\.0\.0\.1)/.test(html),'No local URLs in output');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
 assert.equal(new Set(ids).size,ids.length,`Duplicate ids in ${file}`);
 for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const href=m[1]; if(/^(https?:|mailto:|data:)/.test(href))continue;
  const [rel,hash]=href.split('#'); const target=rel?path.resolve(path.dirname(file),rel):file;
  assert(target.startsWith(out),'Local links must remain in output');
  assert(fs.existsSync(target),`Missing target ${href} in ${file}`);
  if(hash && target.endsWith('.html'))assert(fs.readFileSync(target,'utf8').includes(`id="${hash}"`),`Missing fragment ${href}`);
  count++;
 }
}
new vm.Script(fs.readFileSync('assets/app.js','utf8'));
assert(fs.existsSync(path.join(out,'.nojekyll')));
assert(fs.readFileSync(path.join(out,'index.html'),'utf8').includes('示例文章'));
assert(!fs.readFileSync(path.join(out,'index.html'),'utf8').includes('href="#"'));
console.log(`PASS: ${htmlFiles.length} HTML pages, ${count} local links/assets/anchors, unique ids, JS syntax, sample labels, and GitHub Pages marker.`);
