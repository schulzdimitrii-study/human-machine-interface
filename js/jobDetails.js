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

function applyForJob() {
  if (!currentJob || currentJob.actionType === 'disabled') return;
  alert('Candidatura enviada com sucesso para ' + currentJob.title + '!');
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

document.addEventListener('DOMContentLoaded', loadJobDetails);
