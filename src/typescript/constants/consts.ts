const GameClassId = 10826


// ? Alias o name del juego [tomara del gameChallenges atributo name]
const GameClassIdObject = {
  'RainbowSix': 10826
}

const interestingFeatures = [
  'gep_internal',
  'game_info',
  'match',
  'match_info',
  'roster',
  'kill',
  'death',
  'me',
  'defuser'
]

const windowNames = {
  inGame: 'in_game',
  background: 'background',
  desktop: 'desktop'
}

const hotkeys = {
  toggle: 'showhide'
}

const webService = {
  api: 'https://v2.gamershunter.gg/',
  platform: 'api/auth/'
}

const sessionStorage = {
  token: 'token',
  user: 'user'
}

const localStorage = {
  images: 'Images',
  coupons: 'Coupons',
  games: 'Games',
  categoriesGame: 'CategoriesGame'
}

const indexDB = {
  database: 'GameHunter'
}

const ChallengeGame = {
  limit: 2
}

export {
  GameClassId,
  GameClassIdObject,
  interestingFeatures,
  windowNames,
  hotkeys,
  webService,
  sessionStorage,
  localStorage,
  indexDB,
  ChallengeGame
}