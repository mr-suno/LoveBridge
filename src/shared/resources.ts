// I would import ./config.ts
// But my build.js file doesn't like imports in modules ...

const text_chat = game.GetService('TextChatService');
const storage = game.GetService('ReplicatedStorage');

export function chat(message: string) {
    if (text_chat.ChatVersion === Enum.ChatVersion.LegacyChatService) {
        const folder = storage.FindFirstChild('DefaultChatSystemChatEvents') as Folder;
        const event = folder.FindFirstChild('SayMessageRequest') as RemoteEvent;

        if (event) {
            event.FireServer(message, 'All');
        }
    } else {
        const folder = text_chat.FindFirstChild('TextChannels') as Folder;
        const channel = folder.FindFirstChild('RBXGeneral') as TextChannel;
    
        if (channel) {
            channel.SendAsync(message);
        }
    }
}