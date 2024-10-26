import discord, os;
import asyncio;
from discord.ext import commands;

# Constants

app = commands.Bot(command_prefix='.',
                   intents=discord.Intents.all(),
                   help_command=None)

# Sync

async def on_ready():
    print('LoveBridge App has loaded, ready for production!')

@app.command()
@commands.has_permissions(administrator=True)
async def sync(CTX: commands.Context) -> None:
    await app.tree.sync()
    embed = discord.Embed(title='LoveBridge Debugging ‎ ❤️',
                          description='Command tree synced! Relaunch Discord to show changes **(CTRL or CMD + R)**',
                          color=discord.Color.green())

    await CTX.reply(embed=embed)

# Load Commands

try:
    for file in os.listdir('./commands'):
        if file.endswith('.py'):
            name = file[:-3]

            asyncio.run(app.load_extension(f'commands.{name}'))
            print(name)

except Exception as error:
    print(f'Experienced Issue: {error}')

# Start Discord App

app.run('Enter App Token')
