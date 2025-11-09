import inquirer from 'inquirer';
import https from 'https';

// Function to fetch Pokémon data from PokéAPI
function getPokemon(name) {
  return new Promise((resolve, reject) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`;    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });  
      res.on('end', () => {
        try {
          const pokemon = JSON.parse(data);
          const moves = pokemon.moves.slice(0, 5).map((m, index) => ({
            name: m.move.name,
            power: m.move.power || (Math.floor(Math.random() * 40) + 10 + (index * 5))
          }));
          
          resolve({
            name: pokemon.name,
            hp: 300,
            moves: moves
          });
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

function attack(attacker, defender, move) {
  defender.hp -= move.power;
  if (defender.hp < 0) defender.hp = 0;
  console.log(`\n${attacker.name} used ${move.name}!  ${move.power} damage!`);
  console.log(`${defender.name} HP: ${defender.hp}/300`);
}

async function startGame() {
  console.clear();
  console.log(' Start \n');
  const { playerChoice } = await inquirer.prompt([
    {
      type: 'input',
      name: 'playerChoice',
      message: 'Choose your Pokémon:',
    }
  ]);

  const player = await getPokemon(playerChoice).catch(() => {
    console.log('Pokémon not found!');
    return getPokemon('pikachu');
  });

  const botOptions = ['charmander', 'bulbasaur', 'squirtle', 'pikachu', 'eevee'];
  const botChoice = botOptions[Math.floor(Math.random() * botOptions.length)];
  const bot = await getPokemon(botChoice);

  console.log(`\nYou chose: ${player.name}`);
  console.log(`Bot chose: ${bot.name}`);
  console.log(`\nBattle Start! Both have 300 HP\n`);

  while (player.hp > 0 && bot.hp > 0) {
    const { selectedMove } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedMove',
        message: `Choose your move (Your HP: ${player.hp}/300):`,
        choices: player.moves.map(m => `${m.name} (Power: ${m.power})`)
      }
    ]);

    const moveIndex = player.moves.findIndex(m => selectedMove.includes(m.name));
    const playerMove = player.moves[moveIndex];
    
    attack(player, bot, playerMove);

    if (bot.hp <= 0) {
      console.log('\n You Win! ');
      break;
    }

    const botMove = bot.moves[Math.floor(Math.random() * bot.moves.length)];
    attack(bot, player, botMove);

    if (player.hp <= 0) {
      console.log('\n You Lost!');
      break;
    }
  }
}

startGame()
  .catch((error) => {
    console.error('Error:', error.message);
  });