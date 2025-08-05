const { DataSource } = require('typeorm');
const { User } = require('./dist/users/entities/user.entity.js');

const dataSource = new DataSource({
  type: "sqlite",
  database: "db.sqlite",
  entities: [User],
});

async function checkUsers() {
  try {
    await dataSource.initialize();
    console.log('Data source initialized');
    
    const users = await dataSource.getRepository(User).find();
    console.log('Users in database:');
    users.forEach(user => {
      console.log(`- ID: ${user.id}, Username: ${user.username}, Role: ${user.role}, Password: ${user.password ? 'set' : 'not set'}`);
    });
    
    await dataSource.destroy();
    console.log('Data source destroyed');
  } catch (error) {
    console.error('Error checking users:', error);
    process.exit(1);
  }
}

checkUsers(); 