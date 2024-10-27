import discord;
import aiohttp;
import json;
import os;
import time;
from discord.ext import commands;

class Connector(commands.Cog):
    def __init__(self, app) -> None:
        self.app = app

    @commands.hybrid_command(name='link',
                             description='Connect your account to the LoveBridge API, allows you to use commands.',
                             aliases=['connect', 'login'])
    
    async def link(self, CTX: commands.Context, *, username: str, passcode: str) -> None:        
        if isinstance(CTX.channel, discord.DMChannel):
            cache = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'cache.json')
        
            try:
                with open(cache, 'r') as file:
                    database = json.load(file)

            except Exception:
                embed = discord.Embed(title='Database Error!',
                                    description='Attmpted, but failed to load our DataBase. We\'re looking into this. (<@1002377371892072498>)',
                                    color=discord.Color.red())
                
                embed.add_field(name='Detected Path',
                                value=cache)
                
                await CTX.reply(embed=embed)
                return

            my_id = str(CTX.author.id)

            if any(entry.get('discord_id') == my_id for entry in database):
                embed = discord.Embed(title='LoveBridge Failure ‎ ❤️',
                                    description='You already have an account linked! Upgrade to premium if you want to link more accounts.',
                                    color=discord.Color.red())
                
                await CTX.reply(embed=embed)
            else:
                async with aiohttp.ClientSession() as session:
                    async with session.post(
                        url='http://localhost:3000/linked',
                        headers={
                            'username': 'lovebridge',
                            'password': 'example_password'
                        },
                        json={'user': username, 'passcode': passcode, 'discord_id': str(my_id)}
                    ) as response:
                        result = await response.text()

                        if result == f'User:{username}|Passcode:{passcode}':
                            embed = discord.Embed(title='LoveBridge ‎ ❤️',
                                        description='Granted access to LoveBridge! Check your Direct Messages for your connection information.',
                                        color=discord.Color.green())
                            
                            secret_embed = discord.Embed(title='LoveBridge Connection Information ‎ ❤️',
                                                        description='Sharing this password allows other people to execute on your account.',
                                                        color=discord.Color.blurple())
                            
                            secret_embed.add_field(name='Passcode:',
                                                value=passcode)
                            
                            secret_embed.add_field(name='API Login:',
                                                value=f'User:{username}|Passcode:{passcode}')
                            
                            await CTX.reply(embed=embed)
                            await CTX.author.send(embed=secret_embed)

                        elif result == 'Duplicate username':
                            embed = discord.Embed(title='LoveBridge Failure ‎ ❤️',
                                description='Duplicate user information! This username already exists in our database.',
                                color=discord.Color.red())
                            
                            await CTX.reply(embed=embed)
                        
                        elif result == 'Invalid username':
                            embed = discord.Embed(title='LoveBridge Failure ‎ ❤️',
                                                description='Invalid user information detected! Please input a valid username!',
                                                color=discord.Color.red())
                            
                            await CTX.reply(embed=embed)

        else:
            message = await CTX.send(f'❌ ‎ You\'re only allowed to use this command in our Direct Messages! Try opening our DMs, then try again. (<@{CTX.author.id}>)')

            time.sleep(3)
            await message.delete()


async def setup(app):
    await app.add_cog(Connector(app))
