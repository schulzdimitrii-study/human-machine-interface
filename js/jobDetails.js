let currentJob = null;

function getBookmarks() {
  const stored = localStorage.getItem('job_bookmarks');
  return stored ? JSON.parse(stored) : {};
}

function setBookmark(jobId, isBookmarked) {
  const bookmarks = getBookmarks();
  bookmarks[jobId] = isBookmarked;
  localStorage.setItem('job_bookmarks', JSON.stringify(bookmarks));
}

async function loadJobDetails() {
  const params = new URLSearchParams(window.location.search);
  const jobId = parseInt(params.get('id'), 10);
  if (isNaN(jobId)) {
    showError();
    return;
  }

  try {
    const response = await fetch('../jobs.json');
    const jobs = await response.json();
    currentJob = jobs.find(j => j.id === jobId);

    if (!currentJob) {
      showError();
      return;
    }

    const bookmarks = getBookmarks();
    if (bookmarks[currentJob.id] !== undefined) {
      currentJob.isBookmarked = bookmarks[currentJob.id];
    } else {
      currentJob.isBookmarked = !!currentJob.isBookmarked;
    }

    const appliedJobs = JSON.parse(localStorage.getItem('applied_jobs') || '{}');
    if (appliedJobs[currentJob.id]) {
      currentJob.badge = 'Candidatado';
      currentJob.badgeType = 'applied';
      currentJob.actionType = 'disabled';
      currentJob.status = 'Candidatura Enviada';
      currentJob.status_percent = 100;
    }

    renderDetails(currentJob);
    updateBookmarkUI(currentJob.isBookmarked);
  } catch (error) {
    console.error('Error loading job details:', error);
    showError('Erro ao carregar detalhes: ' + error.message);
  }
}

function renderDetails(job) {
  const headerTitle = document.querySelector('.header-job-title');
  if (headerTitle) {
    headerTitle.textContent = job.title;
  }

  document.getElementById('job-title').textContent = job.title;
  document.getElementById('job-company').textContent = job.company;
  document.getElementById('job-location').textContent = job.location_full || job.location;
  document.getElementById('job-hours').textContent = job.hours;
  document.getElementById('job-salary').textContent = job.salary;
  document.getElementById('job-description').textContent = job.description;
  document.getElementById('about-company').textContent = job.about_company;

  const badgeContainer = document.getElementById('job-badge-container');
  if (badgeContainer && job.badge) {
    let badgeClass = '';
    if (job.badgeType === 'new') {
      badgeClass = 'badge-new';
    } else if (job.badgeType === 'urgent') {
      badgeClass = 'badge-urgent';
    } else if (job.badgeType === 'applied') {
      badgeClass = 'badge-applied';
    }
    badgeContainer.innerHTML = `<span class="job-badge ${badgeClass}">${job.badge}</span>`;
  }

  const reqList = document.getElementById('job-requirements');
  reqList.innerHTML = '';
  job.requirements.forEach(req => {
    const li = document.createElement('li');
    li.className = 'detail-item';
    li.innerHTML = `
      <span class="material-symbols-outlined detail-icon-bullet">check_circle</span>
      <span class="detail-item-text">${req}</span>
    `;
    reqList.appendChild(li);
  });

  const benList = document.getElementById('job-benefits');
  benList.innerHTML = '';
  job.benefits.forEach(ben => {
    const li = document.createElement('li');
    li.className = 'detail-item';
    li.innerHTML = `
      <span class="material-symbols-outlined detail-icon-bullet">redeem</span>
      <span class="detail-item-text">${ben}</span>
    `;
    benList.appendChild(li);
  });

  const statusPercent = job.status_percent || 0;
  const statusText = document.getElementById('status-text');
  if (statusText) statusText.textContent = `Status do Processo: ${job.status || 'Aberta'}`;

  const statusProgress = document.getElementById('status-progress');
  if (statusProgress) {
    statusProgress.style.width = `${statusPercent}%`;
  }

  const applyButtons = document.querySelectorAll('.apply-job-btn');
  applyButtons.forEach(btn => {
    if (job.actionType === 'disabled') {
      btn.disabled = true;
      btn.classList.add('btn-disabled');
      btn.textContent = 'Processo Seletivo Encerrado';
    } else {
      btn.addEventListener('click', applyForJob);
    }
  });

  const mapOverlayText = document.querySelector('.map-overlay span');
  if (mapOverlayText) {
    mapOverlayText.textContent = job.location_full || job.location;
  }
}

function updateBookmarkUI(isBookmarked) {
  const headerSaveIcon = document.querySelector('.header-save-icon');
  if (headerSaveIcon) {
    headerSaveIcon.textContent = isBookmarked ? 'bookmark' : 'bookmark_border';
    headerSaveIcon.style.fontVariationSettings = isBookmarked ? "'FILL' 1" : "'FILL' 0";

    const headerSaveBtnText = headerSaveIcon.nextSibling;
    if (headerSaveBtnText) {
      headerSaveBtnText.textContent = isBookmarked ? ' Salva' : ' Salvar Vaga';
    }
  }

  const mobileSaveIcon = document.getElementById('mobile-save-icon');
  const mobileSaveText = document.getElementById('mobile-save-text');
  if (mobileSaveIcon) {
    mobileSaveIcon.textContent = isBookmarked ? 'bookmark' : 'bookmark_border';
    mobileSaveIcon.style.fontVariationSettings = isBookmarked ? "'FILL' 1" : "'FILL' 0";
  }
  if (mobileSaveText) {
    mobileSaveText.textContent = isBookmarked ? 'Salva' : 'Salvar';
  }
}

function toggleJobBookmark() {
  if (!currentJob) return;
  currentJob.isBookmarked = !currentJob.isBookmarked;
  setBookmark(currentJob.id, currentJob.isBookmarked);
  updateBookmarkUI(currentJob.isBookmarked);
}

let selectedFile = null;

function getAlunoProfile() {
  let data = null;
  try {
    data = JSON.parse(localStorage.getItem('aluno_profile'));
  } catch (e) {
    data = null;
  }
  if (!data || !data.nome) {
    const defaultProfile = {
      idAluno: 101,
      nome: 'Lucas Andrade',
      matricula: '1542',
      curso: 'Engenharia de Software',
      periodo: 5,
      curriculoSalvoPath: 'curriculo_lucas.pdf',
      habilidades: ['HTML', 'CSS', 'JavaScript', 'Python']
    };
    localStorage.setItem('aluno_profile', JSON.stringify(defaultProfile));
    data = defaultProfile;
  }
  return new window.AlunoCandidato(
    data.idAluno || 101,
    data.nome || 'Lucas Andrade',
    data.matricula || '1542',
    data.curso || 'Engenharia de Software',
    data.periodo || 5,
    data.curriculoSalvoPath || 'curriculo_lucas.pdf',
    data.habilidades || []
  );
}

function saveAlunoProfile(aluno) {
  localStorage.setItem('aluno_profile', JSON.stringify(aluno.visualizarPerfil()));
}

function openApplyModal() {
  if (!currentJob || currentJob.actionType === 'disabled') return;

  const modal = document.getElementById('apply-modal');
  if (modal) {
    modal.classList.add('open');
  }

  const aluno = getAlunoProfile();
  document.getElementById('apply-nome').textContent = aluno.nome;
  document.getElementById('apply-curso').textContent = aluno.curso;
  document.getElementById('apply-matricula').textContent = aluno.matricula;
  document.getElementById('apply-periodo').textContent = aluno.periodo;

  document.getElementById('apply-skills-input').value = (aluno.habilidades || []).join(', ');

  const savedCvDesc = document.getElementById('apply-saved-cv-name');
  if (savedCvDesc) {
    savedCvDesc.textContent = aluno.curriculoSalvoPath
      ? aluno.curriculoSalvoPath.replace('uploads/', '')
      : 'Nenhum currículo cadastrado';
  }

  selectedFile = null;
  const fileInput = document.getElementById('apply-upload-file');
  if (fileInput) fileInput.value = '';
  const chosenFileName = document.getElementById('chosen-file-name');
  if (chosenFileName) {
    chosenFileName.textContent = '';
    chosenFileName.style.display = 'none';
  }

  if (aluno.curriculoSalvoPath) {
    document.getElementById('cv-radio-saved').checked = true;
  } else {
    document.getElementById('cv-radio-builder').checked = true;
  }

  goToStep(1);
}

window.closeApplyModal = function () {
  const modal = document.getElementById('apply-modal');
  if (modal) {
    modal.classList.remove('open');
  }
};

window.closeApplyModalAndRefresh = function () {
  closeApplyModal();

  if (currentJob) {
    currentJob.badge = 'Candidatado';
    currentJob.badgeType = 'applied';
    currentJob.actionType = 'disabled';
    currentJob.status = 'Candidatura Enviada';
    currentJob.status_percent = 100;

    const appliedJobs = JSON.parse(localStorage.getItem('applied_jobs') || '{}');
    appliedJobs[currentJob.id] = true;
    localStorage.setItem('applied_jobs', JSON.stringify(appliedJobs));

    renderDetails(currentJob);
  }
};

window.goToStep = function (stepNumber) {
  if (stepNumber === 2) {
    const aluno = getAlunoProfile();
    const skillsInput = document.getElementById('apply-skills-input').value;
    aluno.habilidades = skillsInput
      ? skillsInput.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : [];
    saveAlunoProfile(aluno);

    window.dispatchEvent(new CustomEvent('profile-updated'));
  }

  for (let i = 1; i <= 3; i++) {
    const ind = document.getElementById(`step-ind-${i}`);
    const line = document.getElementById(`step-line-${i}`);

    if (ind) {
      if (i < stepNumber) {
        ind.className = 'step-indicator completed';
        ind.innerHTML = '<span class="material-symbols-outlined" style="font-size:16px; color:#ffffff;">check</span>';
      } else if (i === stepNumber) {
        ind.className = 'step-indicator active';
        ind.textContent = i;
      } else {
        ind.className = 'step-indicator';
        ind.textContent = i;
      }
    }

    if (line) {
      if (i < stepNumber) {
        line.className = 'step-line completed';
      } else {
        line.className = 'step-line';
      }
    }
  }

  document.querySelectorAll('.apply-step').forEach(stepDiv => {
    stepDiv.classList.remove('active');
  });

  const activeStep = document.getElementById(`apply-step-${stepNumber}`);
  if (activeStep) {
    activeStep.classList.add('active');
  }
};

window.handleApplyCVUpload = function (event) {
  const file = event.target.files[0];
  if (file) {
    selectedFile = file;
    const label = document.getElementById('chosen-file-name');
    if (label) {
      label.textContent = `Selecionado: ${file.name}`;
      label.style.display = 'block';
    }
    document.getElementById('cv-radio-upload').checked = true;
  }
};

window.toggleCVChoice = function () {
  const uploadRadio = document.getElementById('cv-radio-upload');
  if (uploadRadio && uploadRadio.checked && !selectedFile) {
    document.getElementById('apply-upload-file').click();
  }
};

window.submitCandidacyFlow = function () {
  const aluno = getAlunoProfile();
  const cvSource = document.querySelector('input[name="cv-source"]:checked').value;

  let cvFile = null;
  if (cvSource === 'saved') {
    if (!aluno.curriculoSalvoPath) {
      alert('Nenhum currículo cadastrado encontrado. Por favor, faça upload ou use o gerador automático.');
      return;
    }
    cvFile = aluno.curriculoSalvoPath;
  } else if (cvSource === 'upload') {
    if (!selectedFile) {
      alert('Por favor, selecione um arquivo de currículo PDF.');
      return;
    }
    cvFile = selectedFile.name;
    aluno.curriculoSalvoPath = `uploads/${selectedFile.name}`;
    saveAlunoProfile(aluno);
    window.dispatchEvent(new CustomEvent('profile-updated'));
  } else if (cvSource === 'builder') {
    cvFile = 'auto_generated_cv.pdf';
  }

  try {
    const mgr = new window.GerenciadorCandidaturas();
    const candidacy = mgr.enviarCandidatura(aluno, currentJob, cvFile);

    document.getElementById('apply-protocol-num').textContent = `#${candidacy.idCandidatura}`;

    goToStep(3);
  } catch (error) {
    console.error(error);
    alert('Erro ao enviar candidatura: ' + error.message);
  }
};

function applyForJob() {
  openApplyModal();
}

function showError(msg) {
  const container = document.getElementById('details-container');
  if (container) {
    container.innerHTML = `
      <div class="bento-card error-card" style="grid-column: 1/-1;">
        <span class="material-symbols-outlined error-icon">error</span>
        <h3 class="error-title">Vaga não encontrada ou erro de carregamento</h3>
        <p class="error-text">${msg || 'A vaga solicitada não existe ou foi removida.'}<br>Certifique-se de acessar via servidor local (http://localhost:8000/) se houver erro de carregamento.</p>
        <a href="jobOpenings.html" class="btn-error-back">
          <span class="material-symbols-outlined">arrow_back</span> Voltar para Vagas
        </a>
      </div>
    `;
  }
}

window.addEventListener('save-job', toggleJobBookmark);
window.addEventListener('apply-job', applyForJob);

window.addEventListener('profile-updated', () => {
  if (currentJob) {
    const aluno = getAlunoProfile();
    const applyNome = document.getElementById('apply-nome');
    if (applyNome) {
      applyNome.textContent = aluno.nome;
      document.getElementById('apply-curso').textContent = aluno.curso;
      document.getElementById('apply-matricula').textContent = aluno.matricula;
      document.getElementById('apply-periodo').textContent = aluno.periodo;
    }
  }
});

document.addEventListener('DOMContentLoaded', loadJobDetails);
