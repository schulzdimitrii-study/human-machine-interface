class SidebarComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const isSubpage = window.location.pathname.includes('/pages/');
    const homeLink = isSubpage ? '../index.html' : 'index.html';
    const jobsLink = isSubpage ? 'jobOpenings.html' : 'pages/jobOpenings.html';

    this.innerHTML = `
      <nav id="side_menu">
        <div class="sidebar-header">
          <h2 class="font">Menu</h2>
          <button class="close-btn" onclick="this.closest('sidebar-component').closeMenu()">X</button>
        </div>
        <a href="${homeLink}" style="text-decoration: none;">
          <div class="menu-btn">Início</div>
        </a>
        <a href="${jobsLink}" style="text-decoration: none;">
          <div class="menu-btn">Vagas de Estágio</div>
        </a>
        <div class="menu-btn" onclick="this.closest('sidebar-component').setTheme('inatel')">Tema Inatel</div>
        <div class="menu-btn" onclick="this.closest('sidebar-component').setTheme('dark')">Tema Dark</div>
      </nav>
    `;

    document.addEventListener('click', (event) => {
      const menu = this.querySelector('#side_menu');
      const hamburger = document.getElementById('menu');
      if (menu && menu.style.left === '0px') {
        if (!menu.contains(event.target) && (!hamburger || !hamburger.contains(event.target))) {
          this.closeMenu();
        }
      }
    });
  }

  openMenu() {
    const menu = this.querySelector('#side_menu');
    if (menu) {
      menu.style.left = '0';
    }
  }

  closeMenu() {
    const menu = this.querySelector('#side_menu');
    if (menu) {
      menu.style.left = '-320px';
    }
  }

  setTheme(themeName) {
    this.closeMenu();
    
    let colors = {};
    if (themeName === 'inatel') {
      colors = {
        '--click-color': '#126ae2',
        '--shadow-color': '#0a599b',
        '--text-color': 'black',
        '--bg-color-1': '#edf2f4',
        '--bg-color-2': 'white',
        '--md-sys-color-primary': '#126ae2'
      };
    } else if (themeName === 'dark') {
      colors = {
        '--click-color': '#126ae2',
        '--shadow-color': '#9b0a59',
        '--text-color': 'white',
        '--bg-color-1': '#2b2b2b',
        '--bg-color-2': '#3e3e3e',
        '--md-sys-color-primary': '#126ae2'
      };
    }

    for (const [variable, value] of Object.entries(colors)) {
      document.documentElement.style.setProperty(variable, value);
    }
  }
}

customElements.define('sidebar-component', SidebarComponent);
