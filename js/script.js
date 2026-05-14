function openMenu() {
  document.getElementById("menu_aba").style.left = "0";  
}

function closeMenu() {
  document.getElementById("menu_aba").style.left = "-320px";    
}

document.addEventListener('click', function(event) {
    const menu = document.getElementById('menu_aba');
    const hamburger = document.getElementById('menu');

    if (menu.style.left === '0px') {
        if (!menu.contains(event.target) && !hamburger.contains(event.target)) {
            closeMenu();
        }
    }
});

function temaInatel() {
    document.documentElement.style.setProperty('--cor-click', '#126ae2');
    document.documentElement.style.setProperty('--cor-sombra', '#0a599b');
    document.documentElement.style.setProperty('--cor-text', 'black');
    document.documentElement.style.setProperty('--cor-back1', '#edf2f4');
    document.documentElement.style.setProperty('--cor-back2', '#6a8293');
    document.documentElement.style.setProperty('--md-sys-color-primary', '#126ae2');
}

function temaDark() {
    const cores = {
        '--cor-click': '#126ae2',
        '--cor-sombra': '#9b0a59',
        '--cor-text': 'white',
        '--cor-back1': '#2b2b2b',
        '--cor-back2': '#3e3e3e',
        '--md-sys-color-primary': '#126ae2'
    };

    for (const [variavel, valor] of Object.entries(cores)) {
        document.documentElement.style.setProperty(variavel, valor);
    }
}

const eventos = [
    {
        id: 1,
        title: 'Semana do Software 2025',
        date: '12/05',
        time: '10:00',
        location: 'Salão de Eventos',
        type: 'tech',
        description: 'Uma semana inteira dedicada à tecnologia e inovação, com palestras, workshops e hackathons.',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800&h=400'
    },
    {
        id: 2,
        title: 'Workshop de IoT',
        date: '12/01',
        time: '08:00',
        location: 'Laboratório CS&I',
        type: 'tech',
        description: 'Workshop prático sobre Internet das Coisas e suas aplicações na indústria 4.0.',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800&h=400'
    },
    {
        id: 3,
        title: 'Festa dos Alunos 2025',
        date: '18/05',
        time: '19:00',
        location: 'Área Esportiva do Inatel',
        type: 'cultural',
        description: 'Venha comemorar a melhor Festa dos Alunos de todos os tempos!',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800&h=400'
    },
    {
        id: 4,
        title: 'Feira de Oportunidades',
        date: '04/05',
        time: '10:00',
        location: 'Salão de Eventos',
        type: 'academic',
        description: 'Venha conhecer empresas e projetos com destaque na área da engenharia.',
        image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800&h=400'
    }
];

const carousel = document.querySelector('.carousel');

function createCards() {
    eventos.forEach(event => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="${event.image}" alt="${event.title}">
            <div class="info">
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <p><span class="material-symbols-outlined icon">event</span> ${event.date} às ${event.time} <span class="material-symbols-outlined icon">pin_drop</span> ${event.location}</p>
            </div>
        `;
        carousel.appendChild(card);
    });
}

createCards();


let index = 0;

function nextCard() {
    index = (index + 1) % eventos.length;
    updateCarousel();
}

function prevCard() {
    index = (index - 1 + eventos.length) % eventos.length;
    updateCarousel();
}

function updateCarousel() {
    const offset = -index * 100;
    carousel.style.transform = `translateX(${offset}%)`;
}

document.getElementById('nextBtn').addEventListener('click', nextCard);
document.getElementById('prevBtn').addEventListener('click', prevCard);
