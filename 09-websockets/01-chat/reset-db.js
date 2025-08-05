const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// Удаляем файл базы данных если он существует
if (fs.existsSync('./db.sqlite')) {
  fs.unlinkSync('./db.sqlite');
  console.log('Database file deleted');
}

// Создаем новую базу данных
const db = new sqlite3.Database('./db.sqlite');
console.log('New database created');

db.close();
console.log('Database reset completed'); 