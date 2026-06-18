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
    showError();
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
      badgeClass = 'bg-surface-container text-on-surface-variant';
    } else if (job.badgeType === 'urgent') {
      badgeClass = 'border border-outline text-outline';
    } else if (job.badgeType === 'applied') {
      badgeClass = 'bg-deep-navy text-pure-white';
    }
    badgeContainer.innerHTML = `<span class="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${badgeClass}">${job.badge}</span>`;
  }

  const reqList = document.getElementById('job-requirements');
  reqList.innerHTML = '';
  job.requirements.forEach(req => {
    const li = document.createElement('li');
    li.className = 'detail-item';
    li.innerHTML = `
      <span class="material-symbols-outlined detail-icon-bullet">check_circle</span>
      <span class="text-body-md text-on-surface-variant">${req}</span>
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
      <span class="text-body-md text-on-surface-variant">${ben}</span>
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
      btn.classList.add('opacity-50', 'cursor-not-allowed');
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

function showError() {
  const container = document.getElementById('details-container');
  if (container) {
    container.innerHTML = `
      <div class="bento-card text-center py-12">
        <span class="material-symbols-outlined text-error text-[48px] mb-4">error</span>
        <h3 class="text-headline-md text-on-surface mb-2">Vaga não encontrada</h3>
        <p class="text-body-md text-on-surface-variant mb-6">A vaga solicitada não existe ou foi removida.</p>
        <a href="jobOpenings.html" class="inline-flex items-center gap-2 px-6 py-3 bg-inatel-blue text-pure-white rounded-lg font-label-lg hover:bg-primary transition-colors">
          <span class="material-symbols-outlined">arrow_back</span> Voltar para Vagas
        </a>
      </div>
    `;
  }
}

window.addEventListener('save-job', toggleJobBookmark);
window.addEventListener('apply-job', applyForJob);

document.addEventListener('DOMContentLoaded', loadJobDetails);
