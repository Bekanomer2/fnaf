$(document).ready(function () {
    const bgAmbience = document.getElementById('bg-ambience');
    const selectSound = document.getElementById('menu-select-sound');
    const gSound1 = document.getElementById('glitch-sound-1');
    const gSound2 = document.getElementById('glitch-sound-2');

    // --- НАСТРОЙКА ГРОМКОСТИ (0.03 это 3% от максимума) ---
    const globalVolume = 0.1;
    const uiVolume = 0.05; // Для звуков наведения (чуть громче фона)

    // Устанавливаем громкость при загрузке
    if (bgAmbience) bgAmbience.volume = globalVolume;
    if (selectSound) selectSound.volume = uiVolume;
    if (gSound1) gSound1.volume = globalVolume;
    if (gSound2) gSound2.volume = globalVolume;

    // Логика кнопки CLICK TO START
    $('#start-overlay').on('click', function () {
        console.log("Start Clicked - Showing Menu");

        $(this).fadeOut(400);
        $('#main-menu').fadeIn(1000);

        if (bgAmbience) {
            // ИСПРАВЛЕНО: теперь здесь тоже 0.03, а не 0.5
            bgAmbience.volume = globalVolume;
            bgAmbience.play().catch(e => console.log("Audio blocked"));
        }
    });

    // Звук при наведении на пункты меню
    $('.menu-item').mouseenter(function () {
        if (selectSound) {
            selectSound.volume = uiVolume;
            selectSound.currentTime = 0;
            selectSound.play().catch(e => { });
        }
    });

    // Логика скримера при клике (New Game / Continue)
    $('.menu-item').on('click', function () {
        const jumpscare = $('#secret-jumpscare');

        // Плавно приглушаем фон перед скримером
        if (bgAmbience) bgAmbience.pause();

        const randomGlitch = Math.random() < 0.5 ? gSound1 : gSound2;
        if (randomGlitch) {
            // ИСПРАВЛЕНО: скример теперь тоже тихий (0.03)
            randomGlitch.volume = globalVolume;
            randomGlitch.currentTime = 0;
            randomGlitch.play();
        }

        // Рандомный кадр скримера
        const frameIndex = Math.floor(Math.random() * 6);
        jumpscare.css('background-position', `0 ${frameIndex * 20}%`);
        jumpscare.show();

        setTimeout(function () {
            window.location.href = '/Game/';
        }, 2500);
    });

    triggerRandomGlitch();
});

function triggerRandomGlitch() {
    const glitchElement = $('.monitor-glitch');
    if (glitchElement.length === 0) return;

    const randomDelay = Math.random() * (45000 - 15000) + 15000;
    setTimeout(function () {
        glitchElement.css('opacity', '0.4');
        setTimeout(function () {
            glitchElement.css('opacity', '0');
            triggerRandomGlitch();
        }, 500);
    }, randomDelay);
}