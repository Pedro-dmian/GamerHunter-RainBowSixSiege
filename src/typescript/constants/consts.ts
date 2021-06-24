const GameClassId = 10826

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
  user: 'user',
  
  images: 'Images',
  coupons: 'Coupons',
  games: 'Games',
  categoriesGame: 'CategoriesGame'
}

export {
  GameClassId,
  interestingFeatures,
  windowNames,
  hotkeys,
  webService,
  sessionStorage
}