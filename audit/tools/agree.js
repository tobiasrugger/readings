// agree.js — runs check.html's OWN rule code (cut verbatim from the page)
// over files on disk, so audit.py can be diffed against it cell by cell.
// Called by:  python3 audit.py --repos DIR --agree     (needs: npm i jsdom)
// args: check.html  readings-dir  pages.json  repo-dirs-json
const fs=require('fs'),path=require('path');const {JSDOM}=require('jsdom');
const html=fs.readFileSync(process.argv[2],'utf8');
let code=html.match(/<script>([\s\S]*?)<\/script>\s*<\/body>/)[1];
code=code.split('/* ---------- fetching ---------- */')[0];
global.DOMParser=new JSDOM('').window.DOMParser;
const ROBOT={};
eval(code.replace(/^var /mg,'global.__x=1;var '));
// robot
const R=process.argv[3]; // readings dir
for(const f of JSON.parse(fs.readFileSync(R+'/robot/results-index.json','utf8'))){
  for(const row of JSON.parse(fs.readFileSync(R+'/robot/'+f,'utf8'))){let p=row.page||'';if(p.indexOf('readings/')===0)p=p.slice(9);ROBOT[p]=row;}}
const pages=JSON.parse(fs.readFileSync(process.argv[4],'utf8')); // [{repo,path,file:abs}]
const repoDirs=JSON.parse(process.argv[5]);
const out=[];
for(const pg of pages){
  let t=fs.readFileSync(pg.abs,'utf8');
  const srcs=[];let m;const re=/<script[^>]+src=["']([^"':]+\.js)["']/gi;
  while((m=re.exec(t)))srcs.push(m[1]);
  if(srcs.length){const parts=srcs.slice(0,8).map(s=>{let f;if(/(^|\/)saveguard\.js$/.test(s))return '';
    if(s[0]==='/'){const b=s.slice(1).split('/');const base=repoDirs[b[0]];f=base&&b.length>1?path.join(base,b.slice(1).join('/')):null;}
    else f=path.join(path.dirname(pg.abs),s);
    try{return f?fs.readFileSync(f,'utf8'):''}catch(e){return ''}});
    t=t+'\n/* included */\n'+parts.join('\n');}
  const r=checkText(pg.path,t);
  const o={repo:pg.repo,path:pg.path,kind:r.kind};COLS.forEach(c=>o[c]=r[c]);out.push(o);
}
console.log(JSON.stringify(out));
