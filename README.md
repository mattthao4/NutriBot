# NutriBot

A modern web application for meal planning, recipe management, and nutritional tracking. NutriBot helps users plan their meals, discover recipes, and maintain a healthy lifestyle through an intuitive and user-friendly interface.

## Features

- **Dashboard**: Overview of daily meals and nutritional information
- **Meal Planner**: Interactive calendar interface for planning meals
- **Recipe Management**: Browse, search, and save recipes
- **Shopping List**: Automatically generated shopping lists based on meal plans
- **Weekly Reports**: Track nutritional goals and meal planning progress
- **User Authentication**: Secure login system with persistent sessions

## Tech Stack

- **Frontend**: React.js
- **State Management**: Recoil
- **Routing**: React Router
- **Styling**: CSS with modern design principles
- **Icons**: Heroicons
- **Authentication**: Custom AuthContext with localStorage persistence

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── layout/        # Layout components (Header, etc.)
│   └── ui/            # UI components (Button, Card, etc.)
├── pages/             # Page components
│   ├── dashboard/     # Dashboard view
│   ├── meal-planner/  # Meal planning interface
│   ├── recipes/       # Recipe browsing and management
│   ├── recipe-details/# Individual recipe view
│   ├── shopping-list/ # Shopping list management
│   ├── weekly-report/ # Weekly progress tracking
│   └── login/         # Authentication page
├── recoil/            # State management atoms
├── styles/            # Global styles and themes
└── data/              # Static data and mock content
```

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view the application.

## Development

- The application uses React Router for navigation
- State management is handled through Recoil atoms
- Authentication state is persisted in localStorage
- Cross-tab synchronization is implemented for authentication state

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Authors

- **Matthew Thao** - *Initial work*
- **Eli Goldberger** - *Authentication system*
- **Daniel Bauer** - *UI/UX Design & Frontend Development*
- **Lukas Singer** - *Backend Integration & Data Management*

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React.js community for the amazing framework
- Heroicons for the beautiful icon set
- All contributors who have helped shape this project 