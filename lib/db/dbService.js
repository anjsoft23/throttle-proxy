const config = require('./config/config');
const sql = require('mssql');

const dbConfig = {
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  server: config.DEFAULT_DB_HOST,
  options: config.DEFAULT_OPTIONS,
  database: config.DEFAULT_DB,
}

function createChunkTable() {
  sql.connect(dbConfig).then(() => {
    return sql.query`CREATE TABLE chunks (chunkID int NOT NULL IDENTITY(1,1) PRIMARY KEY, startTime datetime NOT NULL, data varchar(250) NOT NULL, url varchar(200) NOT NULL, dataSize varchar(max) NOT NULL)`
  }).then(result => {
    console.dir(result)
  }).then(() => {
    sql.close();
  }).catch(err => {
    console.log(err);
  });
}

function insertChunks(data) {
  const currentTime = new Date();
  const chunks = data.chunks || 'dummy chunks';
  const url = data.url || 'https://test.com';
  // const datasize = Buffer.byteLength(data.chunks || 'test');
  const datasize = data.chunkSize;
  sql.connect(dbConfig).then(() => {
    return sql.query`INSERT INTO chunks (startTime, data, url, dataSize) values (${currentTime}, ${chunks}, ${url}, ${datasize})`
  }).then(result => {
    console.dir(result)
  }).then(() => {
    sql.close();
  }).catch(err => {
    console.log(err);
  });
}

function fetchChunks() {
  sql.connect(dbConfig).then(() => {
    return sql.query`SELECT * from chunks`
  }).then(result => {
    console.dir(result)
  }).then(() => {
    sql.close();
  }).catch(err => {
    console.log(err);
  });
}

sql.on('error', err => {
  console.log(err);
});

module.exports = {
  fetchChunks,
  insertChunks,
  createChunkTable
}
