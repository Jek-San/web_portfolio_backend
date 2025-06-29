const prisma = require('../models/client');

(async () => {
  await prisma.project.createMany({
    data: [
      {
        title: 'Nuxt Portfolio',
        slug: 'nuxt-portfolio',
        description: 'A personal portfolio built with Nuxt 3 and Tailwind CSS.',
        content: `
## Why I Built This

I wanted a clean and modern way to showcase my work and skills as a web developer.

## Features

- Built with Nuxt 3
- Responsive design
- Dark mode
- Deployed on Netlify

## What I Learned

Creating reusable components, working with Nuxt routing, and integrating backend APIs.
        `,
        imageUrl: '/uploads/projects/nuxt-portfolio/thumb.jpg',
        images: [
          '/uploads/projects/nuxt-portfolio/screen1.jpg',
          '/uploads/projects/nuxt-portfolio/screen2.jpg'
        ],
        tags: ['Nuxt 3', 'Tailwind', 'Vue'],
        link: 'https://yourportfolio.com',
        repo: 'https://github.com/yourusername/portfolio',
        createdAt: new Date()
      },
      {
        title: 'POS Web App',
        slug: 'pos-webapp',
        description: 'A point-of-sale system with inventory and reports.',
        content: `
## About This Project

I built this POS web app as a practical system to manage small store inventory and transactions.

## Stack

- .NET Backend
- Vue Frontend
- MySQL Database

## Challenge

Building a custom sales report system with filters and charting.
        `,
        imageUrl: '/uploads/projects/pos-webapp/thumb.jpg',
        images: [
          '/uploads/projects/pos-webapp/screen1.jpg',
          '/uploads/projects/pos-webapp/screen2.jpg'
        ],
        tags: ['.NET', 'Vue', 'MySQL'],
        link: '',
        repo: 'https://github.com/yourusername/pos-app',
        createdAt: new Date()
      }
    ]
  });

  console.log('Dummy projects inserted');
})();
