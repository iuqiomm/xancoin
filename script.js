 let playerPoints = parseInt(localStorage.getItem('playerPoints')) || 0;
let tapHealth = parseInt(localStorage.getItem('tapHealth')) || 5000;
let lastTapTime = localStorage.getItem('lastTapTime') ? new Date(localStorage.getItem('lastTapTime')) : new Date(0);
let missionCompleted = localStorage.getItem('missionCompleted') === 'true';
let invitedFriends = JSON.parse(localStorage.getItem('invitedFriends')) || [];
let friendsInvited = parseInt(localStorage.getItem('friendsInvited')) || 0;

document.getElementById("score").innerText = "Score: " + playerPoints;
document.getElementById("tap-health").innerText = "hp: " + tapHealth;
document.getElementById("friends-mission-status").innerText = `Приглашено друзей: ${friendsInvited}/25`;

function restoreHealth() {
    const currentTime = new Date();
    const timeDiff = Math.floor((currentTime - lastTapTime) / 1000);

    if (timeDiff > 0) {
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

        const coin = document.getElementById("coin");
        coin.classList.add("animate-coin");

        showPlusOne();

        setTimeout(() => {
            coin.classList.remove("animate-coin");
        }, 100);
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
    }, 700);
}

function openTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
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
        addPoints(200000);
        localStorage.setItem('missionCompleted', true);
        missionCompleted = true;
    } else {
        alert("Вы уже получили вознаграждение за это задание.");
    }
}

function subscribeToChannel() {
    completeMission();
    window.open('https://t.me/xancoinapp', '_blank');
}

function completeFriendsMission() {
    if (friendsInvited >= 25) {
        addPoints(800000);
        localStorage.setItem('friendsInvited', 0); // сбрасываем счетчик
        friendsInvited = 0;
        document.getElementById('friends-mission-status').innerText = `Приглашено друзей: ${friendsInvited}/25`;
        alert("Поздравляем! Вы завершили задание и получили 800000 монет.");
    } else {
        alert(`Пригласите еще ${25 - friendsInvited} друзей для выполнения задания.`);
    }
}

function checkFriendId() {
    const friendId = document.getElementById('friend-id-input').value.trim();
    const playerId = localStorage.getItem('playerId');

    if (!friendId) {
        document.getElementById('check-status').innerText = "Пожалуйста, введите ID друга.";
        return;
    }

    if (invitedFriends.includes(friendId)) {
        document.getElementById('check-status').innerText = "Этот ID уже был использован.";
        return;
    }

    // Здесь можно добавить логику для проверки существования ID друга
    // Например, сделать запрос на сервер

    // Для примера, допустим, ID существует и успешное приглашение
    invitedFriends.push(friendId);
    localStorage.setItem('invitedFriends', JSON.stringify(invitedFriends));
    addPoints(5000);
    friendsInvited++;
    localStorage.setItem('friendsInvited', friendsInvited);
    document.getElementById('check-status').innerText = "Поздравляем! Ваш друг приглашен, и вы получили 5000 монет.";
    document.getElementById('friends-mission-status').innerText = `Приглашено друзей: ${friendsInvited}/25`;

    // Проверяем задание на количество приглашенных друзей
    completeFriendsMission();
}

function setUpPlayer() {
    let playerId = localStorage.getItem('playerId');

    if (!playerId || !/^\d{7}$/.test(playerId)) {
        playerId = generateUniqueId();
        localStorage.setItem('playerId', playerId);
    }

    document.getElementById('player-id').innerText = `ID: ${playerId}`;
}

function generateUniqueId() {
    return Math.floor(1000000 + Math.random() * 9000000);
}

window.onload = function() {
    restoreHealth();
    console.log("Игра загружена успешно");
    setUpPlayer();

    setInterval(() => {
        restoreHealth();
    }, 1000);
} 