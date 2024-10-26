import { services } from "shared/config";
import { chat } from "shared/resources";

interface Account {
    user: string;
    discord_id: string;
    command: string;
}

let previous_command: string | undefined = undefined;
let previous_author: string | undefined = undefined;

let initial_run = true;

const api = 'http://localhost:3000/accounts/all';

function get_data(): { command: string; user: string } | undefined {
    const [req_] = game.HttpGetAsync(api);
    const data = services.http.JSONDecode(req_) as Account[];

    for (const value of data) {
        if (value.command !== previous_command || value.user !== previous_author) {
            return { command: value.command, user: value.user };
        }
    }

    return undefined;
}

task.spawn(() => {
    while (task.wait(1)) {
        const data = get_data();

        if (data) {
            const { command, user } = data;

            if (initial_run) {
                previous_command = command;
                previous_author = user;

                initial_run = false;
            } else {
                if (command !== previous_command) {
                    const char = services.players.LocalPlayer.Character ?? services.players.LocalPlayer.CharacterAdded.Wait()[0] as Model;
                    const humanoid = char?.FindFirstChildOfClass('Humanoid') as Humanoid;

                    if (command.lower() === 'jump' && humanoid) {
                        humanoid.ChangeState('Jumping');
                    }

                    if ((command.lower() === 'sit' || command.lower() === 'seat') && humanoid && !humanoid.Sit) {
                        humanoid.Sit = true;
                    } else if ((command.lower() === 'stand' || command.lower() === 'unsit') && humanoid && humanoid.Sit) {
                        humanoid.Sit = false;
                    }

                    previous_command = command;
                    previous_author = user;
                }
            }
        }
    }
});

chat('LoveBridge launched & Connected to Server');
