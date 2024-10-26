const express = require('express');
const fs = require('fs');
const path = require('path');

// Constants

const app = express();
const PORT = 3000;

app.use(express.json());

let database = [];
let commands = [];

const cache = path.join(__dirname, '..', 'cache.json');

// Cache Database

const load_db = () => {
    try {
        if (!fs.existsSync(cache)) { return }

        const data = fs.readFileSync(cache, 'utf8');

        database = JSON.parse(data);
        database = database.map(entry => ({
            ...entry,
            discord_id: String(entry.discord_id),
            command: entry.command || null
        }));

        console.log('Loaded DB:', database)
    } catch (error) {
        console.log('Experienced Server Issue: Failed to reach database!');
    }
}

const save_db = () => {
    try {
        fs.writeFileSync(cache, JSON.stringify(database, null, 2));

        console.log('DB Saved!');
    } catch (error) {
        console.error('Failed DB Save:', error);
    }
}

load_db();

// Setup Server

app.post('/linked', async (req, res) => {
    const { user, passcode, discord_id } = req.body;
    const url = `https://users.roproxy.com/v1/users/search?keyword=${user}&limit=10`;

    try {
        const response = await fetch(url);
        const result = await response.json();

        const matched = result.data.find((item) => item.name.toLowerCase() === user.toLowerCase());

        if (matched) {
            const duplicate_user = database.some(entry => 
                entry.user.toLowerCase() === user.toLowerCase()
            );

            const duplicate_discord = database.some(entry =>
                String(entry.discord_id) === String(discord_id)
            );

            if (duplicate_user) {
                return res.status(400).send('Duplicate username');
            }

            if (duplicate_discord) {
                return res.status(400).send('Discord account already linked');
            }

            const new_entry = {
                user,
                passcode,
                discord_id: String(discord_id)
            };

            database.push({ user, passcode, discord_id });

            fs.writeFileSync(cache, JSON.stringify(database, null, 2));

            res.status(200).send(
                `User:${user}|Passcode:${passcode}`
            );
        } else {
            res.status(404).send(
                'Invalid username'
            );
        }
    } catch (error) {
        console.log(`Experienced Server Issue: ${error}`);
        res.status(500).send(
            'Current Server Error!'
        );
    }
});

app.post('/account/command', (req, res) => {
    const { discord_id, command } = req.body;

    try {
        const userIndex = database.findIndex(entry => 
            String(entry.discord_id) === String(discord_id)
        );

        if (userIndex === -1) {
            return res.status(404).send('Account not found');
        }

        database[userIndex] = {
            ...database[userIndex],
            command: command
        };

        save_db();

        console.log(`Command "${command}" set for user ${discord_id}`);
        
        res.status(200).send('Command successful');
    } catch (error) {
        console.log(`Experienced Server Issue: ${error}`);

        res.status(500).send('Current Server Error!');
    }
});

app.route('/accounts/all')
    .get((req, res) => {
        try {
            const account_commands = database.map(entry => ({
                user: entry.user,
                discord_id: String(entry.discord_id),
                command: entry.command || null
            }));

            res.status(200).json(account_commands);
        } catch (error) {
            console.error('Error fetching accounts:', error);

            res.status(500).send('Internal Server Error!');
        }
    })
    .post((req, res) => {
        const { user, passcode, discord_id } = req.body;

        if (!user || !passcode || !discord_id) {
            return res.status(400).send('Invalid username');
        }

        const duplicate_user = database.some(entry => entry.user.toLowerCase() === user.toLowerCase());
        const duplicate_discord = database.some(entry => String(entry.discord_id) === String(discord_id));

        if (duplicate_user) {
            return res.status(400).send('Duplicate username');
        }

        if (duplicate_discord) {
            return res.status(400).send('Discord account already linked');
        }

        const new_entry = { user, passcode, discord_id: String(discord_id) };
        database.push(new_entry);

        save_db();

        res.status(201).send(`Added for user: ${user}`);
    })

// Start Server

app.listen(PORT, () => {
    console.log(`Connected to LoveBridge server! (PORT: ${PORT})`);
});
