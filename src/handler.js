// src/handler.js
const yenv = require('yenv');
// Iniicalizar el api con el path people como prefijo
const api = require('lambda-api')({ version: 'v1.0', base: 'people' });
const { parse } = require('json2csv');
const fs = require('fs');
const dbConnector = require('./utils/db-connector');
const PersonRepository = require('./person.repository');
const personSchemas = require('./person.schema');
const schemaValidator = require('./utils/schema-validator');
const byIndexValidator = schemaValidator({ params: personSchemas.byIndex });
const postValidator = schemaValidator({ body: personSchemas.post });

const env = yenv();
// Variable que nos va a permitir reusar las conexiones en varias ejecuciones del lambda
let cachedConnection;
let repository;

// Definicón de los Routes

// GET <url base>/people/1000
api.get('/:index', byIndexValidator, async (req, res) => {
  const index = req.params.index;
  const person = await repository.findOne({ index: index});
  if (person) {
    res.json(person);
  } else {
    res.error(404, `no existe la persona ${index} no existe`);
  }
});

// GET <url base>/people?eyeColor=green&gender=male
// Nota: podrias utilizar como parametro cualquier campo de la colección, pero el nombre debe ser exacto y case sensitive.
api.get('/all', async (req, res) => {
  const people = await repository.find(req.query);
  if (people && people.length > 0) {
    res.json(people);
  } else {
    res.error(404, 'no se han encontrado registros.');
  }
});

api.get('/download', async (req, res) => {
  const people = await repository.find(req.query);
  if (people && people.length > 0) {
    const fields = ['_id', 'index', 'age', 'eyeColor', 'name', 'gender', 'company', 'country', 'email', 'phone', 'address'];
    const opts = { fields };
    const csv = parse(people, opts);
    res.type('text/plain');
    res.header('Content-Type', 'text/plain; charset=utf-8');
    res.header('Content-disposition', 'tattachment; filename=people1.csv');
    res.send(csv);
  } else {
    res.error(404, 'no se han encontrado registros.');
  }
});

// POST <url base>/people
// Nota: pasar en el body el json con los datos de la persona que deseas actualizar o crear
api.post('/', postValidator, async (req, res) => {
  const person = req.body;
  await repository.save(person, true);
  res.json(person);
});

// Atrapar los errores y logearlos.
// Nota: al logear con los metodos de console (log, error, etc) dentro de un lambda se guardan directamente el cloudwatch
// Si quieres ver esos logs, dentro de la funcion lambda en la consola de aws haz clic en la pestaña Monitoring
// y luego en el botón View logs in CloudWatch que aparece en el lado derecho
api.use((err, req, res, next) => {
  if (err) {
    console.error(err);
  }
  next();
})

// Punto de entrada de la función Lambda (Handler)
module.exports.router = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true, bufferCommands: false, bufferMaxEntries: 0 };
  cachedConnection = await dbConnector.connect(env.MONGODB_URL, cachedConnection, mongoOptions);
  repository = new PersonRepository(cachedConnection);
  // Run the request
  return await api.run(event, context);
};