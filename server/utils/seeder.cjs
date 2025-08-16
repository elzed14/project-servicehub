const mongoose = require('mongoose');
const User = require('../models/User.js');
const Service = require('../models/Service.js');
const Category = require('../models/Category.js');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

// Connexion à la base de données
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connexion à la base de données réussie');
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error.message);
    process.exit(1);
  }
};

// Fonction pour effacer toutes les collections
const clearDatabase = async () => {
  try {
    await mongoose.connection.db.collection('users').deleteMany({});
    await mongoose.connection.db.collection('services').deleteMany({});
    await mongoose.connection.db.collection('categories').deleteMany({});
    console.log('Base de données vidée');
  } catch (error) {
    console.error('Erreur lors de la suppression des données:', error.message);
  }
};

// Fonction pour créer des utilisateurs de test
const createTestUsers = async () => {
  try {
    const users = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        location: 'Paris, France',
        isAdmin: true,
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        location: 'Lyon, France',
      },
      {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        password: 'password123',
        location: 'Marseille, France',
      },
    ];

    for (const userData of users) {
      await mongoose.connection.db.collection('users').insertOne(userData);
    }
    console.log(`${users.length} utilisateurs créés`);
    return await mongoose.connection.db.collection('users').find().toArray();
  } catch (error) {
    console.error('Erreur lors de la création des utilisateurs:', error.message);
  }
};

// Fonction pour créer des catégories de test
const createTestCategories = async () => {
  try {
    const categories = [
      { name: 'Développement web' },
      { name: 'Design graphique' },
      { name: 'Marketing digital' },
      { name: 'Rédaction' },
      { name: 'Traduction' },
    ];

    for (const categoryData of categories) {
      await mongoose.connection.db.collection('categories').insertOne(categoryData);
    }
    console.log(`${categories.length} catégories créées`);
    return await mongoose.connection.db.collection('categories').find().toArray();
  } catch (error) {
    console.error('Erreur lors de la création des catégories:', error.message);
  }
};

// Fonction pour créer des services de test
const createTestServices = async (users, categories) => {
  try {
    const services = [
      {
        title: 'Développement de site web',
        description: 'Création de sites web personnalisés et réactifs.',
        price: 500,
        category: categories[0]._id,
        provider: users[0]._id,
      },
      {
        title: 'Conception de logo',
        description: 'Création de logos uniques pour votre marque.',
        price: 200,
        category: categories[1]._id,
        provider: users[1]._id,
      },
      {
        title: 'Campagne de marketing',
        description: 'Stratégies de marketing digital pour augmenter votre visibilité.',
        price: 1000,
        category: categories[2]._id,
        provider: users[2]._id,
      },
    ];

    for (const serviceData of services) {
      await mongoose.connection.db.collection('services').insertOne(serviceData);
    }
    console.log(`${services.length} services créés`);
  } catch (error) {
    console.error('Erreur lors de la création des services:', error.message);
  }
};

// Fonction principale pour initialiser la base de données
const initializeDatabase = async () => {
  await connectDB();

  // Effacer la base de données
  await clearDatabase();

  // Créer des utilisateurs, catégories et services
  const users = await createTestUsers();
  const categories = await createTestCategories();
  await createTestServices(users, categories);

  // Déconnexion de la base de données
  await mongoose.disconnect();
  console.log('Déconnexion de la base de données réussie');
};

// Exécuter le script
initializeDatabase();
