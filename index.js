 var restify = require('restify');

const server = restify.createServer({
  name: 'myapp',
  url: 'http://0.0.0.0',
  version: '1.0.0'
});

var knex = require('knex')({
  client: 'pg',
  version: '7.2',
  connection: {
    host : 'magna.grupoalves.site',
    user : 'postgres',
    password : 'password',
    port: 5433,
    database : 'Magna'
  }
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());


server.listen(8000, function () {
  console.log('%s listening at %s', server.name, server.url);
});

server.get('/echo/:username', function (req, res, next) {
  res.send(req.params);
  return next();
});


server.get('/', restify.plugins.serveStatic({
    directory: './dist',
    file: 'index.html'
  }));

server.get('/read', (req, res, next) => {
    
    knex('users').then((dados) => {
        res.send(dados);
    }, next)
    
});

server.post('/create', (req, res, next) => {
    
    knex('users')
        .insert(req.body)
        .then((dados) => {
            res.send(dados);
        }, next)
    
});

server.get('/show/:id', (req, res, next) => {
    
    const { id } = req.params;

    knex('users')
        .where('id', id)
        .first()
        .then((dados) => {
            if(!dados) return res.send(new errs.BadRequestError('nada foi encontrado'))
            res.send(dados);
        }, next)
        
});

server.put('/update/:id', (req, res, next) => {
    
    const { id } = req.params;

    knex('users')
        .where('id', id)
        .update(req.body)
        .then((dados) => {
            if(!dados) return res.send(new errs.BadRequestError('nada foi encontrado'))
            res.send('dados atualizados');
        }, next)
        
});

server.del('/delete/:id', (req, res, next) => {
    
    const { id } = req.params;

    knex('users')
        .where('id', id)
        .delete()
        .then((dados) => {
            if(!dados) return res.send(new errs.BadRequestError('nada foi encontrado'))
            res.send('dados excluidos');
        }, next)
        
});

