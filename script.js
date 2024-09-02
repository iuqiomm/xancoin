let playerPoints = parseInt(localStorage.getItem('playerPoints')) || 0;
let tapHealth = parseInt(localStorage.getItem('tapHealth')) || 5000;
let lastTapTime = localStorage.getItem('lastTapTime') ? new Date(localStorage.getItem('lastTapTime')) : new Date(0);
let missionCompleted = localStorage.getItem('missionCompleted') === 'true';
let inviteCount = parseInt(localStorage.getItem('inviteCount')) || 0;
let inviteRewardGiven = localStorage.getItem('inviteRewardGiven') === 'true';

document.getElementById("score").innerText = "Score: " + playerPoints;
document.getElementById("tap-health").innerText = "hp: " + tapHealth;

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

    // Здесь должна быть проверка на сервере, перешел ли друг по ссылке
    // Если друг переходит по ссылке, вызывается эта функция:
    friendJoined();
}

function friendJoined() {
    inviteCount++;
    localStorage.setItem('inviteCount', inviteCount);
    updateInviteProgress();
}

function updateInviteProgress() {
    document.getElementById("invite-progress").innerText = `Приглашено друзей: ${inviteCount}/25`;

    if (inviteCount >= 25 && !inviteRewardGiven) {
        addPoints(500000);
        document.getElementById("invite-reward-status").innerText = "Вы получили 500,000 монет за приглашение 25 друзей!";
        localStorage.setItem('inviteRewardGiven', true);
        inviteRewardGiven = true;
    }
}

function completeMission() {
    if (!missionCompleted) {
        addPoints(5000);

        localStorage.setItem('missionCompleted', true);
        missionCompleted = true;
    } else {
        alert("Вы уже получили вознаграждение за это задание.");
    }
}

window.onload = function() {
    restoreHealth();
    updateInviteProgress();
    console.log("Игра загружена успешно");

    setInterval(() => {
        restoreHealth();
    }, 1000);
}