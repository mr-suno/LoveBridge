-- File minified using Luamin

--[[

    We don't recommend tampering with this file, instead,
    set up your own Roblox-TS environment and build the TypeScript yourself.

    You can use our `build.js` file to convert any "TS.imports" into source-code,
    then navigate to `./out/client/main.client.luau` to find the unminified source file.

    Build manager written on : 10/12/2024 (October 12th, 2024).

    Message me (@mr.suno) on Discord for any questions, concerns or issues regarding LoveBridge.

    P.S. If you found this,
         this file doesn't have any POST requests, sorry!

    Much love,
         Suno

]]

-- Minified source-file below:

local a="  "local b={players=game:GetService("Players"),http=game:GetService("HttpService"),core=game:GetService("CoreGui"),user_input=game:GetService("UserInputService"),storage=game:GetService("ReplicatedStorage"),teleport=game:GetService("TeleportService"),marketplace=game:GetService("MarketplaceService"),run=game:GetService("RunService"),tween=game:GetService("TweenService"),badge=game:GetService("BadgeService"),starter=game:GetService("StarterGui"),lighting=game:GetService("Lighting"),stats=game:GetService("Stats"),workspace=game:GetService("Workspace"),text_chat=game:GetService("TextChatService")}local c=game:GetService("TextChatService")local d=game:GetService("ReplicatedStorage")local function e(f)if c.ChatVersion==Enum.ChatVersion.LegacyChatService then local g=d:FindFirstChild("DefaultChatSystemChatEvents")local h=g:FindFirstChild("SayMessageRequest")if h then h:FireServer(f,"All")end else local g=c:FindFirstChild("TextChannels")local i=g:FindFirstChild("RBXGeneral")if i then i:SendAsync(f)end end end;local j=nil;local k=nil;local l=true;local m="http://localhost:3000/accounts/all"local function n()local o=game:HttpGetAsync(m)local p=b.http:JSONDecode(o)for q,r in p do if r.command~=j or r.user~=k then return{command=r.command,user=r.user}end end;return nil end;task.spawn(function()while true do local s=task.wait(1)if not(s~=0 and s==s and s)then break end;local p=n()if p then local t=p;local u=t.command;local v=t.user;if l then j=u;k=v;l=false else if u~=j then local w=b.players.LocalPlayer.Character or b.players.LocalPlayer.CharacterAdded:Wait()local x=w;if x~=nil then x=x:FindFirstChildOfClass("Humanoid")end;local y=x;if string.lower(u)=="jump"and y then y:ChangeState("Jumping")end;if(string.lower(u)=="sit"or string.lower(u)=="seat")and y and not y.Sit then y.Sit=true elseif(string.lower(u)=="stand"or string.lower(u)=="unsit")and y and y.Sit then y.Sit=false end;j=u;k=v end end end end end)e("LoveBridge launched & Connected to Server")