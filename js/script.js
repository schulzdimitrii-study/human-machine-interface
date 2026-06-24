function openMenu() {
    document.getElementById("side_menu").style.left = "0";
}

function closeMenu() {
    document.getElementById("side_menu").style.left = "-320px";
}

document.addEventListener('click', function (event) {
    const menu = document.getElementById('side_menu');
    const hamburger = document.getElementById('menu');

    if (menu.style.left === '0px') {
        if (!menu.contains(event.target) && !hamburger.contains(event.target)) {
            closeMenu();
        }
    }
});

function inatelTheme() {
    const colors = {
        '--click-color': '#126ae2',
        '--shadow-color': '#0a599b',
        '--text-color': 'black',
        '--bg-color-1': '#edf2f4',
        '--bg-color-2': 'white',
        '--md-sys-color-primary': '#126ae2'
    };

    for (const [variable, value] of Object.entries(colors)) {
        document.documentElement.style.setProperty(variable, value);
    }
}

function darkTheme() {
    const colors = {
        '--click-color': '#126ae2',
        '--shadow-color': '#9b0a59',
        '--text-color': 'white',
        '--bg-color-1': '#2b2b2b',
        '--bg-color-2': '#3e3e3e',
        '--md-sys-color-primary': '#126ae2'
    };

    for (const [variable, value] of Object.entries(colors)) {
        document.documentElement.style.setProperty(variable, value);
    }
}

const events = [
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
    events.forEach(event => {
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
    index = (index + 1) % events.length;
    updateCarousel();
}

function prevCard() {
    index = (index - 1 + events.length) % events.length;
    updateCarousel();
}

function updateCarousel() {
    const offset = -index * 100;
    carousel.style.transform = `translateX(${offset}%)`;
}

document.getElementById('nextBtn').addEventListener('click', nextCard);
document.getElementById('prevBtn').addEventListener('click', prevCard);

const savedTheme = localStorage.getItem('app_theme') || 'inatel';
if (savedTheme === 'dark') {
    darkTheme();
} else {
    inatelTheme();
}

function loadGreetingName() {
    const savedProfile = localStorage.getItem('aluno_profile');
    if (savedProfile) {
        try {
            const data = JSON.parse(savedProfile);
            const greeting = document.getElementById('user_name');
            if (greeting && data && data.nome) {
                greeting.textContent = `Olá ${data.nome}!`;
            }
        } catch (e) {
            console.error('Error loading profile greeting:', e);
        }
    }
}

// Initial load
loadGreetingName();

// Listen to updates from other pages/components
window.addEventListener('profile-updated', loadGreetingName);
