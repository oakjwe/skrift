'use strict';
const STORAGE_KEY = 'skrift.worksheet.v1';
const defaults = {text:'',font:'krokar',size:'large',mode:'model',align:'left',guides:true,middle:true};
const choices = {font:['krokar','tengd','penna'],size:['large','medium','small'],mode:['model','trace'],align:['left','right']};
const editor = document.querySelector('#text');
const form = document.querySelector('#settings');
const pages = document.querySelector('#pages');
const saveStatus = document.querySelector('#save-status');
const printButton = document.querySelector('#print');
let state = {...defaults};
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (saved && typeof saved === 'object') {
    if (typeof saved.text === 'string') state.text = saved.text;
    for (const [key, values] of Object.entries(choices)) if (values.includes(saved[key])) state[key] = saved[key];
    for (const key of ['guides','middle']) if (typeof saved[key] === 'boolean') state[key] = saved[key];
  }
} catch { saveStatus.textContent = 'Ekki tókst að lesa vistaðan texta.'; }
editor.value = state.text;
for (const input of form.elements) {
  if (input.type === 'radio') input.checked = state[input.name] === input.value;
  if (input.type === 'checkbox') input.checked = state[input.name];
}
if (/windows/i.test(navigator.userAgent)) document.documentElement.classList.add('windows');
form.addEventListener('submit', e => e.preventDefault());
function save() {
  try { localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); saveStatus.textContent = 'Vistað í þessum vafra'; }
  catch { saveStatus.textContent = 'Ekki tókst að vista. Haltu afriti af textanum.'; }
}
let frame;
function schedule() { cancelAnimationFrame(frame); frame = requestAnimationFrame(render); }
editor.addEventListener('input', () => { state.text = editor.value; save(); schedule(); });
form.addEventListener('change', () => {
  for (const input of form.elements) {
    if (input.type === 'radio' && input.checked) state[input.name] = input.value;
    if (input.type === 'checkbox') state[input.name] = input.checked;
  }
  save(); schedule();
});
for (const button of document.querySelectorAll('[data-insert]')) button.addEventListener('click', () => {
  editor.setRangeText(button.dataset.insert, editor.selectionStart, editor.selectionEnd, 'end');
  editor.focus(); editor.dispatchEvent(new Event('input'));
});
// A backslash escapes a recognized token; unknown tokens remain ordinary text.
function parse(text) {
  const parts = []; let buffer = '';
  const flush = () => { if (buffer) { parts.push({type:'text',value:buffer}); buffer = ''; } };
  const tokens = /\\?\{(?:br|blank|page)\}|\r\n|\r|\n/g;
  let start = 0;
  for (const match of text.matchAll(tokens)) {
    buffer += text.slice(start,match.index);
    if (match[0].startsWith('\\')) buffer += match[0].slice(1);
    else { flush(); parts.push({type:match[0].startsWith('{') ? match[0].slice(1,-1) : 'br'}); }
    start = match.index + match[0].length;
  }
  buffer += text.slice(start); flush(); return parts;
}
let fontsReady = false;
function render() {
  if (!fontsReady) return;
  const size = {large:94,medium:68,small:48}[state.size];
  const leading = {large:140,medium:106,small:68}[state.size];
  const family = {krokar:'Krokar',tengd:'Tengd',penna:'Penna'}[state.font];
  // Measure actual shaped DOM text so contextual font features match the preview.
  const ruler = document.createElement('span');
  Object.assign(ruler.style,{position:'absolute',visibility:'hidden',whiteSpace:'pre',fontFamily:family,fontSize:`${size}px`,fontFeatureSettings:'"liga" 1,"clig" 1,"dlig" 1,"hlig" 1,"calt" 1'});
  document.body.append(ruler);
  const width = 170 * 96 / 25.4 - 28;
  const rowsPerPage = Math.floor((257 * 96 / 25.4) / leading);
  const result = [[]]; let current = '';
  const page = () => result[result.length-1];
  const emit = () => {
    if (page().length === rowsPerPage) result.push([]);
    page().push(current); current = '';
  };
  const fits = value => { ruler.textContent = value; return ruler.getBoundingClientRect().width <= width; };
  const append = text => {
    for (const word of text.match(/\s+|\S+/gu) || []) {
      if (fits(current + word)) { current += word; continue; }
      if (current) {
        emit();
        // A wrapping separator should not indent the next practice row.
        if (/^\s+$/u.test(word)) continue;
      }
      if (fits(word)) { current = word; continue; }
      // Split unusually long words without breaking combining character sequences.
      const segments = typeof Intl.Segmenter === 'function' ? Array.from(new Intl.Segmenter('is',{granularity:'grapheme'}).segment(word),x=>x.segment) : Array.from(word);
      for (const letter of segments) { if (current && !fits(current+letter)) emit(); current += letter; }
    }
  };
  for (const token of parse(state.text)) {
    if (token.type === 'text') append(token.value);
    if (token.type === 'br') emit();
    if (token.type === 'blank') { if (current) emit(); emit(); }
    if (token.type === 'page') { if (current) emit(); result.push([]); }
  }
  if (current) emit();
  ruler.remove();
  const fragment = document.createDocumentFragment();
  result.forEach((rows,index) => {
    const frame = document.createElement('div'); frame.className = 'page-frame';
    const sheet = document.createElement('article'); sheet.className = 'sheet';
    sheet.setAttribute('aria-label',`Síða ${index+1}`);
    for (const key of ['size','font','align','mode','guides','middle']) sheet.dataset[key] = String(state[key]);
    for (let i=0;i<rowsPerPage;i++) {
      const row = document.createElement('div'); row.className = 'writing-row';
      for (const type of ['top','middle','base','bottom']) { const line = document.createElement('span'); line.className = `guide ${type}`; line.setAttribute('aria-hidden','true'); row.append(line); }
      const text = document.createElement('span'); text.className = 'row-text'; text.textContent = rows[i] || ''; row.append(text); sheet.append(row);
    }
    const foot = document.createElement('div'); foot.className = 'sheet-foot';
    const name = document.createElement('span'); name.textContent = 'Skrift';
    const number = document.createElement('span'); number.textContent = `${index+1} / ${result.length}`;
    foot.append(name,number); sheet.append(foot); frame.append(sheet); fragment.append(frame);
  });
  pages.replaceChildren(fragment); scalePages();
  document.querySelector('#page-count').textContent = `A4 · ${result.length} ${result.length===1?'síða':'síður'}`;
  document.querySelector('#render-status').textContent = '';
  pages.setAttribute('aria-busy','false');
}
function scalePages() {
  const fullWidth = 210 * 96 / 25.4;
  const fullHeight = 297 * 96 / 25.4;
  const scale = Math.min(1,pages.clientWidth/fullWidth);
  for (const frame of pages.children) {
    frame.style.width = `${fullWidth*scale}px`; frame.style.height = `${fullHeight*scale}px`;
    frame.firstElementChild.style.transform = `scale(${scale})`;
  }
}
new ResizeObserver(scalePages).observe(pages);
printButton.disabled = true;
Promise.all(['Krokar','Tengd','Penna'].map(font=>document.fonts.load(`94px ${font}`))).then(() => {
  fontsReady = true; render(); printButton.disabled = false;
}).catch(() => {
  document.querySelector('#render-status').textContent = 'Ekki tókst að hlaða skriftarletri. Endurhlaðaðu síðuna áður en þú prentar.';
});
printButton.addEventListener('click',() => { render(); window.print(); });
window.addEventListener('beforeprint',render);
