const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

require('dotenv').config();

// Constants

const app = express();
const PORT = 3000;

app.use(express.json());

const mongoDB_URI = 'mongodb+srv://makrislogan5:czAVxAFtp9Zbwn31@lovebridge.d61lk.mongodb.net/?retryWrites=true&w=majority&appName=LoveBridge';

const client_options = {
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true
    }
};

async function run() {
    try {
        await mongoose.connect(mongoDB_URI, client_options);
        await mongoose.connection.db.admin().command({ ping: 1 });

        conmsole.log('Connected to MongoDB!');
    } finally {
        await mongoose.disconnect();
    }
}
run().catch(console.dir);

const middleware = (req, res, next) => {
    const username = req.headers['username'];
    const password = req.headers['password'];

    if (username === request_username && password === request_password) {
        next();
    } else {
        res.status(401).send('Unauthorized. Check login details!');
    }
}

// Connect to MongoDB

mongoose.connect(mongoDB_URI)
    .then(() => console.log('MongoDB Connected!'))
    .catch(code => console.error('MongoDB Connection Failure:', code));

const schema = new mongoose.Schema({
    user: { type: String, required: true, unique: true },
    passcode: { type: String, required: true },
    discord_id: { type: String, required: true, unique: true },
    command: { type: String, default: null }
});

const user = mongoose.model('User', schema);

const request_password = 'BAE60B0C316919D7EDB4AAC8E3CD969EFDF64AB6F3D57AEDBB6755644D3726';
const request_username = 'A1EC3106057E29DCFF82ECEBC78522BDE740C3C9F2EF6D1E8293';

// Setup Server

app.post('/linked', middleware, async (req, res) => {
    const { user, passcode, discord_id } = req.body;
    const url = `https://users.roproxy.com/v1/users/search?keyword=${user}&limit=10`;

    try {
        const response = await fetch(url);
        const result = await response.json();

        const matched = result.data.find((item) => item.name.toLowerCase() === user.toLowerCase());

        if (matched) {
            const duplicate_user = await User.findOne({ user: user.toLowerCase() });
            const duplicate_discord = await User.findOne({ discord_id: discord_id });

            if (duplicate_user) {
                return res.status(400).send('Duplicate username');
            }

            if (duplicate_discord) {
                return res.status(400).send('Discord account already linked');
            }

            const new_entry = new User({ user, passcode, discord_id: String(discord_id) });
            await new_entry.save();

            res.status(200).send(`User:${user}|Passcode:${passcode}`);
        } else {
            res.status(404).send('Invalid username');
        }
    } catch (error) {
        console.log(`Experienced Server Issue: ${error}`);

        res.status(500).send('Current Server Error!');
    }
});

app.post('/account/command', middleware, async (req, res) => {
    const { discord_id, command } = req.body;

    try {
        const user = await User.findOne({ discord_id: String(discord_id) });

        if (!user) {
            return res.status(404).send('Account not found');
        }

        user.command = command;

        await user.save();

        console.log(`Command "${command}" set for user ${discord_id}`);

        res.status(200).send('Command successful');
    } catch (error) {
        console.log(`Experienced Server Issue: ${error}`);

        res.status(500).send('Current Server Error!');
    }
});

app.route('/accounts/all')
    .get(async (req, res) => {
        try {
            const account_commands = await User.find({}, { _id: 0, user: 1, discord_id: 1, command: 1 });

            res.status(200).json(account_commands);
        } catch (error) {
            console.error('Error fetching accounts:', error);

            res.status(500).send('Internal Server Error!');
        }
    })
    .post(middleware, async (req, res) => {
        const { user, passcode, discord_id } = req.body;

        if (!user || !passcode || !discord_id) {
            return res.status(400).send('Invalid username');
        }

        const duplicate_user = await User.findOne({ user: user.toLowerCase() });
        const duplicate_discord = await User.findOne({ discord_id: discord_id });

        if (duplicate_user) {
            return res.status(400).send('Duplicate username');
        }

        if (duplicate_discord) {
            return res.status(400).send('Discord account already linked');
        }

        const new_entry = new User({ user, passcode, discord_id: String(discord_id) });
        await new_entry.save();

        res.status(201).send(`Added for user: ${user}`);
    });

// Start Server

app.listen(PORT, () => {
    console.log(`Connected to LoveBridge server! (PORT: ${PORT})`);
});
