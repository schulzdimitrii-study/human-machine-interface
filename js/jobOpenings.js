let jobs = [];
let searchQuery = '';

function getBookmarks() {
  const stored = localStorage.getItem('job_bookmarks');
  return stored ? JSON.parse(stored) : {};
}

function setBookmark(jobId, isBookmarked) {
  const bookmarks = getBookmarks();
  bookmarks[jobId] = isBookmarked;
  localStorage.setItem('job_bookmarks', JSON.stringify(bookmarks));
}

async function loadJobs() {
  try {
    const response = await fetch('../jobs.json');
    jobs = await response.json();

    const bookmarks = getBookmarks();
    jobs.forEach(job => {
      if (bookmarks[job.id] !== undefined) {
        job.isBookmarked = bookmarks[job.id];
      } else {
        bookmarks[job.id] = !!job.isBookmarked;
      }
    });
    localStorage.setItem('job_bookmarks', JSON.stringify(bookmarks));
    renderJobs();
  } catch (error) {
    console.error('Error loading jobs:', error);
    const grid = document.getElementById('job-listings-grid');
    if (grid) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #ba1a1a; padding: 20px; font-family: sans-serif;">
        Erro ao carregar vagas: ${error.message}. <br>
        Certifique-se de acessar via <strong>http://localhost:8000/pages/jobOpenings.html</strong> e não abrindo o arquivo diretamente.
      </div>`;
    }
  }
}


function normalizeText(str) {
  if (!str) return '';
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function renderJobs() {
  const grid = document.getElementById('job-listings-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const filteredJobs = jobs.filter(job => {
    if (!searchQuery) return true;
    const q = normalizeText(searchQuery);
    const titleMatch = normalizeText(job.title).includes(q);
    const companyMatch = normalizeText(job.company).includes(q);
    const locationMatch = normalizeText(job.location).includes(q);
    const descriptionMatch = normalizeText(job.description).includes(q);
    const requirementsMatch = job.requirements.some(req => normalizeText(req).includes(q));
    const compensationMatch = job.compensation && normalizeText(job.compensation).includes(q);
    return titleMatch || companyMatch || locationMatch || descriptionMatch || requirementsMatch || compensationMatch;
  });

  if (filteredJobs.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px 24px; color: var(--text-color); opacity: 0.7; font-family: 'Nunito Sans', sans-serif;">
        <span class="material-symbols-outlined" style="font-size: 48px; margin-bottom: 16px; color: var(--click-color);">search_off</span>
        <h3 style="margin: 0 0 8px 0; font-family: 'Hanken Grotesk', sans-serif; font-size: 20px; font-weight: 700;">Nenhuma vaga encontrada</h3>
        <p style="margin: 0;">Tente buscar por outras palavras-chave ou limpe a busca.</p>
      </div>
    `;
    return;
  }

  filteredJobs.forEach(job => {
    const card = document.createElement('article');
    card.className = 'job-card';

    const highlightBar = '<div class="job-highlight-bar"></div>';

    const bookmarkIcon = job.isBookmarked
      ? '<span class="material-symbols-outlined bookmark-icon-active">bookmark</span>'
      : '<span class="material-symbols-outlined bookmark-icon-inactive">bookmark_border</span>';

    let badgeClass = '';
    if (job.badgeType === 'new') {
      badgeClass = 'badge-new';
    } else if (job.badgeType === 'urgent') {
      badgeClass = 'badge-urgent';
    } else if (job.badgeType === 'applied') {
      badgeClass = 'badge-applied';
    }
    const badgeHtml = job.badge
      ? `<span class="job-badge ${badgeClass}">${job.badge}</span>`
      : '';

    let buttonHtml = '';
    if (job.actionType === 'active') {
      buttonHtml = `
        <button onclick="window.location.href='jobDetails.html?id=${job.id}'" class="btn-view-job">
          Ver Vaga <span class="material-symbols-outlined">arrow_forward</span>
        </button>
      `;
    } else {
      buttonHtml = `
        <button class="btn-details-disabled">
          Detalhes
        </button>
      `;
    }

    card.innerHTML = `
      ${highlightBar}
      <div class="job-card-header">
        <div>
          <h3 class="job-title">${job.title}</h3>
          <p class="job-company">${job.company}</p>
        </div>
        <button class="bookmark-btn" onclick="toggleBookmark(${job.id})">
          ${bookmarkIcon}
        </button>
      </div>
      <div class="job-details-list">
        <div class="job-details-item">
          <span class="material-symbols-outlined">location_on</span>
          <span>${job.location}</span>
        </div>
        <div class="job-details-item">
          <span class="material-symbols-outlined">${job.compensation.includes('R$') ? 'payments' : 'schedule'}</span>
          <span>${job.compensation}</span>
        </div>
      </div>
      <div class="job-card-footer">
        <div class="job-badges-wrapper">
          ${badgeHtml}
        </div>
        ${buttonHtml}
      </div>
    `;

    grid.appendChild(card);
  });
}

function performSearch() {
  const input = document.querySelector('.search-input');
  if (input) {
    searchQuery = input.value.trim();
    renderJobs();
  }
}

function toggleBookmark(jobId) {
  const job = jobs.find(j => j.id === jobId);
  if (job) {
    job.isBookmarked = !job.isBookmarked;
    setBookmark(jobId, job.isBookmarked);
    renderJobs();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadJobs();

  const searchBtn = document.querySelector('.search-button');
  const searchInput = document.querySelector('.search-input');

  if (searchBtn) {
    searchBtn.addEventListener('click', performSearch);
  }

  if (searchInput) {
    searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        performSearch();
      }
    });
  }
});
