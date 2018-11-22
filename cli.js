const Remote = require('./lib/samsung-remote')
const getCommand = require('./lib/command')
const express = require('express')

const config = {
  ip_address: '192.168.0.94', // required: IP address of your Samsung Smart TV
  name: 'Samsung Remote'
}

const remote = new Remote(config)
const app = express()

app.get('/samsungtv/off', (req, res) => {
  runCommand(['power'])
    .then(() => {
      res.send('ok')
    })
    .catch((err) => {
      res.send(500, err)
    })
})

app.get('/samsungtv/channel/:channel', (req, res) => {
  runCommand(['channel', req.params.channel])
    .then(() => {
      res.send('ok')
    })
    .catch((err) => {
      res.send(500, err)
    })
})

app.listen(3030, () => {
  console.log('Samsung TV app listening on port 3030')
})

const runCommand = (commandArray) => {
  return remote.tvReady()
    .then(() => {
      let promiseChain = Promise.resolve()
      for (const cmd of getCommand(commandArray)) {
        promiseChain = promiseChain.then(() => {
          return remote.sendKey(cmd)
        })
      }
      return promiseChain
    }).catch((err) => {
      console.error(err)
    })
}
