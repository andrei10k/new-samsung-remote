const createCommand = (argv) => {
  const command = argv[0]
  const commandKeys = []

  switch (command) {
    case 'channel':
      for (const c of argv[1]) {
        commandKeys.push('KEY_' + c)
      }
      commandKeys.push('KEY_ENTER')
      break
    case 'power':
      commandKeys.push('KEY_POWER')
      break
    default:
      throw new Error(command + ' is not a valid command!')
  }

  return commandKeys
}

module.exports = createCommand
