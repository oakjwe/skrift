// Run with: gjs tests/check.js (no npm dependencies required).
const GLib = imports.gi.GLib;
const [, bytes] = GLib.file_get_contents('app/app.js');
const source = new TextDecoder().decode(bytes);
new Function(source); // Parse the complete application script.
const begin = source.indexOf('function parse(text)');
const end = source.indexOf('let fontsReady',begin);
const parse = new Function(source.slice(begin,end) + '; return parse;')();
let count = 0;
function check(name,input,expected) {
  const actual = parse(input);
  if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(name+': '+JSON.stringify(actual));
  count++;
}
check('Icelandic text','Þór og Ægir',[{type:'text',value:'Þór og Ægir'}]);
check('Newline variants','a\r\nb\rc\nd',[{type:'text',value:'a'},{type:'br'},{type:'text',value:'b'},{type:'br'},{type:'text',value:'c'},{type:'br'},{type:'text',value:'d'}]);
check('Formatting tokens','a{br}{blank}{page}b',[{type:'text',value:'a'},{type:'br'},{type:'blank'},{type:'page'},{type:'text',value:'b'}]);
check('Escaped tokens','\\{br} \\{blank} \\{page}',[{type:'text',value:'{br} {blank} {page}'}]);
check('Unknown tokens','{other}',[{type:'text',value:'{other}'}]);
check('Blank input','',[]);
check('Consecutive breaks','\n\n',[{type:'br'},{type:'br'}]);
check('HTML stays text','<img src=x onerror=alert(1)>',[{type:'text',value:'<img src=x onerror=alert(1)>'}]);
print(`Application syntax and ${count} formatting parser checks passed.`);

// Exercise app events with a small DOM double. Font geometry/printing still
// require a real browser; this checks state flow, safety and pagination logic.
class Element {
  constructor() { this.children=[]; this.style={}; this.dataset={}; this.listeners={}; this.value=''; this.textContent=''; this.clientWidth=800; }
  append(...items) { this.children.push(...items); }
  replaceChildren(fragment) { this.children=[...fragment.children]; }
  setAttribute(name,value) { this[name]=value; }
  addEventListener(name,fn) { this.listeners[name]=fn; }
  getBoundingClientRect() { return {width:Array.from(this.textContent).length*35}; }
  remove() {}
  get firstElementChild() { return this.children[0]; }
}
const nodes = {};
for (const id of ['text','settings','pages','save-status','print','page-count','render-status']) nodes['#'+id]=new Element();
nodes['#settings'].elements=[];
let stored=null;
const fakeDocument = {
  querySelector: id=>nodes[id], querySelectorAll:()=>[],
  createElement:()=>new Element(), createDocumentFragment:()=>new Element(),
  body:new Element(), documentElement:{classList:{add(){}}},
  fonts:{load:()=>Promise.resolve([])}
};
let printCalls=0;
const fakeWindow={addEventListener(){},print(){printCalls++;}};
const fakeStorage={getItem:()=>stored,setItem:(_,value)=>{stored=value;}};
const initialize = new Function('document','window','navigator','localStorage','ResizeObserver','requestAnimationFrame','cancelAnimationFrame',source+'; return {render,setReady(){fontsReady=true;}};');
const app=initialize(fakeDocument,fakeWindow,{userAgent:'Linux'},fakeStorage,class{observe(){}},()=>1,()=>{});
app.setReady(); app.render();
function assert(value,message) { if(!value) throw new Error(message); count++; }
assert(nodes['#pages'].children.length===1,'Blank worksheet must have one page');
const enter = value => { nodes['#text'].value=value; nodes['#text'].listeners.input(); app.render(); };
enter('Halló Þór');
assert(nodes['#text'].value==='Halló Þór','Editor content must survive preview');
assert(JSON.parse(stored).text==='Halló Þór','Editor input must persist');
enter('A{page}B');
assert(nodes['#pages'].children.length===2,'Page token must create another sheet');
let rows=nodes['#pages'].children[0].firstElementChild.children;
assert(rows[0].children[4].textContent==='A','First page contains A');
rows=nodes['#pages'].children[1].firstElementChild.children;
assert(rows[0].children[4].textContent==='B','Second page contains B');
enter('A{blank}B');
rows=nodes['#pages'].children[0].firstElementChild.children;
assert(rows[1].children[4].textContent==='' && rows[2].children[4].textContent==='B','Blank token must reserve a practice row');
enter(Array(20).fill('Þór').join('\n'));
assert(nodes['#pages'].children.length===4,'Twenty large rows must paginate across four sheets');
enter('<script>alert(1)</script>');
rows=nodes['#pages'].children[0].firstElementChild.children;
assert(rows[0].children[4].textContent.startsWith('<script>'),'HTML must remain literal text');
nodes['#print'].listeners.click();
assert(printCalls===1,'Print action must invoke window.print');
const restored=initialize(fakeDocument,fakeWindow,{userAgent:'Linux'},fakeStorage,class{observe(){}},()=>1,()=>{});
assert(nodes['#text'].value==='<script>alert(1)</script>','New app session must restore saved content');
print(`All ${count} parser and application behavior checks passed.`);
