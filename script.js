// Инициализация переменных
let playerPoints = parseInt(localStorage.getItem('playerPoints')) || 0;
let tapHealth = parseInt(localStorage.getItem('tapHealth')) || 5000;
let lastTapTime = localStorage.getItem('lastTapTime') ? new Date(localStorage.getItem('lastTapTime')) : new Date(0);
let missionCompleted = localStorage.getItem('missionCompleted') === 'true';
let invitedFriends = parseInt(localStorage.getItem('invitedFriends')) || 0;

// Получение элементов DOM
let friendsCountElement = document.getElementById('friends-count');

// Функция для обновления количества приглашённых друзей
function updateFriendsCount() {
    friendsCountElement.innerText = `Приглашено друзей: ${invitedFriends} / 25`;
}

// Функция для приглашения друга (копирование ссылки-приглашения)
function inviteFriend() {
    const inviteLink = "https://t.me/xancoinbot?start=your_referral_code";
    
    navigator.clipboard.writeText(inviteLink).then(() => {
        alert("Ссылка-приглашение скопирована в буфер обмена! Поделитесь ею с друзьями.");
    }).catch(err => {
        console.error('Не удалось скопировать ссылку-приглашение: ', err);
        alert("Не удалось скопировать ссылку-приглашение.");
    });
}

// Функция, которая вызывается при успешном реферале
function referralSuccessful() {
    invitedFriends++;
    localStorage.setItem('invitedFriends', invitedFriends);
    updateFriendsCount();
    addPoints(5000); // Награда 5000 монет за успешный реферал

    if (invitedFriends >= 25) {
        alert("Поздравляем! Вы пригласили 25 друзей. Вы заработали бонус в размере 500 000 монет!");
        addPoints(500000); // Дополнительный бонус за приглашение 25 друзей
    }
}

// Эта функция вызывается для симуляции успешного реферала (тестирование)
function simulateReferral() {
    referralSuccessful();
}

// Функция для восстановления здоровья
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

// Функция для тапов по монете
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

// Функция добавления очков
function addPoints(points) {
    playerPoints += points;
    localStorage.setItem('playerPoints', playerPoints);
    document.getElementById("score").innerText = "Score: " + playerPoints;
}

// Функция отображения +1
function showPlusOne() {
    const plusOne = document.getElementById("plus-one");
    plusOne.style.opacity = 1;
    plusOne.style.transform = "translate(-50%, -100px)";

    setTimeout(() => {
        plusOne.style.opacity = 0;
        plusOne.style.transform = "translate(-50%, -50%)";
    }, 700); // Анимация длится 500ms
}

// Функция открытия вкладок
function openTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active')); // Скрыть все вкладки
    document.getElementById(tabName).classList.add('active'); // Показать выбранную вкладку
}

// Функция завершения миссии
function completeMission() {
    if (!missionCompleted) {
        addPoints(5000); // Добавляем 5000 монет

        localStorage.setItem('missionCompleted', true); // Сохраняем выполнение задания
        missionCompleted = true;
    } else {
        alert("Вы уже получили вознаграждение за это задание.");
    }
}

// Функция подписки на канал
function subscribeToChannel() {
    completeMission(); // Выполняем миссию
    window.open('https://t.me/xancoinapp', '_blank'); // Перенаправление по вашей ссылке
}

// Обновление состояния при загрузке страницы
window.onload = function() {
    restoreHealth(); // Восстанавливаем здоровье при загрузке
    updateFriendsCount(); // Обновляем количество приглашённых друзей

    console.log("Игра загружена успешно");

    // Устанавливаем интервал для периодического восстановления здоровья каждую секунду
    setInterval(() => {
        restoreHealth();
    }, 1000); // 1000 мс = 1 секунда
}