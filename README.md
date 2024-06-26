
# Radancy banner projects

Dit project is een prototype voor een projectmanagement applicatie die bedoeld is voor intern gebruik bij Radancy. Deze applicatie is afgesteld op het realisatieproces van online reclamebanners die bij Radancy gemaakt worden. Met deze applicatie kunnen de projectdetails, statussen, aangeleverde materialen en opgeleverd werk van projecten bekeken worden en nieuwe projecten worden aangemaakt. De applicatie is afgesteld om te werken alleen tijdens het realisatieproces van banners en dient als een proof of concept. 

## Installatie

Volg deze stappen om het project lokaal op te zetten.

### Vereisten

- Node.js (versie 14 of hoger)
- npm (versie 6 of hoger) of yarn

### Stap-voor-stap installatie

1. Clone de repository
    ```sh
    git clone <repository-url>
    cd <repository-map>
    ```

2. Installeer de benodigde dependencies
    ```sh
    npm install
    ```
    of als je yarn gebruikt:
    ```sh
    yarn install
    ```

3. Start de ontwikkelserver
    ```sh
    npm run dev
    ```
    of als je yarn gebruikt:
    ```sh
    yarn dev
    ```

4. Start de lokaal gesimuleerde backend server
    ```sh
    npm run json-server



De applicatie zou nu lokaal beschikbaar moeten zijn op `localhost:3000`.
De gesimuleerde backend is te zien op `localhost:4000`

## Projectstructuur

Een overzicht van de belangrijkste mappen en bestanden in het project:

```
project-map/
├── assets/
│   └── css/
│       └── tailwind.css
├── components/
│   ├── CommonLayout.vue
│   ├── Header.vue
│   ├── ProfileAvatar.vue
│   ├── ProjectBlock.vue
│   ├── ProjectCard.vue
│   └── ProjectDetails.vue
├── pages/
│   ├── create-project.vue
│   ├── index.vue
│   ├── my-projects.vue
│   └── projects/
│       └── [id].vue
├── server/
│   ├── db.json
│   └── index.js
├── utils/
│   └── profileManager.js
├── app.vue
├── nuxt.config.ts
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## Pagina's

### Homepagina (`pages/index.vue`)

De startpagina van de applicatie. Hier word een overzicht weergegeven van alle projecten.

### Mijn Projecten (`pages/my-projects.vue`)

Een overzicht van alle projecten waar de huidige gebruiker op aangewezen staat. 

### Project Aanmaken (`pages/create-project.vue`)

Een formulier om een nieuw project aan te maken. Als aanmaker van het project word het huidige profiel toegevoegd aan het project als projectmanager.

### Project Details (`pages/projects/[id].vue`)

Detailpagina voor een specifiek project. De `[id]` in de bestandsnaam betekent dat dit een dynamische route is op basis van het project-ID.

## Componenten

### CommonLayout.vue

Een layout component dat gemeenschappelijke structuur en stijl definieert voor de pagina's.

### Header.vue

Een header component dat op elke pagina verschijnt en de navigatie bevat.

### ProfileAvatar.vue

Een component om de profielfoto van een gebruiker weer te geven.

### ProjectBlock.vue

Een component waarin details staan van een project. Een ProjectBlok kan in/uit-geklapt worden. 

### ProjectCard.vue

Een herbruikbaar component voor het weergeven van projectinformatie in een lijst op index.vue en my-projects.vue.

## Backend

### Server Configuratie (`server/index.js`)

De backend van dit project is opgezet met behulp van een locale json server. De server maakt gebruik van de `db.json` om een RESTful API te simuleren. Dit is handig voor prototyping en eenvoudige projecten.
Verdere documentatie over deze backend is te vinden op: `https://github.com/typicode/json-server`.

### Database (`server/db.json`)

De database wordt gesimuleerd met een JSON-bestand. Dit bestand bevat voorbeeldgegevens voor gebruikers, projecten en beschikbare platformen en de formaten die daarbij horen voor banners. Hier is een voorbeeld van de structuur:

```json
{
  "users": [
    {
      "id": 1,
      "name": "Gebruiker 1",
      "email": "gebruiker1@example.com"
    },
    {
      "id": 2,
      "name": "Gebruiker 2",
      "email": "gebruiker2@example.com"
    }
  ],
  "projects": [
    {
      "id": "ProjectId",
      "name": "Project name/code",
      "client": "klantnaam",
      "group": "projectgroup name",
      "dueDate": "2024-04-25",
      "description": "Projectbeschrijving",
      "members": [
        {
          "id": "4",
          "name": "User 4",
          "icon": "/profile-icons/ad.png",
          "role": "Project Manager"
        },
        {
          "id": "6",
          "name": "User 6",
          "icon": "/profile-icons/sb.png",
          "role": "Designer"
        },
        {
          "id": "8",
          "name": "User 89",
          "icon": "/profile-icons/dd.png",
          "role": "Ontwikkelaar"
        }
      ],
      "materials": [
        {
          "name": "Materiaal 1",
          "reference": "Materiaal1.com"
        }
      ],
      "platforms": [
        {
          "name": "Qompas",
          "type": "Top Banner",
          "formats": [
            "980x100"
          ]
        },
        {
          "name": "Adform",
          "type": "HTML ad",
          "formats": [
            "300x250",
            "336x280",
            "160x600",
            "320x100"
          ]
        },
        {
          "name": "Youtube Ads",
          "type": "HTML ad",
          "formats": [
            "556x280",
            "300x600",
            "970x250",
            "800x300"
          ]
        }
      ]
    }
  ],
  "platforms": [
    {
      "name": "Adform",
      "type": "HTML ad",
      "formats": [
        "300x250",
        "336x280",
        "160x600",
        "300x600",
        "970x250",
        "320x100"
      ]
    },
    {
      "name": "Qompas",
      "type": "Top Banner",
      "formats": [
        "980x100",
        "750x420"
      ]
    },
    {
      "name": "Qompas mail",
      "type": "Direct mail",
      "formats": [
        "600x250",
        "450x260"
      ]
    },
    {
      "name": "Youtube Ads",
      "type": "HTML ad",
      "formats": [
        "300x250",
        "556x280",
        "300x600",
        "970x250",
        "800x300"
      ]
    }
  ]
}
```

### API Endpoints

De volgende API endpoints zijn beschikbaar:

- `GET /users` - Haalt alle gebruikers op
- `GET /users/{id}` - Haalt een specifieke gebruiker op
- `GET /projects` - Haalt alle projecten op
- `GET /projects/{id}` - Haalt een specifiek project op
- `POST /projects` - Maakt een nieuw project aan
- `PUT /projects/{id}` - Bewerkt een bestaand project
- `DELETE /projects/{id}` - Verwijdert een project

### ProfileManager (`utils/profileManager.js`)

Bevat functies voor het beheren van gebruikersprofielen en het lokaal opslaan van het huidige profiel.

## Configuratie Bestanden

### nuxt.config.ts

Configuratiebestand voor Nuxt.js.

### tailwind.config.js

Configuratiebestand voor Tailwind CSS.

### tsconfig.json

TypeScript configuratiebestand.

## Stijlen

### Tailwind CSS (`assets/css/tailwind.css`)

Tailwind CSS-bestand voor het beheren van de stijlen binnen het project.
