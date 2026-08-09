# Ramkumar R — Full Stack Engineer Portfolio

A modern, premium personal portfolio built to showcase my experience, technical skills, projects, achievements, and professional journey as a Full Stack Engineer.

The portfolio focuses on a **minimal luxury dark aesthetic**, smooth interactions, responsive layouts, and a performance-oriented architecture using React and TanStack Start.

## ✨ Features

* Premium dark/light theme
* Fully responsive design
* Smooth scrolling and animations
* Interactive hero section
* Professional experience timeline
* Skills and technology showcase
* Project portfolio with individual project pages
* Achievements section
* Contact section
* Dynamic project routes
* Custom 404/error handling
* SSR support with TanStack Start
* SEO-friendly route structure
* Tailwind CSS design system
* Reusable UI components
* Custom animations and visual effects
* Accessible and responsive UI

## 🛠️ Tech Stack

### Frontend

* React 19
* TypeScript
* TanStack Start
* TanStack Router
* Vite
* Tailwind CSS v4
* React Hook Form
* Lucide React
* Motion
* Lenis
* Recharts

### Styling

* Tailwind CSS
* CSS Custom Properties
* OKLCH color system
* Custom Tailwind utilities
* Responsive design
* CSS animations
* Glassmorphism effects
* Gradient effects

### Development

* ESLint
* TypeScript
* Vite
* npm
* Git

## 📁 Project Structure

```text
my-portfolio/
├── public/
│   ├── images/
│   └── ...
│
├── src/
│   ├── components/
│   │   └── site/
│   │       ├── Achievements.tsx
│   │       ├── Contact.tsx
│   │       ├── Experience.tsx
│   │       ├── Hero.tsx
│   │       ├── Projects.tsx
│   │       ├── SiteHeader.tsx
│   │       ├── SkillsOrbit.tsx
│   │       ├── TechStack.tsx
│   │       └── useLenis.ts
│   │
│   ├── lib/
│   │   ├── error-capture.ts
│   │   └── error-page.tsx
│   │
│   ├── routes/
│   │   ├── index.tsx
│   │   ├── work.$slug.tsx
│   │   └── ...
│   │
│   └── server.ts
│
├── vite.config.ts
├── tsconfig.json
├── eslint.config.ts
├── package.json
└── README.md
```

## 🎨 Design System

The portfolio uses a custom semantic design system rather than hardcoding colors throughout components.

### Color System

The theme is based around:

* Matte black backgrounds
* Premium white typography
* Electric blue primary accents
* Semantic foreground/background colors
* Surface and card colors
* Gradient highlights
* Subtle glow effects

Colors are defined using CSS variables and OKLCH values, allowing the theme to be changed centrally.

### Typography

The portfolio uses:

* **Sora** — Display headings
* **Manrope** — Body/UI text
* **JetBrains Mono** — Technical labels and metadata

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js installed.

Recommended:

```bash
node -v
npm -v
```

Node.js 22+ is recommended.

### Clone the repository

```bash
git clone https://github.com/ramkumar-r-alt/exact-screenshot.git
```

Navigate into the project:

```bash
cd exact-screenshot
```

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

The application will be available on the local Vite development server.

## 📜 Available Scripts

### Development

```bash
npm run dev
```

Starts the development server.

### Production Build

```bash
npm run build
```

Creates a production build.

### Development Build

```bash
npm run build:dev
```

Builds the application using development mode.

### Preview

```bash
npm run preview
```

Runs the production build locally.

### Lint

```bash
npm run lint
```

Runs ESLint across the project.

### Format

```bash
npm run format
```

Formats the project using Prettier.

## 🧭 Routing

The application uses **TanStack Router** with TanStack Start.

Example routes:

```text
/
```

Main portfolio page.

```text
/work/:slug
```

Individual project/case-study pages.

Project routes allow each project to have its own detailed presentation while maintaining the same overall portfolio experience.

## ⚡ Performance

Performance was considered throughout the application architecture.

Key areas include:

* Vite-based development and production builds
* Server-side rendering through TanStack Start
* Reusable React components
* Lazy/dynamic route loading
* Optimized animations
* Smooth scrolling using Lenis
* Minimal unnecessary dependencies
* Semantic CSS variables
* Efficient asset usage

## 🖥️ Responsive Design

The portfolio is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile

The layout adapts typography, spacing, navigation, project cards, and interactive sections based on viewport size.

## 🎬 Animations & Interactions

The portfolio includes custom interactions such as:

* Smooth scrolling
* Hero animations
* Floating elements
* Marquee animations
* Hover effects
* Gradient text
* Glow effects
* Glassmorphism
* Animated skill visualizations
* Scroll-based interactions

Animations also respect the user's reduced-motion preference.

## 🧩 Reusable Components

The UI is divided into reusable components instead of keeping the entire portfolio inside a single page.

Examples include:

```text
Hero
SiteHeader
Experience
Projects
TechStack
SkillsOrbit
Achievements
Contact
```

This makes individual sections easier to maintain and extend.

## 🛡️ Error Handling

The application includes a custom server entry for SSR error handling.

```text
src/server.ts
```

The server wrapper captures catastrophic SSR errors and renders a custom error page instead of exposing an unhandled server response.

## 🌗 Theme Support

The portfolio supports dark and light themes.

Dark mode uses the primary luxury matte-black design:

```text
#080808
```

while the light theme provides a clean, premium alternative.

Theme colors are controlled through CSS variables rather than component-level hardcoded colors.

## 📦 Production Build

To create a production build:

```bash
npm run build
```

Then preview it locally:

```bash
npm run preview
```

Before deployment, verify:

```bash
npm run lint
npm run build
```

## 🔧 Standalone Architecture

This project runs independently using:

```text
React
   ↓
TanStack Start
   ↓
TanStack Router
   ↓
Vite
   ↓
Tailwind CSS
```

There are no runtime dependencies on external website builders or hosted development platforms.

The application configuration is maintained directly within the repository.

## 📌 Future Improvements

Potential improvements include:

* Advanced SEO metadata
* Open Graph images
* Sitemap generation
* Analytics
* Blog/articles section
* More detailed project case studies
* Automated deployment
* Performance monitoring
* Accessibility auditing
* Additional interactive visualizations

## 👨‍💻 About Me

**Ramkumar R**

Full Stack Engineer focused on building modern, scalable web applications and user-focused digital products.

### Core Technologies

```text
React
Next.js
TanStack Start
TypeScript
Node.js
Express
PostgreSQL
MongoDB
Redis
RabbitMQ
AWS
Docker
Vite
Tailwind CSS
```

I enjoy working across the frontend and backend, designing reusable systems, optimizing application performance, and turning product ideas into production-ready applications.

## 📫 Contact

Email:

```text
ram232488@gmail.com
```

LinkedIn:

```text
https://www.linkedin.com/in/ramkumar-r-052b92179/
```

GitHub:

```text
https://github.com/ramkumar-r-alt
```

---

### License

This project is maintained as a personal portfolio project by **Ramkumar R**.
