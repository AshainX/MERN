const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 3500

app.use('/', express.static(path.join(__dirname,'/public')))
//app.listen(PORT, () => console.log(`server running on port ${PORT}`))

app.use('/', require('./routes/root'))

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')){
        res.json({ message: '404 not found' })
    }else {
        res.type('txt').send('404 Not Found')
    }
})

app.listen(3500, function() {
    console.log("Server is running on port " + 3500);
});

