import discord;
from discord.ext import commands;

class Debug(commands.Cog):
    def __init__(self, app) -> None:
        self.app = app

    @commands.hybrid_command(name='ping',
                             description='Returns how fast the bot is.',
                             aliases=['latency', 'lag'])
    
    async def ping(self, CTX: commands.Context) -> None:
        embed = discord.Embed(title='LoveBridge ‎ ❤️',
                              description='**TIP**: Connect your Roblox account using **`/link <UserID>`**.',
                              color=discord.Color.blurple())
        
        embed.add_field(name='Ping',
                        value=f'- {self.app.latency * 1000:.2f} milliseconds')

        await CTX.reply(embed=embed)

async def setup(app):
    await app.add_cog(Debug(app))