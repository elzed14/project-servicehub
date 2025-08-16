import express from 'express';

const router = express.Router();

// Mock users storage
let mockUsers = [
  {
    id: '1',
    name: 'Marie Dubois',
    email: 'marie.dubois@email.com',
    password: '$2a$10$mockhashedpassword',
    location: 'Paris, France',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150',
    rating: 4.8,
    reviews: 24,
    bio: 'Développeuse web passionnée'
  }
];

// Test register endpoint
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, location } = req.body;

    // Check if user already exists
    const existingUser = mockUsers.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Un utilisateur avec cet email existe déjà'
      });
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: '$2a$10$mockhashedpassword', // Mock hashed password
      location: location || 'Non spécifié',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3B82F6&color=fff`,
      rating: 5.0,
      reviews: 0,
      bio: ''
    };

    mockUsers.push(newUser);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      token: 'mock-jwt-token-' + newUser.id,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de l\'inscription'
    });
  }
});

// Test login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = mockUsers.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Email ou mot de passe incorrect'
      });
    }

    // Mock password check (in real app, use bcrypt)
    if (password !== '123456') {
      return res.status(401).json({
        success: false,
        error: 'Email ou mot de passe incorrect'
      });
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      token: 'mock-jwt-token-' + user.id,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la connexion'
    });
  }
});

// Test me endpoint
router.get('/me', (req, res) => {
  // Mock authentication check
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Token manquant'
    });
  }

  const token = authHeader.substring(7);
  const userId = token.replace('mock-jwt-token-', '');
  const user = mockUsers.find(u => u.id === userId);

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Token invalide'
    });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({
    success: true,
    user: userWithoutPassword
  });
});

export default router;