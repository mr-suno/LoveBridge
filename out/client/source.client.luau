-- Compiled with roblox-ts v3.0.0
-- Compiled with roblox-ts v3.0.0
-- Quick access to all necessary services.
-- These are all of the services used inside of Starry as of 10/14/2024.
-- (And probably all, or most that will ever be used).
-- Declare Constants
local whitespace = "  "
-- Create Exports
local services = {
	players = game:GetService("Players"),
	http = game:GetService("HttpService"),
	core = game:GetService("CoreGui"),
	user_input = game:GetService("UserInputService"),
	storage = game:GetService("ReplicatedStorage"),
	teleport = game:GetService("TeleportService"),
	marketplace = game:GetService("MarketplaceService"),
	run = game:GetService("RunService"),
	tween = game:GetService("TweenService"),
	badge = game:GetService("BadgeService"),
	starter = game:GetService("StarterGui"),
	lighting = game:GetService("Lighting"),
	stats = game:GetService("Stats"),
	workspace = game:GetService("Workspace"),
	text_chat = game:GetService("TextChatService"),
}
-- Compiled with roblox-ts v3.0.0
-- I would import ./config.ts
-- But my build.js file doesn't like imports in modules ...
local text_chat = game:GetService("TextChatService")
local storage = game:GetService("ReplicatedStorage")
local function chat(message)
	if text_chat.ChatVersion == Enum.ChatVersion.LegacyChatService then
		local folder = storage:FindFirstChild("DefaultChatSystemChatEvents")
		local event = folder:FindFirstChild("SayMessageRequest")
		if event then
			event:FireServer(message, "All")
		end
	else
		local folder = text_chat:FindFirstChild("TextChannels")
		local channel = folder:FindFirstChild("RBXGeneral")
		if channel then
			channel:SendAsync(message)
		end
	end
end
local previous_command = nil
local previous_author = nil
local initial_run = true
local api = "http://localhost:3000/accounts/all"
local function get_data()
	local req_ = game:HttpGetAsync(api)
	local data = services.http:JSONDecode(req_)
	for _, value in data do
		if value.command ~= previous_command or value.user ~= previous_author then
			return {
				command = value.command,
				user = value.user,
			}
		end
	end
	return nil
end
task.spawn(function()
	while true do
		local _value = task.wait(1)
		if not (_value ~= 0 and _value == _value and _value) then
			break
		end
		local data = get_data()
		if data then
			local _binding = data
			local command = _binding.command
			local user = _binding.user
			if initial_run then
				previous_command = command
				previous_author = user
				initial_run = false
			else
				if command ~= previous_command then
					local char = services.players.LocalPlayer.Character or (services.players.LocalPlayer.CharacterAdded:Wait())
					local _result = char
					if _result ~= nil then
						_result = _result:FindFirstChildOfClass("Humanoid")
					end
					local humanoid = _result
					if string.lower(command) == "jump" and humanoid then
						humanoid:ChangeState("Jumping")
					end
					if (string.lower(command) == "sit" or string.lower(command) == "seat") and humanoid and not humanoid.Sit then
						humanoid.Sit = true
					elseif (string.lower(command) == "stand" or string.lower(command) == "unsit") and humanoid and humanoid.Sit then
						humanoid.Sit = false
					end
					previous_command = command
					previous_author = user
				end
			end
		end
	end
end)
chat("LoveBridge launched & Connected to Server")
