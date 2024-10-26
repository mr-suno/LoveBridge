import discord
import aiohttp
from discord.ext import commands

async def command(CTX: commands.Context, outcome: str):
    my_id = str(CTX.author.id)

    async with aiohttp.ClientSession() as session:
        async with session.post(
            url='http://localhost:3000/account/command',
            json={'discord_id': my_id, 'command': outcome}
        ) as command_response:
            if command_response.status != 200:
                embed = discord.Embed(title='LoveBridge Failure ‎ ❤️',
                                    description='Failed to execute command. Please try again.',
                                    color=discord.Color.red())
                await CTX.reply(embed=embed)
                return

        async with session.get(
            url='http://localhost:3000/accounts/all'
        ) as response:
            results = await response.json()
            
            for result in results:
                if str(result.get('discord_id')) == my_id:
                    embed = discord.Embed(title='LoveBridge ‎ ❤️',
                                        description=f'Done! Your player has, or will {outcome} soon.\n- Didn\'t do the action? Create a ticket in <#1299581734358225008>!',
                                        color=discord.Color.green())

                    embed.set_author(name='Developed by Suno', 
                                    url='https://github.com/mr-suno')
                    
                    await CTX.reply(embed=embed)
                    return

            embed = discord.Embed(title='LoveBridge Failure ‎ ❤️',
                                description='You have no account connected! Connect an account using **`/link`**.',
                                color=discord.Color.red())
            
            await CTX.reply(embed=embed)

class Freemium(commands.Cog):
    def __init__(self, app) -> None:
        self.app = app

    @commands.hybrid_command(name='jump',
                             description='Makes your player jump!')
    
    async def jump(self, CTX: commands.Context) -> None:
        await command(CTX=CTX, outcome='jump')

    @commands.hybrid_command(name='sit',
                             description='Makes your player take a seat from wherever it\'s at.',
                             aliases=['seat'])
    
    async def sit(self, CTX: commands.Context) -> None:
        await command(CTX=CTX, outcome='sit')

    @commands.hybrid_command(name='stand',
                             description='If you are seated, stand up!',
                             aliases=['unsit'])
    
    async def stand(self, CTX: commands.Context) -> None:
        await command(CTX=CTX, outcome='stand')

async def setup(app):
    await app.add_cog(Freemium(app))
