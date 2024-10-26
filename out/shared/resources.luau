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
return {
	chat = chat,
}
