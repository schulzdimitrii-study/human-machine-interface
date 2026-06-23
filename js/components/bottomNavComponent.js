class BottomNavComponent extends HTMLElement {
  constructor() {
    super();
    this.initProfile();
  }

  initProfile() {
    if (!localStorage.getItem('aluno_profile')) {
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
    }
  }

  getAlunoInstance() {
    const data = JSON.parse(localStorage.getItem('aluno_profile'));
    return new AlunoCandidato(
      data.idAluno,
      data.nome,
      data.matricula,
      data.curso,
      data.periodo,
      data.curriculoSalvoPath,
      data.habilidades
    );
  }

  saveAlunoInstance(aluno) {
    localStorage.setItem('aluno_profile', JSON.stringify(aluno.visualizarPerfil()));
  }

  connectedCallback() {
    const isSubpage = window.location.pathname.includes('/pages/');
    const homeLink = isSubpage ? '../index.html' : 'index.html';
    const jobsLink = isSubpage ? 'jobOpenings.html' : 'pages/jobOpenings.html';
    const currentPath = window.location.pathname;

    const isHomeActive = currentPath.endsWith('index.html') || currentPath.endsWith('/');
    const isJobsActive = currentPath.includes('jobOpenings.html') || currentPath.includes('jobDetails.html');

    this.innerHTML = `
      <div class="bottom-nav">
        <a href="${homeLink}" class="nav-item ${isHomeActive ? 'active' : ''}">
          <span class="material-symbols-outlined">home</span>
          <span class="nav-label">Início</span>
        </a>
        <a href="${jobsLink}" class="nav-item ${isJobsActive ? 'active' : ''}">
          <span class="material-symbols-outlined">work</span>
          <span class="nav-label">Vagas</span>
        </a>
        <button class="nav-item btn-nav-notifications" id="nav-btn-notifications">
          <div class="icon-wrapper">
            <span class="material-symbols-outlined">notifications</span>
            <span class="notification-badge" id="bottom-nav-notif-badge" style="display: none;"></span>
          </div>
          <span class="nav-label">Notificações</span>
        </button>
        <button class="nav-item btn-nav-profile" id="nav-btn-profile">
          <span class="material-symbols-outlined">person</span>
          <span class="nav-label">Perfil</span>
        </button>
      </div>

      <!-- Notifications Overlay -->
      <div class="bottom-nav-modal" id="notif-modal">
        <div class="modal-overlay"></div>
        <div class="modal-content">
          <div class="modal-header">
            <h3>Notificações</h3>
            <button class="close-modal-btn">&times;</button>
          </div>
          <div class="modal-body" id="notif-modal-body">
            <!-- Dynamic Notifications -->
          </div>
        </div>
      </div>

      <!-- Profile Overlay -->
      <div class="bottom-nav-modal" id="profile-modal">
        <div class="modal-overlay"></div>
        <div class="modal-content">
          <div class="modal-header">
            <h3>Perfil do Aluno</h3>
            <button class="close-modal-btn">&times;</button>
          </div>
          <div class="modal-body">
            <form id="profile-edit-form" class="profile-form">
              <div class="form-group">
                <label for="prof-nome">Nome Completo</label>
                <input type="text" id="prof-nome" required>
              </div>
              <div class="form-group-row">
                <div class="form-group">
                  <label for="prof-matricula">Matrícula</label>
                  <input type="text" id="prof-matricula" required>
                </div>
                <div class="form-group">
                  <label for="prof-periodo">Período</label>
                  <input type="number" id="prof-periodo" min="1" max="12" required>
                </div>
              </div>
              <div class="form-group">
                <label for="prof-curso">Curso</label>
                <input type="text" id="prof-curso" required>
              </div>
              <div class="form-group">
                <label>Habilidades (separadas por vírgula)</label>
                <input type="text" id="prof-habilidades">
              </div>
              <div class="form-group">
                <label>Currículo Cadastrado</label>
                <div class="cv-status-wrapper">
                  <span id="prof-cv-status" class="cv-status">Nenhum</span>
                  <label class="btn-cv-upload-label">
                    Upload PDF
                    <input type="file" id="prof-cv-upload" accept="application/pdf" style="display: none;">
                  </label>
                </div>
              </div>
              <button type="submit" class="btn-save-profile">Salvar Alterações</button>
            </form>
          </div>
        </div>
      </div>
    `;

    this.setupListeners();
    this.updateNotificationBadge();
  }

  setupListeners() {
    const notifBtn = this.querySelector('#nav-btn-notifications');
    const profileBtn = this.querySelector('#nav-btn-profile');
    const notifModal = this.querySelector('#notif-modal');
    const profileModal = this.querySelector('#profile-modal');

    if (notifBtn) {
      notifBtn.addEventListener('click', () => {
        this.renderNotifications();
        notifModal.classList.add('open');
      });
    }

    if (profileBtn) {
      profileBtn.addEventListener('click', () => {
        this.populateProfileForm();
        profileModal.classList.add('open');
      });
    }

    this.querySelectorAll('.close-modal-btn, .modal-overlay').forEach(el => {
      el.addEventListener('click', () => {
        notifModal.classList.remove('open');
        profileModal.classList.remove('open');
      });
    });

    const form = this.querySelector('#profile-edit-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const aluno = this.getAlunoInstance();
        aluno.nome = this.querySelector('#prof-nome').value.trim();
        aluno.matricula = this.querySelector('#prof-matricula').value.trim();
        aluno.periodo = parseInt(this.querySelector('#prof-periodo').value, 10);
        aluno.curso = this.querySelector('#prof-curso').value.trim();

        const skillsText = this.querySelector('#prof-habilidades').value;
        aluno.habilidades = skillsText
          ? skillsText.split(',').map(s => s.trim()).filter(s => s.length > 0)
          : [];

        this.saveAlunoInstance(aluno);
        profileModal.classList.remove('open');

        window.dispatchEvent(new CustomEvent('profile-updated'));

        const greeting = document.getElementById('user_name');
        if (greeting) {
          greeting.textContent = `Olá ${aluno.nome}!`;
        }
      });
    }

    const cvInput = this.querySelector('#prof-cv-upload');
    if (cvInput) {
      cvInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const aluno = this.getAlunoInstance();
          aluno.uploadCurriculo(file);
          this.saveAlunoInstance(aluno);
          this.querySelector('#prof-cv-status').textContent = file.name;
        }
      });
    }

    window.addEventListener('new-notification', () => {
      this.updateNotificationBadge();
    });
  }

  populateProfileForm() {
    const aluno = this.getAlunoInstance();
    this.querySelector('#prof-nome').value = aluno.nome;
    this.querySelector('#prof-matricula').value = aluno.matricula;
    this.querySelector('#prof-periodo').value = aluno.periodo;
    this.querySelector('#prof-curso').value = aluno.curso;
    this.querySelector('#prof-habilidades').value = aluno.habilidades.join(', ');

    const cvName = aluno.curriculoSalvoPath
      ? aluno.curriculoSalvoPath.replace('uploads/', '')
      : 'Nenhum';
    this.querySelector('#prof-cv-status').textContent = cvName;
  }

  renderNotifications() {
    const body = this.querySelector('#notif-modal-body');
    const stored = localStorage.getItem('user_notifications') || '[]';
    const notifications = JSON.parse(stored);

    notifications.forEach(n => n.read = true);
    localStorage.setItem('user_notifications', JSON.stringify(notifications));
    this.updateNotificationBadge();

    if (notifications.length === 0) {
      body.innerHTML = `
        <div class="empty-notifications">
          <span class="material-symbols-outlined">notifications_off</span>
          <p>Nenhuma notificação nova.</p>
        </div>
      `;
      return;
    }

    body.innerHTML = notifications.map(n => `
      <div class="notification-item">
        <div class="notification-meta">
          <span class="notification-dot"></span>
          <span class="notification-date">${n.date}</span>
        </div>
        <p class="notification-msg">${n.message}</p>
      </div>
    `).join('');
  }

  updateNotificationBadge() {
    const badge = this.querySelector('#bottom-nav-notif-badge');
    if (!badge) return;
    const stored = localStorage.getItem('user_notifications') || '[]';
    const notifications = JSON.parse(stored);
    const unreadCount = notifications.filter(n => !n.read).length;

    if (unreadCount > 0) {
      badge.textContent = unreadCount;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }
}

customElements.define('bottom-nav-component', BottomNavComponent);
