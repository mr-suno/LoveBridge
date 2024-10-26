// Quick access to all necessary services.
// These are all of the services used inside of Starry as of 10/14/2024.

// (And probably all, or most that will ever be used).

// Declare Constants

const whitespace = '  ';

// Create Exports

export const services = {
    'players': game.GetService('Players'),
    'http': game.GetService('HttpService'),
    'core': game.GetService('CoreGui'),
    'user_input': game.GetService('UserInputService'),
    'storage': game.GetService('ReplicatedStorage'),
    'teleport': game.GetService('TeleportService'),
    'marketplace': game.GetService('MarketplaceService'),
    'run': game.GetService('RunService'),
    'tween': game.GetService('TweenService'),
    'badge': game.GetService('BadgeService'),
    'starter': game.GetService('StarterGui'),
    'lighting': game.GetService('Lighting'),
    'stats': game.GetService('Stats'),
    'workspace': game.GetService('Workspace'),
    'text_chat': game.GetService('TextChatService')
}