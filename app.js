const years=['2029','2028','2027','2026','2025','2024','2023'];
const mediums=['Sinhala','Tamil','English'];
const terms=['Term 1','Term 2','Term 3'];
const papers=['Paper 1','Paper 2'];

const DATA={
 'grade1-5':{
  title:'Grade 1–5 Past Papers', grades:['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5'],
  subjects:['Sinhala','Tamil','English','Mathematics','Environment','Buddhism','Hinduism','Islam','Catholicism','Christianity'], term:true
 },
 scholarship:{title:'Grade 5 Scholarship Papers',types:['Past Papers','Model Papers','Provincial Papers'],subjects:['Scholarship Paper'],paper:true},
 'grade6-11':{
  title:'Grade 6–11 Term Test Papers', grades:['Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11'], term:true,
  subjects:['Sinhala Language & Literature','Tamil Language & Literature','English Language','Mathematics','Science','History','Geography','Civic Education','Health & Physical Education','ICT','Practical & Technical Skills','Business & Accounting Studies','Entrepreneurship Studies','Agriculture & Food Technology','Home Economics','Art','Eastern Music','Western Music','Dancing','Drama & Theatre','Buddhism','Hinduism','Islam','Catholicism','Christianity','Second National Language – Sinhala','Second National Language – Tamil','French','German','Japanese','Chinese','Arabic','Pali','Sanskrit']
 },
 ol:{title:'G.C.E. O/L Past Papers',paper:true,
  subjects:['Sinhala Language & Literature','Tamil Language & Literature','English Language','Mathematics','Science','History','Geography','Civic Education','Health & Physical Education','ICT','Business & Accounting Studies','Entrepreneurship Studies','Home Economics','Agriculture & Food Technology','Art','Eastern Music','Western Music','Dancing','Drama & Theatre','Buddhism','Catholicism','Christianity','Hinduism','Islam','Second National Language – Sinhala','Second National Language – Tamil','Japanese','French','German','Chinese','Arabic','Pali','Sanskrit']
 },
 'grade12-13':{title:'Grade 12–13 Term Test Papers',grades:['Grade 12','Grade 13'],term:true,streams:true},
 al:{title:'G.C.E. A/L Past Papers',paper:true,streams:true}
};
const STREAMS={
 'Physical Science':['Combined Mathematics','Physics','Chemistry','ICT'],
 'Biological Science':['Biology','Chemistry','Physics','Agricultural Science'],
 'Commerce':['Accounting','Business Studies','Economics','ICT','Business Statistics'],
 'Arts':['Sinhala','Tamil','English','Geography','Political Science','Logic & Scientific Method','History of Sri Lanka','Indian History','European History','Buddhist Civilization','Hindu Civilization','Islamic Civilization','Christian Civilization','Greek & Roman Civilization','Economics','Communication & Media Studies','Home Economics','French','German','Japanese','Chinese','Arabic','Pali','Sanskrit'],
 'Engineering Technology':['Engineering Technology','Science for Technology','ICT'],
 'Bio Systems Technology':['Bio Systems Technology','Science for Technology','ICT'],
 'Common Subjects':['General English','Common General Test']
};
function el(id){return document.getElementById(id)}
function fillSelect(id,items){const s=el(id);if(!s)return;s.innerHTML=items.map(x=>`<option>${x}</option>`).join('')}
function initTheme(){const saved=localStorage.getItem('kavi-theme')||'light';document.documentElement.dataset.theme=saved;updateThemeIcon()}
function updateThemeIcon(){const b=el('themeToggle');if(b)b.textContent=document.documentElement.dataset.theme==='dark'?'☀️':'🌙'}
function toggleTheme(){const next=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=next;localStorage.setItem('kavi-theme',next);updateThemeIcon()}
function shared(){initTheme();el('themeToggle')?.addEventListener('click',toggleTheme);el('menuToggle')?.addEventListener('click',()=>el('navLinks').classList.toggle('open'))}
function initCategory(){
 const key=document.body.dataset.category, cfg=DATA[key]; if(!cfg)return;
 el('pageTitle').textContent=cfg.title; document.title=cfg.title+' | Kavi Past Papers';
 fillSelect('yearSelect',years);fillSelect('mediumSelect',mediums);
 if(cfg.grades){el('gradeWrap').hidden=false;fillSelect('gradeSelect',cfg.grades)}
 if(cfg.types){el('typeWrap').hidden=false;fillSelect('typeSelect',cfg.types)}
 if(cfg.term){el('termWrap').hidden=false;fillSelect('termSelect',terms)}
 if(cfg.paper){el('paperWrap').hidden=false;fillSelect('paperSelect',papers)}
 let subjects=cfg.subjects||[];
 if(cfg.streams){el('streamArea').hidden=false;renderStreams();subjects=STREAMS[Object.keys(STREAMS)[0]]}
 renderSubjects(subjects,key);['gradeSelect','typeSelect','yearSelect','termSelect','mediumSelect','paperSelect'].forEach(id=>el(id)?.addEventListener('change',updateResult));
 updateResult();
}
function renderStreams(){const box=el('streamTabs');box.innerHTML=Object.keys(STREAMS).map((s,i)=>`<button class="stream-tab ${i===0?'active':''}" data-stream="${s}">${s}</button>`).join('');box.onclick=e=>{if(!e.target.dataset.stream)return;box.querySelectorAll('button').forEach(b=>b.classList.remove('active'));e.target.classList.add('active');renderSubjects(STREAMS[e.target.dataset.stream],document.body.dataset.category);updateResult()}}
function renderSubjects(items){const box=el('subjectGrid');box.innerHTML=items.map((s,i)=>`<button class="subject-btn ${i===0?'active':''}" data-subject="${s}">${s}</button>`).join('');box.onclick=e=>{if(!e.target.dataset.subject)return;box.querySelectorAll('button').forEach(b=>b.classList.remove('active'));e.target.classList.add('active');updateResult()}}
function updateResult(){
 const key=document.body.dataset.category; const vals=[];
 ['gradeSelect','typeSelect'].forEach(id=>{if(el(id)&&!el(id).closest('.filter-group').hidden)vals.push(el(id).value)});
 const sub=el('subjectGrid')?.querySelector('.active')?.dataset.subject||'Subject';vals.push(sub,el('yearSelect')?.value);
 ['termSelect','mediumSelect','paperSelect'].forEach(id=>{if(el(id)&&!el(id).closest('.filter-group').hidden)vals.push(el(id).value)});
 el('resultTitle').textContent=vals.filter(Boolean).join(' – ');
 const lookup=[key,...vals].join('|');const url=window.PAPER_LINKS?.[lookup];
 const open=el('openPdf'),download=el('downloadPdf'),msg=el('resultMessage');
 if(url){open.href=url;download.href=url;download.setAttribute('download','');open.classList.remove('btn-disabled');download.classList.remove('btn-disabled');msg.textContent='Paper එක සූදානම්. Open හෝ Download කරන්න.'}
 else{open.removeAttribute('href');download.removeAttribute('href');open.classList.add('btn-disabled');download.classList.add('btn-disabled');msg.textContent='මෙම paper එක තවම upload කරලා නැහැ — Coming Soon.'}
}
document.addEventListener('DOMContentLoaded',()=>{shared();initCategory()});


function initHeaderSearch(){
 const form=el('headerSearch'), input=el('searchInput');
 if(!form||!input)return;
 const pages=[
  {terms:['grade 1','grade 2','grade 3','grade 4','grade 5','primary'],url:'grade1-5.html'},
  {terms:['scholarship','grade 5 scholarship'],url:'scholarship.html'},
  {terms:['grade 6','grade 7','grade 8','grade 9','grade 10','grade 11'],url:'grade6-11.html'},
  {terms:['ol','o/l','ordinary level'],url:'ol.html'},
  {terms:['grade 12','grade 13'],url:'grade12-13.html'},
  {terms:['al','a/l','advanced level'],url:'al.html'}
 ];
 form.addEventListener('submit',e=>{
  e.preventDefault();
  const q=input.value.trim().toLowerCase();
  if(!q)return;
  const hit=pages.find(p=>p.terms.some(t=>q.includes(t)));
  location.href=hit?hit.url:'grade6-11.html';
 });
}
document.addEventListener('DOMContentLoaded',initHeaderSearch);
