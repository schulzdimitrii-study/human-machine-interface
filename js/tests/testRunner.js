
global.localStorage = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = String(value);
  },
  clear() {
    this.store = {};
  }
};

global.window = {
  dispatchEvent() { }
};

global.CustomEvent = class CustomEvent { };

const {
  AlunoCandidato,
  VagaEstagio,
  Candidatura,
  GerenciadorCandidaturas
} = require('../models.js');

let failed = false;
function test(name, fn) {
  try {
    fn();
  } catch (err) {
    console.error(`❌ FAIL: ${name}`);
    console.error(err);
    failed = true;
  }
}

test('AlunoCandidato Profile Initialization and Update', () => {
  const aluno = new AlunoCandidato(
    1,
    'Lucas Andrade',
    '1542',
    'Engenharia de Software',
    5,
    'curriculo.pdf',
    ['JavaScript', 'HTML']
  );

  const profile = aluno.visualizarPerfil();
  if (profile.nome !== 'Lucas Andrade') throw new Error('Incorrect initial name');
  if (profile.periodo !== 5) throw new Error('Incorrect initial period');
  if (profile.habilidades.length !== 2) throw new Error('Incorrect skills length');

  aluno.atualizarPerfil({
    nome: 'Lucas A. Andrade',
    periodo: 6,
    habilidades: ['JavaScript', 'HTML', 'CSS', 'Node.js']
  });

  const updatedProfile = aluno.visualizarPerfil();
  if (updatedProfile.nome !== 'Lucas A. Andrade') throw new Error('Update name failed');
  if (updatedProfile.periodo !== 6) throw new Error('Update period failed');
  if (updatedProfile.habilidades.length !== 4) throw new Error('Update skills failed');
});

test('VagaEstagio Constructor and Fields', () => {
  const vaga = new VagaEstagio(
    10,
    'Estágio em Java',
    'Inatel Corp',
    'Santa Rita do Sapucaí (Presencial)',
    'Santa Rita, MG',
    'A combinar',
    'A combinar',
    '30h/semana',
    ['Java', 'Spring Boot'],
    ['Gympass'],
    'Sobre a Inatel',
    'Aberta',
    100
  );

  if (vaga.id !== 10) throw new Error('Vaga id incorrect');
  if (vaga.title !== 'Estágio em Java') throw new Error('Vaga title incorrect');
  if (vaga.location !== 'Santa Rita do Sapucaí (Presencial)') throw new Error('Vaga location incorrect');
});

test('AlunoCandidato CV Upload Mocks', () => {
  const aluno = new AlunoCandidato(2, 'Raphael', '999', 'Telecom', 8);
  if (aluno.curriculoSalvoPath !== null) throw new Error('Initial CV path should be null');

  const uploadSuccess = aluno.uploadCurriculo({ name: 'my_resume.pdf' });
  if (!uploadSuccess) throw new Error('CV upload failed');
  if (aluno.curriculoSalvoPath !== 'uploads/my_resume.pdf') throw new Error('Uploaded path incorrect');
});

test('GerenciadorCandidaturas Submission Workflow', () => {
  localStorage.clear();

  const aluno = new AlunoCandidato(3, 'Lucas', '111', 'Software', 5, 'uploads/lucas_cv.pdf');
  const vaga = new VagaEstagio(20, 'Backend dev', 'ABC Tech', 'Remote', 'Remote', 'R$ 1500', 'R$ 1500', '20h/semana');
  const manager = new GerenciadorCandidaturas();

  const isValidProfile = manager.confirmarDados(aluno);
  if (!isValidProfile) throw new Error('Expected profile to be valid');

  const candidacy = manager.enviarCandidatura(aluno, vaga);

  if (!candidacy.idCandidatura) throw new Error('Candidacy ID should be generated');
  if (candidacy.alunoId !== aluno.idAluno) throw new Error('Candidacy student ID mismatch');
  if (candidacy.vagaId !== vaga.id) throw new Error('Candidacy vacancy ID mismatch');
  if (candidacy.statusCandidatura !== 'ENVIADA') throw new Error('Initial status should be ENVIADA');
  if (manager.totalCandidaturas !== 1) throw new Error('Candidacies counter did not increment');

  const storedNotif = JSON.parse(localStorage.getItem(`user_${aluno.matricula}_notifications`));
  if (storedNotif.length !== 1) throw new Error('Notification was not saved to localStorage');
  if (!storedNotif[0].message.includes('ABC Tech')) throw new Error('Notification message incorrect');
});

if (failed) {
  console.error('❌ Some unit tests failed.');
  process.exit(1);
} else {
  process.exit(0);
}
