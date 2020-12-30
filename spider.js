const http = require('https')
const { disconnect } = require('mongoose')
const options = {
  hostname: 'v1.hitokoto.cn',
  path: '/',
  method: 'GET',
  protocol: 'https:',
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    'user-agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
  },
}
require('./db')
const { Sentence, SentenceType } = require('./models')

const uuids = new Set()
const list = []

function fetch() {
  return new Promise((resolve) => {
    const req = http.request(options, function (res) {
      res.setEncoding('utf8')
      res.on('data', async function (d) {
        const data = JSON.parse(d)
        if (uuids.has(data.uuid)) {
          return
        }
        // console.log(data)
        uuids.add(data.uuid)
        const isExist = await Sentence.findOne({
          text: data.hitokoto,
        })
        if (isExist) {
          return
        }
        // list.push({
        //   text: data.hitokoto,
        //   author: data.creator,
        //   from: data.from,
        // })

        await Sentence.create({
          text: data.hitokoto,
          author: data.creator,
          from: data.from,
          type: SentenceType.SYSTEM,
        })
        resolve(data)
      })
    })
    req.on('error', function (e) {
      resolve()
      console.log('problem with request: ' + e.message)
    })
    req.end()
  })
}

function sleep(time) {
  return new Promise((res) => {
    setTimeout(res, time)
  })
}
async function main() {
  const total = 100
  let gap = 0
  for (let index = 0; index < total; index++) {
    await fetch()
    gap++
    console.log(`${index + 1} / ${total}`)
    await sleep(Math.random() * 1000)
    if (gap % 5 == 0) {
      await sleep(5000)
      console.log('waiting 5000ms')
    }
  }

  // Sentence.insertMany(list).then(() => {})
  disconnect()
}

main()
