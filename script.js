let playerPoints = parseInt(localStorage.getItem('playerPoints')) || 0;
let tapHealth = parseInt(localStorage.getItem('tapHealth')) || 5000;
let lastTapTime = localStorage.getItem('lastTapTime') ? new Date(localStorage.getItem('lastTapTime')) : new Date(0);
let missionCompleted = localStorage.getItem('missionCompleted') === 'true';
let invitesSent = parseInt(localStorage.getItem('invitesSent')) || 0;

document.getElementById("score").innerText = "Score: " + playerPoints;
document.getElementById("tap-health").innerText = "hp: " + tapHealth;

function restoreHealth() {
    const currentTime = new Date();
    const timeDiff = Math.floor((currentTime - lastTapTime) / 1000);

    if (timeDiff > 0) {
        // Восстанавливаем 1 hp каждую секунду
        const healthToRestore = timeDiff;
        tapHealth = Math.min(tapHealth + healthToRestore, 5000);
        localStorage.setItem('tapHealth', tapHealth);
        document.getElementById("tap-health").innerText = "hp: " + tapHealth;
    }
}

function tapCoin() {
    console.log("Монета нажата");
    restoreHealth();

    if (tapHealth > 0) {
        addPoints(1);
        tapHealth--;
        lastTapTime = new Date();
        localStorage.setItem('lastTapTime', lastTapTime);
        localStorage.setItem('tapHealth', tapHealth);

        // Анимация монетки
        const coin = document.getElementById("coin");
        coin.classList.add("animate-coin");

        // Показать +1
        showPlusOne();

        setTimeout(() => {
            coin.classList.remove("animate-coin");
        }, 100); // Вернуть монетку в исходное положение через 100ms
    } else {
        alert("Вы исчерпали возможность тапов на этот час! Пожалуйста, подождите.");
    }

    document.getElementById("tap-health").innerText = "hp: " + tapHealth;
}

function addPoints(points) {
    playerPoints += points;
    localStorage.setItem('playerPoints', playerPoints);
    document.getElementById("score").innerText = "Score: " + playerPoints;
}

function showPlusOne() {
    const plusOne = document.getElementById("plus-one");
    plusOne.style.opacity = 1;
    plusOne.style.transform = "translate(-50%, -100px)";

    setTimeout(() => {
        plusOne.style.opacity = 0;
        plusOne.style.transform = "translate(-50%, -50%)";
    }, 700); // Анимация длится 500ms
}

function openTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active')); // Скрыть все вкладки
    document.getElementById(tabName).classList.add('active'); // Показать выбранную вкладку
}

function inviteFriend() {
    const playerId = localStorage.getItem('playerId') || generatePlayerId(); // Уникальный ID игрока
    localStorage.setItem('playerId', playerId);
    const inviteLink = `https://t.me/xancoinbot?referrer=${playerId}`;
    navigator.clipboard.writeText(inviteLink).then(() => {
        addPoints(50);
        alert("Ссылка скопирована в буфер обмена! Пригласите друга по этой ссылке.");
    }).catch(err => {
        console.error('Ошибка при копировании ссылки: ', err);
        alert("Не удалось скопировать ссылку.");
    });
}

function generatePlayerId() {
    return 'player-' + Math.random().toString(36).substr(2, 9);
}

function completeMission() {
    if (!missionCompleted) {
        addPoints(50000); // Добавляем 50000 монет

        localStorage.setItem('missionCompleted', true); // Сохраняем выполнение задания
        missionCompleted = true;
    } else {
        alert("Вы уже получили вознаграждение за это задание.");
    }
}

function subscribeToChannel() {
    completeMission(); // Выполняем миссию
    window.open('https://t.me/xancoinapp', '_blank'); // Перенаправление по вашей ссылке
}

// Проверка реферального параметра
function checkReferral() {
    const urlParams = new URLSearchParams(window.location.search);
    const referrer = urlParams.get('referrer');

    if (referrer) {
        // Обработка перехода по реферальной ссылке
        invitesSent++;
        localStorage.setItem('invitesSent', invitesSent);
        updateRewardStatus();
    }
}

function updateRewardStatus() {
    const rewardStatus = document.getElementById('reward-status');
    if (invitesSent >= 25) {
        addPoints(500000);
        rewardStatus.innerText = "Вы пригласили 25 друзей и получили 500000 монет!";
    } else {
        rewardStatus.innerText = `Вы пригласили ${invitesSent} друзей. Пригласите еще ${25 - invitesSent} для получения награды.`;
    }
}

window.onload = function() {
    restoreHealth(); // Восстанавливаем здоровье при загрузке
    console.log("Игра загружена успешно");

    // Устанавливаем интервал для периодического восстановления здоровья каждую секунду
    setInterval(() => {
        restoreHealth();
    }, 1000); // 1000 мс = 1 секунда

    // Проверяем реферальный параметр при загрузке страницы
    checkReferral();
}