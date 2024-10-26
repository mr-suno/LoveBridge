import discord;
from discord.ext import commands;

class Generic(commands.Cog):
    def __init__(self, app) -> None:
        self.app = app

    @commands.hybrid_command(name='forgot-pass',
                             description='If you have forgotten your client password, use this!',
                             aliases=['passless'])
    
    async def forgot(self, CTX: commands.Context) -> None:
        embed = discord.Embed(title='LoveBridge ‎ ❤️',
                              description='You\'re going to be pinged in our Direct Messages. Then check if your password is in there.\n\n- If it\'s not, please contact support.',
                              color=discord.Color.blurple())
        
        await CTX.reply(embed=embed)

async def setup(app):
    await app.add_cog(Generic(app))