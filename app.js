const years=['2027','2026','2025','2024','2023','2022','2021','2020','2019'];
const mediums=['Sinhala','Tamil','English'];
const terms=['Term 1','Term 2','Term 3'];
const papers=['Paper 1','Paper 2'];
const examPapers=['Paper 1','Paper 2','Paper 3'];
const provinces=[
 'Western Province',
 'Central Province',
 'Southern Province',
 'Northern Province',
 'Eastern Province',
 'North Western Province',
 'North Central Province',
 'Uva Province',
 'Sabaragamuwa Province'
];

const DATA={
 'grade1-5':{
  title:'Grade 1–5 Past Papers', grades:['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5'],
  subjects:['Sinhala','Tamil','English','Mathematics','Environment','Buddhism','Hinduism','Islam','Catholicism','Christianity'], term:true
 },
 scholarship:{title:'Grade 5 Scholarship Papers',paper:true,simple:true},
 'grade6-11':{
  title:'Grade 6–11 Term Test Papers', province:true, grades:['Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11'], term:true,
  subjects:['Sinhala Language & Literature','Sinhala Literature','Tamil Language & Literature','Tamil Literature','English Language','English Literature','Mathematics','Science','History','Geography','Civic Education','Health & Physical Education','ICT','Practical & Technical Skills','Business & Accounting Studies','Entrepreneurship Studies','Agriculture & Food Technology','Home Economics','Art','Eastern Music (පෙරදිග සංගීතය)','Western Music (අපරදිග සංගීතය)','Dancing','Drama & Theatre','Buddhism','Hinduism','Islam','Catholicism','Christianity','Second National Language – Sinhala','Second National Language – Tamil','French','German','Japanese','Chinese','Arabic','Pali','Sanskrit']
 },
 ol:{title:'G.C.E. O/L Past Papers',paper:true,
  subjects:['Sinhala Language & Literature','Sinhala Literature','Tamil Language & Literature','Tamil Literature','English Language','English Literature','Mathematics','Science','History','Geography','Civic Education','Health & Physical Education','ICT','Business & Accounting Studies','Entrepreneurship Studies','Home Economics','Agriculture & Food Technology','Art','Eastern Music (පෙරදිග සංගීතය)','Western Music (අපරදිග සංගීතය)','Dancing','Bharatha Dancing','Drama & Theatre','Buddhism','Catholicism','Christianity','Hinduism','Islam','Second National Language – Sinhala','Second National Language – Tamil','Japanese','French','German','Chinese','Arabic','Pali','Sanskrit']
 },
 'grade12-13':{title:'Grade 12–13 Term Test Papers',province:true,grades:['Grade 12','Grade 13'],term:true,streams:true},
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
 fillSelect('yearSelect',key==='grade6-11'?[...years,'2018']:years);fillSelect('mediumSelect',mediums);
 if(cfg.province){el('provinceWrap').hidden=false;fillSelect('provinceSelect',provinces)}
 if(cfg.grades){el('gradeWrap').hidden=false;fillSelect('gradeSelect',cfg.grades)}
 if(cfg.types){el('typeWrap').hidden=false;fillSelect('typeSelect',cfg.types)}
 if(cfg.term){el('termWrap').hidden=false;fillSelect('termSelect',terms)}
 if(cfg.paper){
  el('paperWrap').hidden=false;
  fillSelect('paperSelect',(key==='ol'||key==='al')?examPapers:papers);
 }
 let subjects=cfg.subjects||[];
 if(cfg.streams){el('streamArea').hidden=false;renderStreams();subjects=STREAMS[Object.keys(STREAMS)[0]]}
 if(cfg.simple){
   const subjectGrid=el('subjectGrid');
   if(subjectGrid){
     subjectGrid.hidden=true;
     const heading=subjectGrid.previousElementSibling;
     if(heading && heading.tagName==='H2') heading.hidden=true;
   }
 }else{
   renderSubjects(subjects,key);
 }
 ['provinceSelect','gradeSelect','typeSelect','yearSelect','termSelect','mediumSelect','paperSelect'].forEach(id=>el(id)?.addEventListener('change',updateResult));
 updateResult();
}
function renderStreams(){const box=el('streamTabs');box.innerHTML=Object.keys(STREAMS).map((s,i)=>`<button class="stream-tab ${i===0?'active':''}" data-stream="${s}">${s}</button>`).join('');box.onclick=e=>{if(!e.target.dataset.stream)return;box.querySelectorAll('button').forEach(b=>b.classList.remove('active'));e.target.classList.add('active');renderSubjects(STREAMS[e.target.dataset.stream],document.body.dataset.category);updateResult()}}
function renderSubjects(items){const box=el('subjectGrid');box.innerHTML=items.map((s,i)=>`<button class="subject-btn ${i===0?'active':''}" data-subject="${s}">${s}</button>`).join('');box.onclick=e=>{if(!e.target.dataset.subject)return;box.querySelectorAll('button').forEach(b=>b.classList.remove('active'));e.target.classList.add('active');updateResult()}}
function ensureResultPanels(){
 const box=document.querySelector('.result-box');
 if(!box || box.dataset.twoPanel==='1') return;
 box.dataset.twoPanel='1';
 const title=el('resultTitle');
 const msg=el('resultMessage');
 const oldActions=box.querySelector('.result-actions');
 if(oldActions) oldActions.remove();

 const grid=document.createElement('div');
 grid.className='resource-panels';
 grid.innerHTML=`
  <section class="resource-card question-card">
    <div class="resource-icon">📄</div>
    <h4>Question Paper</h4>
    <p id="questionStatus" class="resource-status">Coming Soon</p>
    <div class="resource-actions">
      <a id="openPdf" class="btn btn-primary btn-disabled" target="_blank">Open PDF</a>
      <a id="downloadPdf" class="btn btn-green btn-disabled">Download PDF</a>
    </div>
  </section>
  <section class="resource-card marking-card">
    <div class="resource-icon">✅</div>
    <h4>Marking Scheme</h4>
    <p id="markingStatus" class="resource-status">Coming Soon</p>
    <div class="resource-actions">
      <a id="openMarking" class="btn btn-primary btn-disabled" target="_blank">Open Marking Scheme</a>
      <a id="downloadMarking" class="btn btn-green btn-disabled">Download Marking Scheme</a>
    </div>
  </section>`;
 box.appendChild(grid);
 if(msg) msg.hidden=true;
}

function setResourceLink(openEl,downloadEl,url){
 if(url){
   openEl.href=url; downloadEl.href=url; downloadEl.setAttribute('download','');
   openEl.classList.remove('btn-disabled'); downloadEl.classList.remove('btn-disabled');
 }else{
   openEl.removeAttribute('href'); downloadEl.removeAttribute('href'); downloadEl.removeAttribute('download');
   openEl.classList.add('btn-disabled'); downloadEl.classList.add('btn-disabled');
 }
}

const UNAVAILABLE_UPLOADED_FILES=new Set([
 'pdfs/grade6-11/uploaded-batch/D001_2020_Art.pdf',
 'pdfs/grade6-11/uploaded-batch/D007_2019_Dancing.pdf',
 'pdfs/grade6-11/uploaded-batch/D014_2019_Buddhism.pdf',
 'pdfs/grade6-11/uploaded-batch/D014_Unknown_Other.pdf',
 'pdfs/grade6-11/uploaded-batch/D045_2023_Sinhala_Language_Literature.pdf',
 'pdfs/grade6-11/uploaded-batch/D050_2022_Mathematics.pdf',
 'pdfs/grade6-11/uploaded-batch/D061_2022_Mathematics.pdf',
 'pdfs/grade6-11/uploaded-batch/D065_2019_Art.pdf',
 'pdfs/grade6-11/uploaded-batch/D075_2019_Other.pdf',
 'pdfs/grade6-11/uploaded-batch/D076_Unknown_Other.pdf',
 'pdfs/grade6-11/uploaded-batch/D086_2019_Christianity.pdf',
 'pdfs/grade6-11/uploaded-batch/D090_2021_Sinhala_Language_Literature.pdf',
 'pdfs/grade6-11/uploaded-batch/D131_2019_Christianity.pdf',
 'pdfs/grade6-11/uploaded-batch/D151_2023_Dancing.pdf'
]);

// Display-only corrections verified from the paper PDFs. Keep the imported
// uploaded-paper dataset unchanged and apply these values only while filtering.
const VERIFIED_UPLOADED_DISPLAY_CORRECTIONS=new Map([
 ['pdfs/grade6-11/uploaded-batch/D012_2019_Art.pdf',{subject:'Mathematics'}],
 ['pdfs/grade6-11/uploaded-batch/D019_2019_Dancing.pdf',{subject:'Civic Education'}],
 ['pdfs/grade6-11/uploaded-batch/D026_2019_Health_Physical_Education.pdf',{subject:'Civic Education'}],
 ['pdfs/grade6-11/uploaded-batch/D047_2020_Health_Physical_Education.pdf',{subject:'Sinhala Language & Literature'}],
 ['pdfs/grade6-11/uploaded-batch/D055_2019_Christianity.pdf',{subject:'History'}],
 ['pdfs/grade6-11/uploaded-batch/D057_2019_Art.pdf',{subject:'History'}],
 ['pdfs/grade6-11/uploaded-batch/D078_2020_Drama_Theatre.pdf',{subject:'Eastern Music (පෙරදිග සංගීතය)'}],
 ['pdfs/grade6-11/uploaded-batch/D079_2019_Drama_Theatre.pdf',{subject:'Eastern Music (පෙරදිග සංගීතය)'}],
 ['pdfs/grade6-11/uploaded-batch/D117_2020_Science.pdf',{subject:'Mathematics'}],
 ['pdfs/grade6-11/uploaded-batch/D118_2019_Art.pdf',{subject:'Mathematics'}],
 ['pdfs/grade6-11/uploaded-batch/D129_2023_English_Language.pdf',{source:'Provincial Papers',institution:'Western Province',year:'2023',term:'Term 3',medium:'Sinhala',subject:'Catholicism'}],
 ['pdfs/grade6-11/uploaded-batch/D132_2023_Dancing.pdf',{source:'Provincial Papers',institution:'Southern Province',year:'2020',term:'Term 3',subject:'Civic Education'}],
 ['pdfs/grade6-11/uploaded-batch/D154_2020_Art.pdf',{subject:'Drama & Theatre'}],
 ['pdfs/grade6-11/uploaded-batch/D155_2019_Art.pdf',{subject:'Drama & Theatre'}],
 ['pdfs/grade6-11/uploaded-batch/D157_2020_Dancing.pdf',{source:'Provincial Papers',institution:'Southern Province',year:'2019',term:'Term 2',subject:'Drama & Theatre'}],
 ['pdfs/grade6-11/uploaded-batch/D158_2019_Science.pdf',{subject:'Geography'}],
 ['pdfs/grade6-11/uploaded-batch/D159_2023_Dancing.pdf',{subject:'Geography'}]
]);

function uploadedPaperForDisplay(paper){
 const correction=VERIFIED_UPLOADED_DISPLAY_CORRECTIONS.get(paper.url);
 return correction?{...paper,...correction}:paper;
}

function confirmedUploadedPapers(criteria){
 const source=window.UPLOADED_PAPERS||[];
 const seen=new Set();
 return source.map(uploadedPaperForDisplay).filter(p=>{
   const unclear=/unknown|needs review/i.test(p.institution)||p.year==='Unknown'||p.term==='Unknown'||p.subject==='Other';
   if(unclear||UNAVAILABLE_UPLOADED_FILES.has(p.url)||seen.has(p.url)) return false;
   const matches=Object.entries(criteria).every(([key,value])=>p[key]===value);
   if(matches) seen.add(p.url);
   return matches;
 });
}

function renderConfirmedPapers(records){
 const questionCard=document.querySelector('.question-card');
 const actions=questionCard?.querySelector('.resource-actions');
 let list=el('confirmedPaperList');
 if(!questionCard||!actions) return;
 if(!list){
   list=document.createElement('div');
   list.id='confirmedPaperList';
   list.className='confirmed-paper-list';
   actions.insertAdjacentElement('beforebegin',list);
 }
 if(!records.length){list.innerHTML='';list.hidden=true;actions.hidden=false;return}
 list.hidden=false;actions.hidden=true;
 list.innerHTML=records.map((p,index)=>`<div class="confirmed-paper-item"><span class="confirmed-paper-name">Paper ${index+1} · Document ${p.id}</span><a class="btn btn-primary" target="_blank" rel="noopener" href="${p.url}">Open</a><a class="btn btn-green" download href="${p.url}">Download</a></div>`).join('');
}

function updateResult(){
 ensureResultPanels();
 const key=document.body.dataset.category;

 if(key==='grade6-11' && window.KaviCategorySource?.isNonProvincial()){
   window.KaviCategorySource.render();
   return;
 }

 const vals=[];

 if(key==='scholarship'){
   vals.push(el('yearSelect')?.value);
   ['mediumSelect','paperSelect'].forEach(id=>{
     if(el(id)&&!el(id).closest('.filter-group').hidden) vals.push(el(id).value);
   });
 }else if(key==='grade6-11' || key==='grade12-13'){
   // Requested order: Province → Grade → Year → Term → Medium → Subject
   ['provinceSelect','gradeSelect','yearSelect','termSelect','mediumSelect'].forEach(id=>{
     if(el(id)&&!el(id).closest('.filter-group').hidden) vals.push(el(id).value);
   });
   const sub=el('subjectGrid')?.querySelector('.active')?.dataset.subject||'Subject';
   vals.push(sub);
 }else{
   ['gradeSelect','typeSelect'].forEach(id=>{
     if(el(id)&&!el(id).closest('.filter-group').hidden) vals.push(el(id).value);
   });
   const sub=el('subjectGrid')?.querySelector('.active')?.dataset.subject||'Subject';
   vals.push(sub,el('yearSelect')?.value);
   ['termSelect','mediumSelect','paperSelect'].forEach(id=>{
     if(el(id)&&!el(id).closest('.filter-group').hidden) vals.push(el(id).value);
   });
 }

 el('resultTitle').textContent=vals.filter(Boolean).join(' – ');
 const lookup=[key,...vals].join('|');
 const paperUrl=window.PAPER_LINKS?.[lookup];
 const markingUrl=window.MARKING_LINKS?.[lookup];
 const openPaper=el('openPdf'), downloadPaper=el('downloadPdf');
 const openMarking=el('openMarking'), downloadMarking=el('downloadMarking');
 const uploadedRecords=key==='grade6-11'?confirmedUploadedPapers({
   source:'Provincial Papers',institution:el('provinceSelect').value,grade:el('gradeSelect').value,
   year:el('yearSelect').value,term:el('termSelect').value,medium:el('mediumSelect').value,
   subject:el('subjectGrid')?.querySelector('.active')?.dataset.subject||'Subject'
 }):[];
 renderConfirmedPapers(uploadedRecords);
 setResourceLink(openPaper,downloadPaper,uploadedRecords.length?null:paperUrl);
 setResourceLink(openMarking,downloadMarking,markingUrl);
 el('questionStatus').textContent=uploadedRecords.length?`${uploadedRecords.length} confirmed paper${uploadedRecords.length===1?'':'s'} available.`:(paperUrl?'Question Paper එක සූදානම්.':'Question Paper – Coming Soon');
 el('markingStatus').textContent=markingUrl?'Marking Scheme එක සූදානම්.':'Marking Scheme – Coming Soon';
}

// Expose the shared renderer explicitly for the category-source controller.
// This avoids relying on browser-specific global function binding behaviour.
window.KaviPapers={confirmedUploadedPapers,renderConfirmedPapers,ensureResultPanels};

document.addEventListener('DOMContentLoaded',()=>{shared();ensureResultPanels();initCategory()});


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
