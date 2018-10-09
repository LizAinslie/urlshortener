const express = require('express')
const rethinkdb = require('rethinkdbdash')({ discovery: true, host: 'localhost', port: 28016, db: 'url' })
const randomstring = require('randomstring')

const app = express()

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/templates`);

app.get('/', (req, res)=>{
	res.render('index.ejs')
})

app.post('/add', (req, res) => {
	rethinkdb.table('links').insert({
	    id: randomstring.generate(7),
	    url: req.body.url
	}).run().then(link => {
		res.render('finish.ejs', { url: `https://url.railrunner16.me/l/${link.id}` })
	})
})

app.get('/l/:id', (req, res) => {
    rethinkdb.table('links').get(req.params.id).run().then(link => {
        if (!link) return res.sendStatus(404)
        res.redirect(link.url)
    })
})