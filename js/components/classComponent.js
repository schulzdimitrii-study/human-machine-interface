class ClassComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.today = "ter";
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
    const dayClasses = classes.filter(a => a.data === this.today);

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="css/classComponent.css">
      <div>
        ${dayClasses.map(a => {
          const examDisplay = a.prova_alert ? '' : 'display: none;';
          const gradeColor = Number(a.nota) < 6 ? 'red' : Number(a.nota) < 8 ? 'orange' : 'green';

          return `
            <div class="class-card">
              <div class="exam-label p-label" style="${examDisplay}">PROVA: <b>${a.prova}</b></div>
              <div class="class-title">${a.disciplina}</div>
              <p class="p">Local e Horário: <b>${a.local} - ${a.horario}</b></p>
              <div class="labels">
                <div class="attendance-label p-label">FALTAS: <b>${a.frequencia}</b></div>
                <div class="grade-label p-label" style="background-color: ${gradeColor}">CR: <b>${a.nota}</b></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
}

customElements.define('class-component', ClassComponent);  