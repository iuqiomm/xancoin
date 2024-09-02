let playerPoints = parseInt(localStorage.getItem('playerPoints')) || 0;
let tapHealth = parseInt(localStorage.getItem('tapHealth')) || 5000;
let lastTapTime = localStorage.getItem('lastTapTime') ? new Date(localStorage.getItem('lastTapTime')) : new Date(0);
let missionCompleted = localStorage.getItem('missionCompleted') === 'true';

document.getElementById("score").innerText = "Score: " + playerPoints;
document.getElementById("tap-health").innerText = "hp: " + tapHealth;

function restoreHealth() {
    const currentTime = new Date();
    const timeDiff = Math.floor((currentTime - lastTapTime) / 1000);

    if (timeDiff > 0) {
        const healthToRestore = Math.floor(timeDiff / 3600);
        tapHealth = Math.min(tapHealth + healthToRestore, 5000);
        localStorage.setItem('tapHealth', tapHealth);
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
    const inviteLink = "https://t.me/xancoinbot";
    navigator.clipboard.writeText(inviteLink).then(() => {
        addPoints(50);
        alert("Ссылка скопирована в буфер обмена! Пригласите друга по этой ссылке.");
    }).catch(err => {
        console.error('Ошибка при копировании ссылки: ', err);
        alert("Не удалось скопировать ссылку.");
    });
}

function completeMission() {
    if (!missionCompleted) {
        addPoints(5000); // Добавляем 5000 монет
        
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

function startHealthRegeneration() {
    setInterval(() => {
        if (tapHealth < 5000) {
            tapHealth++;
            localStorage.setItem('tapHealth', tapHealth);
            document.getElementById("tap-health").innerText = "hp: " + tapHealth;
        }
    }, 1000); // Восстанавливаем 1 единицу здоровья каждую секунду
}

window.onload = function() {
    restoreHealth(); // Восстанавливаем здоровье при загрузке
    startHealthRegeneration(); // Запускаем восстановление здоровья по секундам
    console.log("Игра загружена успешно");
}