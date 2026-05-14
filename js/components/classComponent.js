class ClassComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.hoje = "ter";
  }

  connectedCallback() {
    this.loadData();
  }

  async loadData() {
    try {
      const response = await fetch('aulas.json');
      const classes = await response.json();
      this.render(classes);
    } catch (error) {
      console.error('Erro ao carregar os dados das aulas:', error);
    }
  }

  render(classes) {
    const dayClasses = classes.filter(a => a.data === this.hoje);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/classComponent.css';
    this.shadowRoot.appendChild(link);

    this.shadowRoot.innerHTML += `
        <div>
          ${dayClasses.map(a => {
      let provaDisplay = a.prova_alert ? '' : 'display: none;';
      return `
              <div class="comp-aula">
                <div class="lable-prova p_lable" style="${provaDisplay}">PROVA: <b>${a.prova}</b></div>
                <div class="titulo_aula">${a.disciplina}</div>
                <p class="p">Local e Horário: <b>${a.local} - ${a.horario}</b></p>
                <div class="lables">
                  <div class="lable-frequencia p_lable">FALTAS: <b>${a.frequencia}</b></div>
                  <div class="lable-nota p_lable">CR: <b>${a.nota}</b></div>
                </div>
              </div>
            `;
    }).join('')}
        </div>
      `;
  }
}

customElements.define('class-component', ClassComponent);  