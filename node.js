const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

let inviteData = {}; // Сохраняет данные по приглашениям {userId: inviteCount}

app.post('/friend-joined', (req, res) => {
    const { userId, friendId } = req.body;

    if (!inviteData[userId]) {
        inviteData[userId] = { count: 0, friends: new Set() };
    }

    if (!inviteData[userId].friends.has(friendId)) {
        inviteData[userId].count += 1;
        inviteData[userId].friends.add(friendId);
    }

    res.send({
        message: 'Friend joined successfully!',
        inviteCount: inviteData[userId].count
    });
});

// Обработчик для получения количества приглашений
app.get('/get-invites/:userId', (req, res) => {
    const userId = req.params.userId;
    const inviteCount = inviteData[userId] ? inviteData[userId].count : 0;

    res.send({
        inviteCount
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));