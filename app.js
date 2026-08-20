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
 ['pdfs/grade6-11/uploaded-batch/D003_Unknown_Other.pdf',{source:'Provincial Papers',institution:'Western Province',year:'2019',term:'Term 3',medium:'Sinhala',subject:'Art'}],
 ['pdfs/grade6-11/uploaded-batch/D005_2019_Buddhism.pdf',{source:'Provincial Papers',institution:'North Western Province',year:'2019',term:'Term 2',medium:'Sinhala',subject:'Buddhism'}],
 ['pdfs/grade6-11/uploaded-batch/D006_2019_Art.pdf',{source:'Provincial Papers',institution:'Southern Province',year:'2019',term:'Term 2',medium:'Sinhala',subject:'Art'}],
 ['pdfs/grade6-11/uploaded-batch/D008_2022_Mathematics.pdf',{source:'Provincial Papers',institution:'North Western Province',year:'2022',term:'Term 3',medium:'Sinhala',subject:'Art'}],
 ['pdfs/grade6-11/uploaded-batch/D009_2019_Buddhism.pdf',{source:'Provincial Papers',institution:'North Western Province',year:'2019',term:'Term 2',medium:'Sinhala',subject:'Buddhism'}],
 ['pdfs/grade6-11/uploaded-batch/D009_Unknown_Art.pdf',{source:'Education Zone',institution:'Matugama Education Zone',year:'2020',term:'Term 2',medium:'Sinhala',subject:'Art'}],
 ['pdfs/grade6-11/uploaded-batch/D010_2019_Art.pdf',{source:'Provincial Papers',institution:'North Western Province',year:'2019',term:'Term 2',medium:'Sinhala',subject:'Art'}],
 ['pdfs/grade6-11/uploaded-batch/D011_Unknown_Other.pdf',{source:'Provincial Papers',institution:'Southern Province',year:'2020',term:'Term 2',medium:'Sinhala',subject:'Buddhism'}],
 ['pdfs/grade6-11/uploaded-batch/D012_2019_Art.pdf',{subject:'Mathematics'}],
 ['pdfs/grade6-11/uploaded-batch/D013_2022_Mathematics.pdf',{source:'Provincial Papers',institution:'North Western Province',year:'2022',term:'Term 3',medium:'Sinhala',subject:'Buddhism'}],
 ['pdfs/grade6-11/uploaded-batch/D015_2021_Other.pdf',{source:'Provincial Papers',institution:'Western Province',year:'2021',term:'Term 3',medium:'Sinhala',subject:'Buddhism'}],
 ['pdfs/grade6-11/uploaded-batch/D016_2019_Buddhism.pdf',{source:'Provincial Papers',institution:'Southern Province',year:'2019',term:'Term 2',medium:'Sinhala',subject:'Buddhism'}],
 ['pdfs/grade6-11/uploaded-batch/D017_Unknown_Buddhism.pdf',{source:'Provincial Papers',institution:'North Central Province',year:'2019',term:'Term 2',medium:'Sinhala',subject:'Buddhism'}],
 ['pdfs/grade6-11/uploaded-batch/D018_Unknown_Buddhism.pdf',{source:'Education Zone',institution:'Matugama Education Zone',year:'2023',term:'Term 2',medium:'Sinhala',subject:'Buddhism'}],
 ['pdfs/grade6-11/uploaded-batch/D019_2019_Dancing.pdf',{subject:'Civic Education'}],
 ['pdfs/grade6-11/uploaded-batch/D021_2019_Health_Physical_Education.pdf',{source:'Provincial Papers',institution:'North Western Province',year:'2019',term:'Term 2',medium:'Sinhala',subject:'Civic Education'}],
 ['pdfs/grade6-11/uploaded-batch/D023_Unknown_Other.pdf',{source:'Education Zone',institution:'Matugama Education Zone',year:'2023',term:'Term 2',medium:'Sinhala',subject:'Civic Education'}],
 ['pdfs/grade6-11/uploaded-batch/D024_Unknown_Other.pdf',{source:'Education Zone',institution:'Matugama Education Zone',year:'2023',term:'Term 2',medium:'Sinhala',subject:'Civic Education'}],
 ['pdfs/grade6-11/uploaded-batch/D026_2019_Health_Physical_Education.pdf',{subject:'Civic Education'}],
 ['pdfs/grade6-11/uploaded-batch/D027_Unknown_Other.pdf',{source:'Provincial Papers',institution:'Western Province',year:'2023',term:'Term 3',medium:'Sinhala',subject:'Civic Education'}],
 ['pdfs/grade6-11/uploaded-batch/D029_Unknown_English_Language.pdf',{source:'Provincial Papers',institution:'North Central Province',year:'2019',term:'Term 2',medium:'English',subject:'English Language'}],
 ['pdfs/grade6-11/uploaded-batch/D030_2020_Other.pdf',{source:'Education Zone',institution:'Matugama Education Zone',year:'2020',term:'Term 2',medium:'English',subject:'English Language'}],
 ['pdfs/grade6-11/uploaded-batch/D031_2019_English_Language.pdf',{source:'Provincial Papers',institution:'North Western Province',year:'2019',term:'Term 2',medium:'English',subject:'English Language'}],
 ['pdfs/grade6-11/uploaded-batch/D032_2019_Other.pdf',{source:'Provincial Papers',institution:'Southern Province',year:'2019',term:'Term 2',medium:'English',subject:'English Language'}],
 ['pdfs/grade6-11/uploaded-batch/D036_Unknown_Other.pdf',{source:'Provincial Papers',institution:'Western Province',year:'2019',term:'Term 3',medium:'Sinhala',subject:'Dancing'}],
 ['pdfs/grade6-11/uploaded-batch/D037_2022_Mathematics.pdf',{source:'Provincial Papers',institution:'North Western Province',year:'2022',term:'Term 3',medium:'Sinhala',subject:'Dancing'}],
 ['pdfs/grade6-11/uploaded-batch/D038_2019_Other.pdf',{source:'Provincial Papers',institution:'Central Province',year:'2019',term:'Term 3',medium:'Tamil',subject:'Second National Language – Tamil'}],
 ['pdfs/grade6-11/uploaded-batch/D039_2022_Mathematics.pdf',{source:'Provincial Papers',institution:'Western Province',year:'2022',term:'Term 3',medium:'Tamil',subject:'Second National Language – Tamil'}],
 ['pdfs/grade6-11/uploaded-batch/D040_2021_Islam.pdf',{source:'Provincial Papers',institution:'Western Province',year:'2021',term:'Term 3',medium:'Sinhala',subject:'Islam'}],
 ['pdfs/grade6-11/uploaded-batch/D041_2019_Dancing.pdf',{source:'Provincial Papers',institution:'North Western Province',year:'2019',term:'Term 2',medium:'Sinhala',subject:'Dancing'}],
 ['pdfs/grade6-11/uploaded-batch/D043_2023_Mathematics.pdf',{source:'College Papers',institution:'Royal College Horana',year:'2023',term:'Term 1',medium:'Sinhala',subject:'ICT'}],
 ['pdfs/grade6-11/uploaded-batch/D047_2020_Health_Physical_Education.pdf',{subject:'Sinhala Language & Literature'}],
 ['pdfs/grade6-11/uploaded-batch/D048_2019_Sinhala_Language_Literature.pdf',{source:'Provincial Papers',institution:'North Western Province',year:'2019',term:'Term 2',medium:'Sinhala',subject:'Sinhala Language & Literature'}],
 ['pdfs/grade6-11/uploaded-batch/D049_Unknown_Other.pdf',{source:'Provincial Papers',institution:'Western Province',year:'2019',term:'Term 3',medium:'Sinhala',subject:'Sinhala Language & Literature'}],
 ['pdfs/grade6-11/uploaded-batch/D051_2019_Other.pdf',{source:'Provincial Papers',institution:'North Western Province',year:'2019',term:'Term 1',medium:'Sinhala',subject:'Civic Education'}],
 ['pdfs/grade6-11/uploaded-batch/D052_2019_Christianity.pdf',{source:'Provincial Papers',institution:'Central Province',year:'2019',term:'Term 3',medium:'Sinhala',subject:'Civic Education'}],
 ['pdfs/grade6-11/uploaded-batch/D053_2022_Mathematics.pdf',{source:'Provincial Papers',institution:'North Western Province',year:'2022',term:'Term 3',medium:'Sinhala',subject:'Civic Education'}],
 ['pdfs/grade6-11/uploaded-batch/D055_2019_Christianity.pdf',{subject:'History'}],
 ['pdfs/grade6-11/uploaded-batch/D056_Unknown_Art.pdf',{source:'Education Zone',institution:'Matugama Education Zone',year:'2023',term:'Term 2',medium:'Sinhala',subject:'History'}],
 ['pdfs/grade6-11/uploaded-batch/D057_2019_Art.pdf',{subject:'History'}],
 ['pdfs/grade6-11/uploaded-batch/D058_Unknown_Other.pdf',{source:'Provincial Papers',institution:'Western Province',year:'2019',term:'Term 3',medium:'Sinhala',subject:'History'}],
 ['pdfs/grade6-11/uploaded-batch/D059_2019_Other.pdf',{source:'Provincial Papers',institution:'North Western Province',year:'2019',term:'Term 1',medium:'Sinhala',subject:'Mathematics'}],
 ['pdfs/grade6-11/uploaded-batch/D063_2019_Drama_Theatre.pdf',{source:'Provincial Papers',institution:'Central Province',year:'2019',term:'Term 3',medium:'Sinhala',subject:'Eastern Music (පෙරදිග සංගීතය)'}],
 ['pdfs/grade6-11/uploaded-batch/D064_2019_Drama_Theatre.pdf',{source:'Provincial Papers',institution:'Southern Province',year:'2019',term:'Term 3',medium:'Sinhala',subject:'Eastern Music (පෙරදිග සංගීතය)'}],
 ['pdfs/grade6-11/uploaded-batch/D067_2022_Mathematics.pdf',{source:'Provincial Papers',institution:'North Western Province',year:'2022',term:'Term 3',medium:'Sinhala',subject:'Geography'}],
 ['pdfs/grade6-11/uploaded-batch/D069_Unknown_Other.pdf',{source:'Provincial Papers',institution:'Southern Province',year:'2019',term:'Term 3',medium:'Sinhala',subject:'Islam'}],
 ['pdfs/grade6-11/uploaded-batch/D070_2019_Islam.pdf',{source:'Provincial Papers',institution:'North Western Province',year:'2019',term:'Term 2',medium:'Sinhala',subject:'Islam'}],
 ['pdfs/grade6-11/uploaded-batch/D071_2018_Other.pdf',{source:'Provincial Papers',institution:'Western Province',year:'2018',term:'Term 2',medium:'Sinhala',subject:'Christianity'}],
 ['pdfs/grade6-11/uploaded-batch/D072_2022_Mathematics.pdf',{source:'College Papers',institution:'Kuli/J.R. Jayawardena National School',year:'2022',term:'Term 1',medium:'Sinhala',subject:'ICT'}],
 ['pdfs/grade6-11/uploaded-batch/D074_Unknown_Other.pdf',{source:'Provincial Papers',institution:'Western Province',year:'2023',term:'Term 3',medium:'Sinhala',subject:'History'}],
 ['pdfs/grade6-11/uploaded-batch/D077_2019_Drama_Theatre.pdf',{source:'Provincial Papers',institution:'North Western Province',year:'2019',term:'Term 2',medium:'Sinhala',subject:'Eastern Music (පෙරදිග සංගීතය)'}],
 ['pdfs/grade6-11/uploaded-batch/D078_2020_Drama_Theatre.pdf',{subject:'Eastern Music (පෙරදිග සංගීතය)'}],
 ['pdfs/grade6-11/uploaded-batch/D079_2019_Drama_Theatre.pdf',{subject:'Eastern Music (පෙරදිග සංගීතය)'}],
 ['pdfs/grade6-11/uploaded-batch/D080_Unknown_Other.pdf',{source:'Provincial Papers',institution:'Southern Province',year:'2020',term:'Term 2',medium:'Tamil',subject:'Second National Language – Tamil'}],
 ['pdfs/grade6-11/uploaded-batch/D085_Unknown_Catholicism.pdf',{source:'Provincial Papers',institution:'North Central Province',year:'2019',term:'Term 2',medium:'Sinhala',subject:'Catholicism'}],
 ['pdfs/grade6-11/uploaded-batch/D091_2019_Sinhala_Language_Literature.pdf',{source:'Provincial Papers',institution:'Southern Province',year:'2019',term:'Term 2',medium:'Sinhala',subject:'Sinhala Language & Literature'}],
 ['pdfs/grade6-11/uploaded-batch/D092_2022_Mathematics.pdf',{source:'Provincial Papers',institution:'North Western Province',year:'2022',term:'Term 3',medium:'Sinhala',subject:'Sinhala Language & Literature'}],
 ['pdfs/grade6-11/uploaded-batch/D093_2022_Mathematics.pdf',{source:'Provincial Papers',institution:'North Western Province',year:'2022',term:'Term 3',medium:'Sinhala',subject:'Sinhala Language & Literature'}],
 ['pdfs/grade6-11/uploaded-batch/D095_2019_Art.pdf',{source:'Provincial Papers',institution:'Southern Province',year:'2019',term:'Term 3',medium:'Sinhala',subject:'History'}],
 ['pdfs/grade6-11/uploaded-batch/D096_2019_Other.pdf',{source:'Provincial Papers',institution:'North Western Province',year:'2019',term:'Term 3',medium:'Tamil',subject:'Second National Language – Tamil'}],
 ['pdfs/grade6-11/uploaded-batch/D097_2019_Other.pdf',{source:'Provincial Papers',institution:'Central Province',year:'2019',term:'Term 3',medium:'Tamil',subject:'Second National Language – Tamil'}],
 ['pdfs/grade6-11/uploaded-batch/D098_2019_Other.pdf',{source:'Provincial Papers',institution:'North Western Province',year:'2019',term:'Term 3',medium:'Tamil',subject:'Second National Language – Tamil'}],
 ['pdfs/grade6-11/uploaded-batch/D099_Unknown_Other.pdf',{source:'Provincial Papers',institution:'Western Province',year:'2019',term:'Term 3',medium:'Sinhala',subject:'Health & Physical Education'}],
 ['pdfs/grade6-11/uploaded-batch/D101_2022_Mathematics.pdf',{source:'Provincial Papers',institution:'North Western Province',year:'2022',term:'Term 3',medium:'Sinhala',subject:'Health & Physical Education'}],
 ['pdfs/grade6-11/uploaded-batch/D103_2019_Health_Physical_Education.pdf',{source:'Provincial Papers',institution:'Southern Province',year:'2019',term:'Term 2',medium:'Sinhala',subject:'Health & Physical Education'}],
 ['pdfs/grade6-11/uploaded-batch/D104_2022_Mathematics.pdf',{source:'Provincial Papers',institution:'North Western Province',year:'2022',term:'Term 3',medium:'Sinhala',subject:'Science'}],
 ['pdfs/grade6-11/uploaded-batch/D105_Unknown_Other.pdf',{source:'Provincial Papers',institution:'Western Province',year:'2019',term:'Term 3',medium:'Sinhala',subject:'Science'}],
 ['pdfs/grade6-11/uploaded-batch/D108_2021_Health_Physical_Education.pdf',{source:'Provincial Papers',institution:'Western Province',year:'2021',term:'Term 3',medium:'Sinhala',subject:'Science'}],
 ['pdfs/grade6-11/uploaded-batch/D111_2019_Science.pdf',{source:'Provincial Papers',institution:'North Western Province',year:'2019',term:'Term 2',medium:'Sinhala',subject:'Science'}],
 ['pdfs/grade6-11/uploaded-batch/D113_Unknown_Sinhala_Language_Literature.pdf',{source:'Provincial Papers',institution:'North Central Province',year:'2019',term:'Term 2',medium:'Sinhala',subject:'Sinhala Language & Literature'}],
 ['pdfs/grade6-11/uploaded-batch/D116_2021_Mathematics.pdf',{source:'Provincial Papers',institution:'Western Province',year:'2021',term:'Term 3',medium:'Sinhala',subject:'Mathematics'}],
 ['pdfs/grade6-11/uploaded-batch/D117_2020_Science.pdf',{subject:'Mathematics'}],
 ['pdfs/grade6-11/uploaded-batch/D118_2019_Art.pdf',{subject:'Mathematics'}],
 ['pdfs/grade6-11/uploaded-batch/D119_2019_Other.pdf',{source:'Provincial Papers',institution:'North Western Province',year:'2019',term:'Term 2',medium:'Sinhala',subject:'Mathematics'}],
 ['pdfs/grade6-11/uploaded-batch/D120_2019_Other.pdf',{source:'Provincial Papers',institution:'North Western Province',year:'2019',term:'Term 1',medium:'Sinhala',subject:'Christianity'}],
 ['pdfs/grade6-11/uploaded-batch/D121_2022_Mathematics.pdf',{source:'Provincial Papers',institution:'North Western Province',year:'2022',term:'Term 3',medium:'Sinhala',subject:'Health & Physical Education'}],
 ['pdfs/grade6-11/uploaded-batch/D124_2023_Mathematics.pdf',{source:'Provincial Papers',institution:'Southern Province',year:'2023',term:'Term 3',medium:'Sinhala',subject:'Mathematics'}],
 ['pdfs/grade6-11/uploaded-batch/D126_2020_Other.pdf',{source:'Education Zone',institution:'Matugama Education Zone',year:'2020',term:'Term 2',medium:'Sinhala',subject:'Mathematics'}],
 ['pdfs/grade6-11/uploaded-batch/D127_2020_Mathematics.pdf',{source:'Provincial Papers',institution:'North Western Province',year:'2019',term:'Term 2',medium:'Sinhala',subject:'Catholicism'}],
 ['pdfs/grade6-11/uploaded-batch/D129_2023_English_Language.pdf',{source:'Provincial Papers',institution:'Western Province',year:'2021',term:'Term 3',medium:'Sinhala',subject:'Catholicism'}],
 ['pdfs/grade6-11/uploaded-batch/D130_Unknown_Other.pdf',{source:'Provincial Papers',institution:'Western Province',year:'2019',term:'Term 3',medium:'Sinhala',subject:'Catholicism'}],
 ['pdfs/grade6-11/uploaded-batch/D132_2023_Dancing.pdf',{source:'Provincial Papers',institution:'Southern Province',year:'2020',term:'Term 3',subject:'Civic Education'}],
 ['pdfs/grade6-11/uploaded-batch/D135_2023_English_Language.pdf',{source:'Provincial Papers',institution:'Central Province',year:'2019',term:'Term 3',medium:'English',subject:'English Language'}],
 ['pdfs/grade6-11/uploaded-batch/D136_2023_English_Language.pdf',{source:'Education Zone',institution:'Matugama Education Zone',year:'2023',term:'Term 2',medium:'English',subject:'English Language'}],
 ['pdfs/grade6-11/uploaded-batch/D142_2022_Mathematics.pdf',{source:'Provincial Papers',institution:'North Western Province',year:'2022',term:'Term 3',medium:'Sinhala',subject:'Health & Physical Education'}],
 ['pdfs/grade6-11/uploaded-batch/D145_Unknown_Health_Physical_Education.pdf',{source:'Provincial Papers',institution:'North Central Province',year:'2019',term:'Term 2',medium:'Sinhala',subject:'Health & Physical Education'}],
 ['pdfs/grade6-11/uploaded-batch/D147_2019_Dancing.pdf',{source:'Provincial Papers',institution:'Southern Province',year:'2019',term:'Term 3',medium:'Sinhala',subject:'Dancing'}],
 ['pdfs/grade6-11/uploaded-batch/D148_2019_Dancing.pdf',{source:'Provincial Papers',institution:'North Central Province',year:'2019',term:'Term 2',medium:'Sinhala',subject:'Dancing'}],
 ['pdfs/grade6-11/uploaded-batch/D154_2020_Art.pdf',{subject:'Drama & Theatre'}],
 ['pdfs/grade6-11/uploaded-batch/D155_2019_Art.pdf',{subject:'Drama & Theatre'}],
 ['pdfs/grade6-11/uploaded-batch/D157_2020_Dancing.pdf',{source:'Provincial Papers',institution:'Southern Province',year:'2019',term:'Term 2',subject:'Drama & Theatre'}],
 ['pdfs/grade6-11/uploaded-batch/D158_2019_Science.pdf',{subject:'Geography'}],
 ['pdfs/grade6-11/uploaded-batch/D159_2023_Dancing.pdf',{source:'Provincial Papers',institution:'North Central Province',year:'2019',term:'Term 2',medium:'Sinhala',subject:'Geography'}]
]);

// Verified official resources are stored unchanged in the dedicated local folder.
const OFFICIAL_EXTERNAL_PAPERS=[
 {id:'ETH-47728',filename:'Eg06_Mat_TP2_12_NWP_2024.pdf',source:'Provincial Papers',institution:'North Western Province',grade:'Grade 6',year:'2024',term:'Term 2',medium:'English',subject:'Mathematics',url:'https://e-thaksalawa.moe.gov.lk/lcms/mod/resource/view.php?id=47728',externalOfficial:true},
 {id:'ETH-47760',filename:'Eg06_Mat_TP3_12_NWP_2024.pdf',source:'Provincial Papers',institution:'North Western Province',grade:'Grade 6',year:'2024',term:'Term 3',medium:'English',subject:'Mathematics',url:'https://e-thaksalawa.moe.gov.lk/lcms/mod/resource/view.php?id=47760',externalOfficial:true},
 {id:'ETH-48564',filename:'Eg6_Mat_TP2_12_ans_NWP_2025.pdf',source:'Provincial Papers',institution:'North Western Province',grade:'Grade 6',year:'2025',term:'Term 2',medium:'English',subject:'Mathematics',url:'https://e-thaksalawa.moe.gov.lk/lcms/mod/resource/view.php?id=48564',externalOfficial:true},
 {id:'ETH-47729',filename:'Eg06_Sci_TP2_12_NWP_2024.pdf',source:'Provincial Papers',institution:'North Western Province',grade:'Grade 6',year:'2024',term:'Term 2',medium:'English',subject:'Science',url:'https://e-thaksalawa.moe.gov.lk/lcms/mod/resource/view.php?id=47729',externalOfficial:true},
 {id:'ETH-47762',filename:'Eg06_Sci_TP3_12_NWP_2024.pdf',source:'Provincial Papers',institution:'North Western Province',grade:'Grade 6',year:'2024',term:'Term 3',medium:'English',subject:'Science',url:'https://e-thaksalawa.moe.gov.lk/lcms/mod/resource/view.php?id=47762',externalOfficial:true},
 {id:'ETH-48568',filename:'Eg6_Sci_TP2_12_ans_NWP_2025.pdf',source:'Provincial Papers',institution:'North Western Province',grade:'Grade 6',year:'2025',term:'Term 2',medium:'English',subject:'Science',url:'https://e-thaksalawa.moe.gov.lk/lcms/mod/resource/view.php?id=48568',externalOfficial:true},
 {id:'ETH-48561',filename:'Eg6_Hea_TP2_12_ans_NWP_2025.pdf',source:'Provincial Papers',institution:'North Western Province',grade:'Grade 6',year:'2025',term:'Term 2',medium:'English',subject:'Health & Physical Education',url:'https://e-thaksalawa.moe.gov.lk/lcms/mod/resource/view.php?id=48561',externalOfficial:true},
 {id:'ETH-48562',filename:'Eg6_Ict_TP2_12_ans_NWP_2025.pdf',source:'Provincial Papers',institution:'North Western Province',grade:'Grade 6',year:'2025',term:'Term 2',medium:'English',subject:'ICT',url:'https://e-thaksalawa.moe.gov.lk/lcms/mod/resource/view.php?id=48562',externalOfficial:true},
 {id:'ETH-48359',filename:'Sg6_Eng_TP2_12_ans_NWP_2025.pdf',source:'Provincial Papers',institution:'North Western Province',grade:'Grade 6',year:'2025',term:'Term 2',medium:'English',subject:'English Language',url:'https://e-thaksalawa.moe.gov.lk/lcms/mod/resource/view.php?id=48359',externalOfficial:true},
 {id:'ETH-48586',filename:'Eg7_Mat_TP2_12_ans_NWP_2025.pdf',source:'Provincial Papers',institution:'North Western Province',grade:'Grade 7',year:'2025',term:'Term 2',medium:'English',subject:'Mathematics',url:'https://e-thaksalawa.moe.gov.lk/lcms/mod/resource/view.php?id=48586',externalOfficial:true},
 {id:'ETH-48574',filename:'Eg7_Civi_TP2_12_ans_NWP_2025.pdf',source:'Provincial Papers',institution:'North Western Province',grade:'Grade 7',year:'2025',term:'Term 2',medium:'English',subject:'Civic Education',url:'https://e-thaksalawa.moe.gov.lk/lcms/mod/resource/view.php?id=48574',externalOfficial:true},
 {id:'ETH-48638',filename:'Eg07_Sci_TP2_12_ans_NWP_2025.pdf',source:'Provincial Papers',institution:'North Western Province',grade:'Grade 7',year:'2025',term:'Term 2',medium:'English',subject:'Science',url:'https://e-thaksalawa.moe.gov.lk/lcms/mod/resource/view.php?id=48638',externalOfficial:true},
 {id:'ETH-48452',filename:'Sg8_Eng_TP2_12_ans_NWP_2025.pdf',source:'Provincial Papers',institution:'North Western Province',grade:'Grade 8',year:'2025',term:'Term 2',medium:'English',subject:'English Language',url:'https://e-thaksalawa.moe.gov.lk/lcms/mod/resource/view.php?id=48452',externalOfficial:true},
 {id:'ETH-48596',filename:'Eg8_Mat_TP2_12_NWP_2025.pdf',source:'Provincial Papers',institution:'North Western Province',grade:'Grade 8',year:'2025',term:'Term 2',medium:'English',subject:'Mathematics',url:'https://e-thaksalawa.moe.gov.lk/lcms/mod/resource/view.php?id=48596',externalOfficial:true},
 {id:'ETH-48598',filename:'Eg8_Sci_TP2_12_ans_NWP_2025.pdf',source:'Provincial Papers',institution:'North Western Province',grade:'Grade 8',year:'2025',term:'Term 2',medium:'English',subject:'Science',url:'https://e-thaksalawa.moe.gov.lk/lcms/mod/resource/view.php?id=48598',externalOfficial:true},
 {id:'ETH-48600',filename:'Eg8_WMu_TP2_12_ans_NWP_2025.pdf',source:'Provincial Papers',institution:'North Western Province',grade:'Grade 8',year:'2025',term:'Term 2',medium:'English',subject:'Western Music (අපරදිග සංගීතය)',url:'https://e-thaksalawa.moe.gov.lk/lcms/mod/resource/view.php?id=48600',externalOfficial:true},
 {id:'ETH-48497',filename:'Sg9_Eng_TP2_12_ans_NWP_2025.pdf',source:'Provincial Papers',institution:'North Western Province',grade:'Grade 9',year:'2025',term:'Term 2',medium:'English',subject:'English Language',url:'https://e-thaksalawa.moe.gov.lk/lcms/mod/resource/view.php?id=48497',externalOfficial:true},
 {id:'ETH-48636',filename:'Eg09_Sci_TP2_12_ans_NWP_2025.pdf',source:'Provincial Papers',institution:'North Western Province',grade:'Grade 9',year:'2025',term:'Term 2',medium:'English',subject:'Science',url:'https://e-thaksalawa.moe.gov.lk/lcms/mod/resource/view.php?id=48636',externalOfficial:true},
 {id:'ETH-48607',filename:'Eg9_Hea_TP2_12_ans_NWP_2025.pdf',source:'Provincial Papers',institution:'North Western Province',grade:'Grade 9',year:'2025',term:'Term 2',medium:'English',subject:'Health & Physical Education',url:'https://e-thaksalawa.moe.gov.lk/lcms/mod/resource/view.php?id=48607',externalOfficial:true},
 {id:'ETH-48275',filename:'Eg11_ICT_TP2_12_ans_NWP_2025.pdf',source:'Provincial Papers',institution:'North Western Province',grade:'Grade 11',year:'2025',term:'Term 2',medium:'English',subject:'ICT',url:'https://e-thaksalawa.moe.gov.lk/lcms/mod/resource/view.php?id=48275',externalOfficial:true},
 {id:'ETH-48219',filename:'Sg11_ELi_TP2_12_NWP_2025.pdf',source:'Provincial Papers',institution:'North Western Province',grade:'Grade 11',year:'2025',term:'Term 2',medium:'English',subject:'English Literature',url:'https://e-thaksalawa.moe.gov.lk/lcms/mod/resource/view.php?id=48219',externalOfficial:true},
 {id:'ETH-48273',filename:'Eg11_Hea_TP2_12_ans_NWP_2025.pdf',source:'Provincial Papers',institution:'North Western Province',grade:'Grade 11',year:'2025',term:'Term 2',medium:'English',subject:'Health & Physical Education',url:'https://e-thaksalawa.moe.gov.lk/lcms/mod/resource/view.php?id=48273',externalOfficial:true},
 {id:'ETH-48268',filename:'Eg11_Citi_TP2_12_NWP_2025.pdf',source:'Provincial Papers',institution:'North Western Province',grade:'Grade 11',year:'2025',term:'Term 2',medium:'English',subject:'Civic Education',url:'https://e-thaksalawa.moe.gov.lk/lcms/mod/resource/view.php?id=48268',externalOfficial:true}
];

const OFFICIAL_LOCAL_PAPER_FOLDER='pdfs/grade6-11/official-ethaksalawa/';

const OFFICIAL_EXTERNAL_DOWNLOAD_URLS=new Map([
 ['ETH-47728','https://e-thaksalawa.moe.gov.lk/lcms/pluginfile.php/65444/mod_resource/content/2/Eg06_Mat_TP2_12_NWP_2024.pdf?forcedownload=1'],
 ['ETH-47760','https://e-thaksalawa.moe.gov.lk/lcms/pluginfile.php/65597/mod_resource/content/2/Eg06_Mat_TP3_12_NWP_2024.pdf?forcedownload=1'],
 ['ETH-48564','https://e-thaksalawa.moe.gov.lk/lcms/pluginfile.php/66785/mod_resource/content/1/Eg6_Mat_TP2_12_ans_NWP_2025.pdf?forcedownload=1'],
 ['ETH-47729','https://e-thaksalawa.moe.gov.lk/lcms/pluginfile.php/65445/mod_resource/content/2/Eg06_Sci_TP2_12_NWP_2024.pdf?forcedownload=1'],
 ['ETH-47762','https://e-thaksalawa.moe.gov.lk/lcms/pluginfile.php/65599/mod_resource/content/2/Eg06_Sci_TP3_12_NWP_2024.pdf?forcedownload=1'],
 ['ETH-48568','https://e-thaksalawa.moe.gov.lk/lcms/pluginfile.php/66790/mod_resource/content/1/Eg6_Sci_TP2_12_ans_NWP_2025.pdf?forcedownload=1'],
 ['ETH-48561','https://e-thaksalawa.moe.gov.lk/lcms/pluginfile.php/66782/mod_resource/content/1/Eg6_Hea_TP2_12_ans_NWP_2025.pdf?forcedownload=1'],
 ['ETH-48562','https://e-thaksalawa.moe.gov.lk/lcms/pluginfile.php/66783/mod_resource/content/1/Eg6_Ict_TP2_12_ans_NWP_2025.pdf?forcedownload=1'],
 ['ETH-48359','https://e-thaksalawa.moe.gov.lk/lcms/pluginfile.php/66433/mod_resource/content/2/Sg6_Eng_TP2_12_ans_NWP_2025.pdf?forcedownload=1'],
 ['ETH-48586','https://e-thaksalawa.moe.gov.lk/lcms/pluginfile.php/66814/mod_resource/content/2/Eg7_Mat_TP2_12_ans_NWP_2025.pdf?forcedownload=1'],
 ['ETH-48574','https://e-thaksalawa.moe.gov.lk/lcms/pluginfile.php/66798/mod_resource/content/2/Eg7_Civi_TP2_12_ans_NWP_2025.pdf?forcedownload=1'],
 ['ETH-48638','https://e-thaksalawa.moe.gov.lk/lcms/pluginfile.php/66870/mod_resource/content/1/Eg07_Sci_TP2_12_ans_NWP_2025.pdf?forcedownload=1'],
 ['ETH-48452','https://e-thaksalawa.moe.gov.lk/lcms/pluginfile.php/66658/mod_resource/content/2/Sg8_Eng_TP2_12_ans_NWP_2025.pdf?forcedownload=1'],
 ['ETH-48596','https://e-thaksalawa.moe.gov.lk/lcms/pluginfile.php/66824/mod_resource/content/1/Eg8_Mat_TP2_12_NWP_2025.pdf?forcedownload=1'],
 ['ETH-48598','https://e-thaksalawa.moe.gov.lk/lcms/pluginfile.php/66826/mod_resource/content/1/Eg8_Sci_TP2_12_ans_NWP_2025.pdf?forcedownload=1'],
 ['ETH-48600','https://e-thaksalawa.moe.gov.lk/lcms/pluginfile.php/66828/mod_resource/content/1/Eg8_WMu_TP2_12_ans_NWP_2025.pdf?forcedownload=1'],
 ['ETH-48497','https://e-thaksalawa.moe.gov.lk/lcms/pluginfile.php/66704/mod_resource/content/1/Sg9_Eng_TP2_12_ans_NWP_2025.pdf?forcedownload=1'],
 ['ETH-48636','https://e-thaksalawa.moe.gov.lk/lcms/pluginfile.php/66868/mod_resource/content/1/Eg09_Sci_TP2_12_ans_NWP_2025.pdf?forcedownload=1'],
 ['ETH-48607','https://e-thaksalawa.moe.gov.lk/lcms/pluginfile.php/66835/mod_resource/content/1/Eg9_Hea_TP2_12_ans_NWP_2025.pdf?forcedownload=1'],
 ['ETH-48275','https://e-thaksalawa.moe.gov.lk/lcms/pluginfile.php/66336/mod_resource/content/1/Eg11_ICT_TP2_12_ans_NWP_2025.pdf?forcedownload=1'],
 ['ETH-48219','https://e-thaksalawa.moe.gov.lk/lcms/pluginfile.php/66277/mod_resource/content/1/Sg11_ELi_TP2_12_NWP_2025.pdf?forcedownload=1'],
 ['ETH-48273','https://e-thaksalawa.moe.gov.lk/lcms/pluginfile.php/66333/mod_resource/content/1/Eg11_Hea_TP2_12_ans_NWP_2025.pdf?forcedownload=1'],
 ['ETH-48268','https://e-thaksalawa.moe.gov.lk/lcms/pluginfile.php/66328/mod_resource/content/1/Eg11_Citi_TP2_12_NWP_2025.pdf?forcedownload=1']
]);

function uploadedPaperForDisplay(paper){
 const correction=VERIFIED_UPLOADED_DISPLAY_CORRECTIONS.get(paper.url);
 return correction?{...paper,...correction}:paper;
}

function confirmedUploadedPapers(criteria){
 const source=window.UPLOADED_PAPERS||[];
 const seen=new Set();
 const officialLocalPapers=OFFICIAL_EXTERNAL_PAPERS.map(p=>({
   ...p,
   url:`${OFFICIAL_LOCAL_PAPER_FOLDER}${p.filename}`,
   externalOfficial:false,
   localOfficial:true
 }));
 return [...source.map(uploadedPaperForDisplay),...officialLocalPapers].filter(p=>{
   const unclear=/unknown|needs review/i.test(p.institution)||p.year==='Unknown'||p.term==='Unknown'||p.subject==='Other';
   if(unclear||(!p.externalOfficial&&UNAVAILABLE_UPLOADED_FILES.has(p.url))||seen.has(p.url)) return false;
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
 list.innerHTML=records.map((p,index)=>p.externalOfficial
   ? `<div class="confirmed-paper-item official-external-paper"><span class="confirmed-paper-name">Paper ${index+1} · ${p.filename}<br><span class="official-source-label">Official e-Thaksalawa source</span></span><a class="btn btn-primary" rel="noopener noreferrer" href="${OFFICIAL_EXTERNAL_DOWNLOAD_URLS.get(p.id)}">Download official PDF</a></div>`
   : p.localOfficial
   ? `<div class="confirmed-paper-item official-external-paper"><span class="confirmed-paper-name">Paper ${index+1} · ${p.filename}<br><span class="official-source-label">Official e-Thaksalawa source</span></span><a class="btn btn-primary" target="_blank" rel="noopener" href="${p.url}">Open</a><a class="btn btn-green" download href="${p.url}">Download</a></div>`
   : `<div class="confirmed-paper-item"><span class="confirmed-paper-name">Paper ${index+1} · Document ${p.id}</span><a class="btn btn-primary" target="_blank" rel="noopener" href="${p.url}">Open</a><a class="btn btn-green" download href="${p.url}">Download</a></div>`).join('');
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
