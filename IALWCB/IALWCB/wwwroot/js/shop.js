$(document).ready(function () {
    // 1. Проверка авторизации и Куки (localStorage)
    checkAuth();

    const aftonVideo = document.getElementById('afton-video');
    if (aftonVideo) aftonVideo.volume = 0.5;

    // 2. Логика админ-ссылки (одноразовая до обновления)
    let adminClicked = false;
    $('#admin-link').click(function () {
        if (adminClicked) return; // Блокировка повторного нажатия

        adminClicked = true;
        $(this).css({ 'color': 'red', 'cursor': 'default', 'text-decoration': 'none' });

        // Скример перехода
        const jumpscare = $('#secret-jumpscare');
        jumpscare.show();

        const helloSound = new Audio('/sounds/Bbhello.oga');
        helloSound.volume = 0.2;
        helloSound.play();

        setTimeout(function () {
            window.location.href = '/Game/SecretMenu';
        }, 800);
    });
});

// Функции регистрации
function login() {
    const user = $('#username').val();
    if (user.length > 1) {
        localStorage.setItem('faz_user', user);
        $('#login-overlay').fadeOut();
    }
}

function checkAuth() {
    const savedUser = localStorage.getItem('faz_user');
    if (!savedUser) {
        $('#login-overlay').show();
    }
}

// --- Логика квеста в магазине ---
let hasPizza = false;
let hasPlush = false;
let noseCount = 0;

function buyItem(type) {
    if (type === 'pizza') hasPizza = true;
    if (type === 'plush') hasPlush = true;
    console.log("Purchased: " + type);

    // Если купил всё — можно намекнуть игроку глитчем
    if (hasPizza && hasPlush) {
        $('.monitor-glitch').css('opacity', '0.2');
        setTimeout(() => $('.monitor-glitch').css('opacity', '0'), 300);
    }
}

$(document).on('click', '#nose-trigger', function () {
    const honk = new Audio('/sounds/honk.mp3');
    honk.volume = 0.3;
    honk.currentTime = 0; // Сбрасываем в начало перед каждым проигрыванием
    honk.play().catch(e => console.log("Click interaction required"));

    // Эффект нажатия (визуальный отклик)
    $('#freddy-poster').css('transform', 'scale(0.95)');
    setTimeout(() => $('#freddy-poster').css('transform', 'scale(1)'), 100);

    // Логика квеста
    if (hasPizza && hasPlush) {
        noseCount++;
        console.log("Nose clicks:", noseCount);
        if (noseCount >= 5) {
            $('#secret-video-overlay').fadeIn();
            const video = document.getElementById('afton-video');
            if (video) video.play();
        }
    }
});