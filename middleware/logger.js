const { format } = require('date-fns')
const { v4: uuid } = require('uuid')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')
const { builtinModules } = require('module')

//helper function
const logEvents = async (message, logFileName) => {
    const dateTime = `${format(new Date(), 'ddmmyyyy/tHH:mm:ss')}`
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`

    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))    
        }
        await fsPromises.appendFile(path.join(__dirname, '..','logs',
        logFileNAme), logItem )
    }catch (err){
        console.log(err)
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
    //req.log keeps all logs requests
    console.log(`${req.method} ${req.path}`)
    next()
}

module.exports = { logEvents, logger }
