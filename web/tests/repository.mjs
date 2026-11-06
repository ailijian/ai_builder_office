// Release boundary checks also run in a clean export without Git metadata.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';

const root=fileURLToPath(new URL('../../',import.meta.url));
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const ignored=new Set(['node_modules','dist','.vite','test-results','playwright-report','coverage']);
function walk(dir){return fs.readdirSync(path.join(root,dir),{withFileTypes:true}).flatMap(e=>ignored.has(e.name)?[]:e.isDirectory()?walk(`${dir}/${e.name}`):[`${dir}/${e.name}`]);}
const docs=read('.gitignore').split(/\r?\n/).filter(s=>s.startsWith('!/docs/')&&!s.endsWith('/')).map(s=>s.slice(2));
const files=['LICENSE','README.md','AGENTS.md','.gitignore','.gitattributes',...docs,...walk('web')];
const included=new Set(files);
const problems=[];
const check=(condition,message)=>{if(!condition)problems.push(message);};
const forbidden=/(?:^|\/)(?:node_modules|dist|\.vite|test-results|playwright-report|coverage|\.env(?:\.[^/]*)?)(?:\/|$)|\.(?:glb|gltf|blend\d*|fbx|obj|stl|usd|usdz|zip|pem|key|p12|pfx|log|tmp|bak)$/i;
for(const file of files){
  check(!forbidden.test(file),`Forbidden release file: ${file}`);
  check(fs.existsSync(path.join(root,file)),`Missing release file: ${file}`);
}
let tracked;
try {
  const gitRoot=execFileSync('git',['rev-parse','--show-toplevel'],{cwd:root,encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim();
  if(path.resolve(gitRoot)===path.resolve(root))tracked=execFileSync('git',['ls-files','-z','--cached'],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean);
}catch{/* A clean source export intentionally has no .git. */}
if(tracked){
  for(const file of tracked)check(included.has(file)&&!forbidden.test(file),`Out-of-scope tracked/staged file: ${file}`);
  // A repository initialized with LICENSE only can be checked before staging.
  if(tracked.length>1)for(const file of files)check(tracked.includes(file),`Release file missing from index: ${file}`);
}
const pkg=JSON.parse(read('web/package.json')),lock=JSON.parse(read('web/package-lock.json'));
assert.deepEqual(pkg.dependencies,{'react':'19.3.1','react-dom':'19.3.1'});
for(const key of Object.keys(lock.packages))check(!/(?:node_modules\/three$|@react-three\/|@types\/three$)/.test(key),`Unexpected 3D dependency: ${key}`);
for(const [key,version] of Object.entries({...pkg.dependencies,...pkg.devDependencies})){
  check((lock.packages[''].dependencies?.[key]??lock.packages[''].devDependencies?.[key])===version,`Lock mismatch: ${key}`);
}
for(const file of files.filter(f=>/\.(?:ts|tsx|mjs)$/.test(f)&&f.startsWith('web/'))){
  const source=read(file);
  for(const match of source.matchAll(/(?:from\s*|import\s*)['"]([^'"]+)['"]/g)){
    if(!match[1].startsWith('.'))continue;
    const base=path.posix.normalize(path.posix.join(path.posix.dirname(file),match[1]));
    const candidate=[base,base+'.ts',base+'.tsx',base+'.mjs',base+'/index.ts'].find(f=>included.has(f));
    check(base.startsWith('web/')&&!!candidate,`Non-portable import in ${file}: ${match[1]}`);
  }
}
// Validate actual Markdown destinations against the release, not excluded files on this machine.
for(const file of files.filter(f=>f.endsWith('.md'))){
  const body=read(file).replace(/```[\s\S]*?```/g,'');
  for(const match of body.matchAll(/!?\[[^\]\n]+\]\(([^)\n]+)\)/g)){
    let target=match[1].replace(/^<|>$/g,'');
    if(/^(?:https?:|mailto:|#)/.test(target))continue;
    target=decodeURIComponent(target.split('#')[0]);
    const resolved=path.posix.normalize(path.posix.join(path.posix.dirname(file),target));
    check(included.has(resolved),`Unpublished Markdown destination in ${file}: ${target}`);
  }
}
const registry=JSON.parse(read('docs/production/ASSET_REGISTRY.json'));
let runtimeBytes=0,runtimeCount=0;
for(const asset of registry.assets){
  check(typeof asset.bundled==='boolean',`Missing distribution boundary: ${asset.id}`);
  check(!('absolute_path' in asset),`Machine-local path: ${asset.id}`);
  if(!asset.bundled)continue;
  check(included.has(asset.path),`Bundled asset missing from release: ${asset.id}`);
  const bytes=fs.readFileSync(path.join(root,asset.path));
  check(bytes.length===asset.bytes,`Asset size mismatch: ${asset.id}`);
  check(createHash('sha256').update(bytes).digest('hex')===asset.sha256,`Asset hash mismatch: ${asset.id}`);
  if(asset.path.startsWith('web/assets/')){runtimeBytes+=bytes.length;runtimeCount++;}
}
check(runtimeCount===11&&runtimeBytes===12172735,'Runtime PNG set differs from reviewed 11 original assets');
const provenance=JSON.parse(read('docs/design/b1-character-provenance.json'));
for(const asset of provenance.assets){
  for(const key of ['output','context_image','reference_image'])check(included.has(asset[key]),`Unpublished provenance reference: ${asset.id}/${key}`);
  check(!('generated_original' in asset),`Machine-local generation path: ${asset.id}`);
}
for(const file of files.filter(f=>!f.endsWith('.png'))){
  const content=read(file);
  check(!/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bsk-(?:proj-)?[A-Za-z0-9_-]{24,}|\bgh[pousr]_[A-Za-z0-9]{30,}/.test(content),`Potential secret pattern in ${file}`);
}
const dist=path.join(root,'web/dist');
if(fs.existsSync(dist)){
  const outputs=fs.readdirSync(dist,{recursive:true}).filter(f=>fs.statSync(path.join(dist,f)).isFile());
  check(outputs.filter(f=>f.endsWith('.html')).join()==='index.html','Build must contain only the Demo HTML entry');
  check(!outputs.some(f=>forbidden.test(f)),'Build unexpectedly contains a model or local artifact');
}
if(problems.length){console.error(problems.join('\n'));process.exitCode=1;}
else console.log(`PASS: ${files.length} scoped files; portable imports/docs; locked React-only runtime; 11 byte-identical PNGs; explicit archived-model metadata; no excluded index files or known secret patterns.`);
