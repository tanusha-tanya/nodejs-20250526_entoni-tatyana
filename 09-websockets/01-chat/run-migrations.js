const { DataSource } = require('typeorm');
const { User } = require('./dist/users/entities/user.entity.js');
const { Message } = require('./dist/chat/entities/message.entity.js');

const dataSource = new DataSource({
  type: "sqlite",
  database: "db.sqlite",
  entities: [User, Message],
  migrations: ["dist/migrations/*.js"],
});

async function runMigrations() {
  try {
    await dataSource.initialize();
    console.log('Data source initialized');
    
    await dataSource.runMigrations();
    console.log('Migrations completed successfully');
    
    await dataSource.destroy();
    console.log('Data source destroyed');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

runMigrations(); 