const { DataSource } = require('typeorm');
const { User } = require('./dist/users/entities/user.entity.js');
const bcrypt = require('bcrypt');

const dataSource = new DataSource({
  type: "sqlite",
  database: "db.sqlite",
  entities: [User],
});

async function testAuth() {
  try {
    await dataSource.initialize();
    console.log('Data source initialized');
    
    // Найдем пользователя john
    const user = await dataSource.getRepository(User).findOneBy({ username: 'john' });
    if (!user) {
      console.log('User john not found');
      return;
    }
    
    console.log('Found user:', {
      id: user.id,
      username: user.username,
      role: user.role,
      password: user.password ? 'set' : 'not set'
    });
    
    // Проверим пароль
    const isValid = await bcrypt.compare('passw0rd', user.password);
    console.log('Password validation result:', isValid);
    
    await dataSource.destroy();
    console.log('Data source destroyed');
  } catch (error) {
    console.error('Error testing auth:', error);
    process.exit(1);
  }
}

testAuth(); 