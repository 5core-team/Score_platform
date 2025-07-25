# SCORE - Plateforme d'Évaluation de Risques

SCORE est une plateforme sophistiquée conçue pour évaluer la solvabilité des individus et gérer les engagements financiers au Bénin. Cette application web moderne utilise React, TypeScript, et Tailwind CSS pour offrir une expérience utilisateur optimale.

![SCORE Platform Preview](src/assets/app-preview.png)

## 🚀 Fonctionnalités

- 🔐 Authentification multi-niveaux (Admin, Conseiller financier, Huissier)
- 📊 Tableau de bord interactif avec visualisations de données
- 🗺️ Cartographie des zones avec React Leaflet
- 📱 Interface responsive (mobile, tablet, desktop)
- 🔔 Système de notifications en temps réel
- 👥 Gestion complète des utilisateurs
- 💰 Suivi des transactions et des dettes
- 🌍 Gestion des zones géographiques

## 🛠️ Technologies

- **Frontend Framework:** React 18 avec TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Cartographie:** React Leaflet
- **Graphiques:** Recharts
- **Icons:** Lucide React
- **Routing:** React Router v6
- **Build Tool:** Vite

## 📦 Structure du Projet

```
score-platform/
├── src/
│   ├── components/         # Composants réutilisables
│   │   ├── dashboard/     # Composants spécifiques au tableau de bord
│   │   ├── layouts/       # Layouts réutilisables
│   │   └── ...
│   ├── context/          # Contextes React (Auth, etc.)
│   ├── pages/            # Composants de pages
│   ├── assets/           # Resources statiques
│   └── styles/           # Styles globaux
├── public/              # Fichiers publics
└── ...
```

## 🚀 Installation

1. Cloner le repository:
```bash
git clone https://github.com/votre-username/score-platform.git
cd score-platform
```

2. Installer les dépendances:
```bash
npm install
```

3. Lancer le serveur de développement:
```bash
npm run dev
```

## 🔧 Configuration

### Environnement

Créez un fichier `.env` à la racine du projet:

```env
VITE_API_URL=votre_url_api
VITE_MAP_TOKEN=votre_token_carte
```

### Authentification

Le système d'authentification est géré via `AuthContext`. Pour modifier les règles:

1. Ouvrir `src/context/AuthContext.tsx`
2. Ajuster les rôles et permissions selon vos besoins

## 🎨 Personnalisation

### Thème

Le thème est configurable dans `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: {...},
      secondary: {...},
      // Ajouter vos couleurs
    }
  }
}
```

### Composants

Chaque composant suit une structure modulaire:

```tsx
interface ComponentProps {
  // Props typées
}

const Component: React.FC<ComponentProps> = ({ ...props }) => {
  // Logique du composant
};
```

## 📱 Responsive Design

L'application utilise une approche mobile-first avec des breakpoints Tailwind:

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🗺️ Cartographie

La carte utilise React Leaflet. Pour modifier:

1. Ouvrir `src/components/dashboard/MapComponent.tsx`
2. Ajuster les coordonnées et marqueurs

## 📊 Visualisation des Données

Les graphiques sont créés avec Recharts. Exemple:

```tsx
<LineChart data={data}>
  <XAxis dataKey="name" />
  <YAxis />
  <Line type="monotone" dataKey="value" />
</LineChart>
```

## 🔐 Sécurité

- Routes protégées via `ProtectedRoute`
- Validation des formulaires
- Gestion sécurisée des tokens
- Sanitization des données

## 🌐 API Integration

### Configuration du Backend

1. Créer un fichier `.env`:
```env
VITE_API_URL=http://votre-api.com/api/v1
```

2. Structure des endpoints API:

```typescript
// Authentification
POST /api/v1/auth/login
POST /api/v1/auth/register
POST /api/v1/auth/logout

// Utilisateurs
GET /api/v1/users
POST /api/v1/users
PUT /api/v1/users/:id
DELETE /api/v1/users/:id

// Dettes
GET /api/v1/debts
POST /api/v1/debts
PUT /api/v1/debts/:id
DELETE /api/v1/debts/:id

// Zones
GET /api/v1/zones
POST /api/v1/zones
PUT /api/v1/zones/:id
POST /api/v1/zones/:id/assign

// Statistiques
GET /api/v1/stats/dashboard
GET /api/v1/stats/country/:country
GET /api/v1/stats/licenses
```

### Exemple d'intégration

```typescript
// Récupération des statistiques
const fetchDashboardStats = async () => {
  try {
    const response = await statsAPI.getDashboardStats();
    setDashboardData(response.data);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
  }
};

// Création d'un utilisateur
const createUser = async (userData) => {
  try {
    const response = await usersAPI.create(userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la création');
  }
};
```

### Gestion des erreurs

```typescript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Rediriger vers la page de connexion
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 🧪 Tests

```bash
npm run test        # Exécuter les tests
npm run test:watch  # Mode watch
```

## 📦 Build Production

```bash
npm run build
```

Les fichiers de production seront générés dans `dist/`.

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Conventions de Code

- Utiliser TypeScript strict
- Suivre ESLint et Prettier
- Nommer les composants en PascalCase
- Utiliser des interfaces pour les props
- Documenter les fonctions complexes

## 📚 Documentation Complémentaire

- [React Documentation](https://reactjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)

## 📄 License

MIT License - voir [LICENSE.md](LICENSE.md)

## 👥 Auteurs

- **Christ_Hounkanrin** - *Score_front* - [christh2](https://github.com/christh2)

## 🙏 Remerciements

- Équipe de développement
- Contributeurs
- Utilisateurs beta-testeurs