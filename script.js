let playerPoints = parseInt(localStorage.getItem('playerPoints')) || 0;
let tapHealth = parseInt(localStorage.getItem('tapHealth')) || 5000;
let missionCompleted = localStorage.getItem('missionCompleted') === 'true';

document.getElementById("score-value").innerText = playerPoints;
document.getElementById("tap-health").innerText = "hp: " + tapHealth;

// Function to restore health by 1 every second
function startHealthRestoration() {
    setInterval(() => {
        if (tapHealth < 5000) {
            tapHealth++;
            localStorage.setItem('tapHealth', tapHealth);
            document.getElementById("tap-health").innerText = "hp: " + tapHealth;
        }
    }, 1000); // Increment health every 1000 ms (1 second)
}

function tapCoin() {
    console.log("Монета нажата");

    if (tapHealth > 0) {
        addPoints(1);
        tapHealth--;
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
    document.getElementById("score-value").innerText = playerPoints;
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

window.onload = function() {
    startHealthRestoration(); // Start the continuous health restoration when the page loads
    console.log("Игра загружена успешно");
};