tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      "colors": {
        "surface": "#f7f9fe",
        "on-tertiary": "#ffffff",
        "surface-container-lowest": "#ffffff",
        "surface-variant": "#e0e2e7",
        "surface-bright": "#f7f9fe",
        "surface-tint": "#1e60a3",
        "tertiary-fixed-dim": "#8bd5bf",
        "surface-dim": "#d8dadf",
        "on-primary-fixed-variant": "#004883",
        "deep-navy": "#00234B",
        "on-tertiary-container": "#88d2bc",
        "on-secondary-fixed": "#001b3d",
        "surface-container-high": "#e6e8ed",
        "success-teal": "#277462",
        "on-secondary": "#ffffff",
        "on-error": "#ffffff",
        "secondary": "#455f8a",
        "primary": "#126ae2",
        "outline": "#727782",
        "on-secondary-fixed-variant": "#2c4771",
        "on-surface-variant": "#424750",
        "background": "#edf2f4",
        "secondary-fixed-dim": "#adc7f8",
        "secondary-container": "#b2cdfe",
        "error-container": "#ffdad6",
        "pure-white": "#ffffff",
        "surface-container-highest": "#e0e2e7",
        "tertiary-container": "#005c4b",
        "on-secondary-container": "#3c5781",
        "inatel-blue": "#126ae2",
        "inverse-surface": "#2d3135",
        "on-primary": "#ffffff",
        "tertiary": "#004236",
        "inverse-primary": "#a3c9ff",
        "on-surface": "#181c20",
        "on-primary-fixed": "#001c39",
        "on-tertiary-fixed": "#002019",
        "primary-fixed-dim": "#a3c9ff",
        "surface-container": "#eceef3",
        "on-error-container": "#93000a",
        "on-primary-container": "#9ec6ff",
        "primary-fixed": "#d3e3ff",
        "error": "#ba1a1a",
        "on-background": "#181c20",
        "primary-container": "#126ae2",
        "surface-container-low": "#f2f4f9",
        "inverse-on-surface": "#eff1f6",
        "tertiary-fixed": "#a6f1db",
        "on-tertiary-fixed-variant": "#005142",
        "outline-variant": "#c2c6d2",
        "secondary-fixed": "#d6e3ff",
        "background-alt": "#edf2f4"
      },
      "borderRadius": {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      "spacing": {
        "container-max-width": "1200px",
        "margin-desktop": "32px",
        "gutter": "24px",
        "stack-lg": "24px",
        "stack-sm": "4px",
        "base": "8px",
        "stack-md": "12px",
        "margin-mobile": "16px"
      },
      "fontFamily": {
        "label-lg": ["Hanken Grotesk"],
        "headline-sm": ["Hanken Grotesk"],
        "body-sm": ["Nunito Sans"],
        "headline-md": ["Hanken Grotesk"],
        "headline-lg": ["Hanken Grotesk"],
        "label-md": ["Hanken Grotesk"],
        "body-lg": ["Nunito Sans"],
        "body-md": ["Nunito Sans"],
        "display-lg-mobile": ["Hanken Grotesk"],
        "display-lg": ["Hanken Grotesk"]
      },
      "fontSize": {
        "label-lg": ["14px", { "lineHeight": "20px", "letterSpacing": "0.05em", "fontWeight": "600" }],
        "headline-sm": ["20px", { "lineHeight": "28px", "fontWeight": "600" }],
        "body-sm": ["14px", { "lineHeight": "20px", "fontWeight": "400" }],
        "headline-md": ["24px", { "lineHeight": "32px", "fontWeight": "600" }],
        "headline-lg": ["32px", { "lineHeight": "40px", "fontWeight": "600" }],
        "label-md": ["12px", { "lineHeight": "16px", "fontWeight": "500" }],
        "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "400" }],
        "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
        "display-lg-mobile": ["32px", { "lineHeight": "40px", "fontWeight": "700" }],
        "display-lg": ["48px", { "lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700" }]
      }
    },
  },
};

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
  }
}


function renderJobs() {
  const grid = document.getElementById('job-listings-grid');
  if (!grid) return;
  grid.innerHTML = '';

  jobs.forEach(job => {
    const card = document.createElement('article');
    card.className = 'bg-pure-white border border-surface-variant rounded-xl p-6 flex flex-col gap-stack-md ambient-shadow-sm hover:ambient-shadow-md transition-shadow relative overflow-hidden group';

    const highlightBar = job.highlight
      ? '<div class="absolute top-0 left-0 w-1 h-full bg-primary"></div>'
      : '';

    const bookmarkIcon = job.isBookmarked
      ? '<span class="material-symbols-outlined text-primary" style="font-variation-settings: \'FILL\' 1;">bookmark</span>'
      : '<span class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">bookmark_border</span>';

    let badgeClass = '';
    if (job.badgeType === 'new') {
      badgeClass = 'bg-surface-container text-on-surface-variant';
    } else if (job.badgeType === 'urgent') {
      badgeClass = 'border border-outline text-outline';
    } else if (job.badgeType === 'applied') {
      badgeClass = 'bg-deep-navy text-pure-white';
    }
    const badgeHtml = job.badge
      ? `<span class="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${badgeClass}">${job.badge}</span>`
      : '';

    let buttonHtml = '';
    if (job.actionType === 'active') {
      buttonHtml = `
        <button onclick="window.location.href='jobDetails.html?id=${job.id}'" class="px-4 py-2 border border-inatel-blue text-inatel-blue bg-pure-white hover:bg-surface-container-low rounded font-label-md text-label-md transition-colors flex items-center gap-1">
          Ver Vaga <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      `;
    } else {
      buttonHtml = `
        <button class="px-4 py-2 bg-surface-container text-on-surface-variant rounded font-label-md text-label-md transition-colors flex items-center gap-1 opacity-70 cursor-not-allowed">
          Detalhes
        </button>
      `;
    }

    card.innerHTML = `
      ${highlightBar}
      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-headline-sm font-headline-sm text-on-surface mb-1 pr-8">${job.title}</h3>
          <p class="text-body-md font-body-md text-on-surface-variant">${job.company}</p>
        </div>
        <button class="focus:outline-none" onclick="toggleBookmark(${job.id})">
          ${bookmarkIcon}
        </button>
      </div>
      <div class="flex flex-col gap-2 mt-2">
        <div class="flex items-center gap-2 text-on-surface-variant text-body-sm font-body-sm">
          <span class="material-symbols-outlined text-[18px]">location_on</span>
          <span>${job.location}</span>
        </div>
        <div class="flex items-center gap-2 text-on-surface-variant text-body-sm font-body-sm">
          <span class="material-symbols-outlined text-[18px]">${job.compensation.includes('R$') ? 'payments' : 'schedule'}</span>
          <span>${job.compensation}</span>
        </div>
      </div>
      <div class="mt-auto pt-4 flex justify-between items-center">
        <div class="flex gap-2">
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
