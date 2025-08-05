const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db.sqlite');

db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
  if (err) {
    console.error('Error getting tables:', err);
    return;
  }
  console.log('Tables in database:', tables);
  
  db.all("SELECT * FROM user", (err, users) => {
    if (err) {
      console.error('Error getting users:', err);
      return;
    }
    console.log('Users in user table:', users);
    db.close();
  });
}); 