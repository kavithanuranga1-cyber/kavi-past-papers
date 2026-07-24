(function(){
  const category = document.body.dataset.category;
  const supported = ['grade1-5','grade6-11','grade12-13'];
  if(!supported.includes(category)) return;

  const filters = document.querySelector('.filters');
  if(!filters) return;

  const sourceWrap = document.createElement('div');
  sourceWrap.id = 'sourceWrap';
  sourceWrap.className = 'filter-group';
  sourceWrap.innerHTML = `
    <label>Category</label>
    <select id="sourceSelect">
      <option value="provincial">Provincial Papers</option>
      <option value="college">College Papers</option>
    </select>`;
  filters.prepend(sourceWrap);

  const collegeWrap = document.createElement('div');
  collegeWrap.id = 'collegeWrap';
  collegeWrap.className = 'filter-group';
  collegeWrap.hidden = true;
  collegeWrap.innerHTML = `
    <label>College</label>
    <select id="collegeSelect">
      <option>Royal College – Colombo 07</option>
    </select>`;

  let provinceWrap = document.getElementById('provinceWrap');

  // Grade 1–5 page did not have a province selector in the original layout.
  // Create it here so Provincial Papers always shows all 9 provinces.
  if(!provinceWrap){
    provinceWrap = document.createElement('div');
    provinceWrap.id = 'provinceWrap';
    provinceWrap.className = 'filter-group';
    provinceWrap.innerHTML = `
      <label>Province</label>
      <select id="provinceSelect">
        <option value="Western Province">Western Province</option>
        <option value="Central Province">Central Province</option>
        <option value="Southern Province">Southern Province</option>
        <option value="Northern Province">Northern Province</option>
        <option value="Eastern Province">Eastern Province</option>
        <option value="North Western Province">North Western Province</option>
        <option value="North Central Province">North Central Province</option>
        <option value="Uva Province">Uva Province</option>
        <option value="Sabaragamuwa Province">Sabaragamuwa Province</option>
      </select>`;
    sourceWrap.insertAdjacentElement('afterend', provinceWrap);
  }

  provinceWrap.insertAdjacentElement('afterend', collegeWrap);

  const sourceSelect = document.getElementById('sourceSelect');
  const collegeSelect = document.getElementById('collegeSelect');
  const baseUpdateResult = window.updateResult;

  function setResource(openEl, downloadEl, url){
    if(!openEl || !downloadEl) return;
    if(url){
      openEl.href = url;
      downloadEl.href = url;
      downloadEl.setAttribute('download','');
      openEl.classList.remove('btn-disabled');
      downloadEl.classList.remove('btn-disabled');
    }else{
      openEl.removeAttribute('href');
      downloadEl.removeAttribute('href');
      downloadEl.removeAttribute('download');
      openEl.classList.add('btn-disabled');
      downloadEl.classList.add('btn-disabled');
    }
  }

  function toggleSource(){
    const isCollege = sourceSelect.value === 'college';
    collegeWrap.hidden = !isCollege;
    if(provinceWrap) provinceWrap.hidden = isCollege;
    window.updateResult();
  }

  window.updateResult = function(){
    if(sourceSelect.value !== 'college'){
      if(typeof baseUpdateResult === 'function') baseUpdateResult();
      return;
    }

    if(typeof window.ensureResultPanels === 'function') window.ensureResultPanels();

    const values = [collegeSelect.value];
    const grade = document.getElementById('gradeSelect');
    const year = document.getElementById('yearSelect');
    const term = document.getElementById('termSelect');
    const medium = document.getElementById('mediumSelect');

    [grade, year, term, medium].forEach(select => {
      if(select && !select.closest('.filter-group').hidden) values.push(select.value);
    });

    const subject = document.querySelector('#subjectGrid .active')?.dataset.subject || 'Subject';
    values.push(subject);

    const title = document.getElementById('resultTitle');
    if(title) title.textContent = ['College Papers', ...values].join(' – ');

    const lookup = ['college', category, ...values].join('|');
    const paperUrl = window.PAPER_LINKS?.[lookup];
    const markingUrl = window.MARKING_LINKS?.[lookup];

    setResource(document.getElementById('openPdf'), document.getElementById('downloadPdf'), paperUrl);
    setResource(document.getElementById('openMarking'), document.getElementById('downloadMarking'), markingUrl);

    const questionStatus = document.getElementById('questionStatus');
    const markingStatus = document.getElementById('markingStatus');
    if(questionStatus) questionStatus.textContent = paperUrl ? 'Question Paper එක සූදානම්.' : 'Question Paper – Coming Soon';
    if(markingStatus) markingStatus.textContent = markingUrl ? 'Marking Scheme එක සූදානම්.' : 'Marking Scheme – Coming Soon';
  };

  sourceSelect.addEventListener('change', toggleSource);
  collegeSelect.addEventListener('change', window.updateResult);
  document.getElementById('provinceSelect')?.addEventListener('change', window.updateResult);

  // Set the correct initial visibility when the page opens.
  toggleSource();
})();
