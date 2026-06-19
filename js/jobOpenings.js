let jobs = [];

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


function renderJobs() {
  const grid = document.getElementById('job-listings-grid');
  if (!grid) return;
  grid.innerHTML = '';

  jobs.forEach(job => {
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

function toggleBookmark(jobId) {
  const job = jobs.find(j => j.id === jobId);
  if (job) {
    job.isBookmarked = !job.isBookmarked;
    setBookmark(jobId, job.isBookmarked);
    renderJobs();
  }
}

document.addEventListener('DOMContentLoaded', loadJobs);
