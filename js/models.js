class AlunoCandidato {
  constructor(idAluno, nome, matricula, curso, periodo, curriculoSalvoPath = null, habilidades = []) {
    this.idAluno = idAluno;
    this.nome = nome;
    this.matricula = matricula;
    this.curso = curso;
    this.periodo = periodo;
    this.curriculoSalvoPath = curriculoSalvoPath;
    this.habilidades = habilidades || [];
  }

  visualizarPerfil() {
    return {
      idAluno: this.idAluno,
      nome: this.nome,
      matricula: this.matricula,
      curso: this.curso,
      periodo: this.periodo,
      curriculoSalvoPath: this.curriculoSalvoPath,
      habilidades: [...this.habilidades]
    };
  }

  atualizarPerfil(dados) {
    if (dados.nome) this.nome = dados.nome;
    if (dados.matricula) this.matricula = dados.matricula;
    if (dados.curso) this.curso = dados.curso;
    if (dados.periodo) this.periodo = dados.periodo;
    if (dados.habilidades) this.habilidades = dados.habilidades;
  }

  fazerCandidatura(vagaId) {
    const idCandidatura = Math.floor(Math.random() * 1000000);
    return new Candidatura(idCandidatura, this.idAluno, vagaId, new Date(), this.curriculoSalvoPath);
  }

  uploadCurriculo(file) {
    if (file && file.name) {
      this.curriculoSalvoPath = `uploads/${file.name}`;
      return true;
    }
    return false;
  }

  atualizarCurriculoSalvoPath(path) {
    this.curriculoSalvoPath = path;
  }
}

class VagaEstagio {
  constructor(id, title, company, location, location_full, compensation, salary, hours, requirements = [], benefits = [], about_company = '', status = 'Aberta', status_percent = 100) {
    this.id = id;
    this.title = title;
    this.company = company;
    this.location = location;
    this.location_full = location_full;
    this.compensation = compensation;
    this.salary = salary;
    this.hours = hours;
    this.requirements = requirements;
    this.benefits = benefits;
    this.about_company = about_company;
    this.status = status;
    this.status_percent = status_percent;
  }
}

class Candidatura {
  constructor(idCandidatura, alunoId, vagaId, dataEnvio = new Date(), curriculoPath = null, statusCandidatura = 'ENVIADA') {
    this.idCandidatura = idCandidatura;
    this.alunoId = alunoId;
    this.vagaId = vagaId;
    this.dataEnvio = dataEnvio;
    this.curriculoPath = curriculoPath;
    this.statusCandidatura = statusCandidatura;
  }

  getDetalhesCandidatura() {
    return this.statusCandidatura;
  }

  atualizarStatus(status) {
    this.statusCandidatura = status;
  }

  anexarCurriculo(path) {
    this.curriculoPath = path;
  }

  registrarEnvio(dataEnvio) {
    this.dataEnvio = dataEnvio;
  }
}

class GerenciadorCandidaturas {
  constructor() {
    this.totalCandidaturas = 0;
    this.candidaturas = [];
  }

  enviarCandidatura(aluno, vaga, curriculoFile) {
    if (!aluno || !vaga) {
      throw new Error('Aluno e Vaga são obrigatórios para realizar candidatura.');
    }

    let cvPath = aluno.curriculoSalvoPath;
    if (curriculoFile) {
      cvPath = `uploads/${curriculoFile.name || curriculoFile}`;
    }

    const idCandidatura = Math.floor(Math.random() * 100000) + 1;
    const candidatura = new Candidatura(
      idCandidatura,
      aluno.idAluno,
      vaga.id,
      new Date(),
      cvPath,
      'ENVIADA'
    );

    this.candidaturas.push(candidatura);
    this.incrementarTotalCandidaturas();

    this.notificarCandidato(aluno, `Sua candidatura para a vaga "${vaga.title}" na empresa "${vaga.company}" foi enviada com sucesso! Protocolo: #${idCandidatura}`);

    return candidatura;
  }

  confirmarDados(aluno) {
    return !!(aluno && aluno.nome && aluno.matricula && aluno.curso && aluno.periodo);
  }

  notificarCandidato(aluno, mensagem) {
    const stored = localStorage.getItem(`user_${aluno.matricula}_notifications`) || '[]';
    const notifications = JSON.parse(stored);
    notifications.unshift({
      id: Date.now(),
      message: mensagem,
      date: new Date().toLocaleDateString('pt-BR'),
      read: false
    });
    localStorage.setItem(`user_${aluno.matricula}_notifications`, JSON.stringify(notifications));

    window.dispatchEvent(new CustomEvent('new-notification', { detail: mensagem }));
  }

  incrementarTotalCandidaturas() {
    this.totalCandidaturas += 1;
  }
}

if (typeof window !== 'undefined') {
  window.AlunoCandidato = AlunoCandidato;
  window.VagaEstagio = VagaEstagio;
  window.Candidatura = Candidatura;
  window.GerenciadorCandidaturas = GerenciadorCandidaturas;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AlunoCandidato,
    VagaEstagio,
    Candidatura,
    GerenciadorCandidaturas
  };
}
