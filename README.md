# 💘 IfTheyDo - Prom Partner Matching Platform

A Tinder-like dating platform exclusively for Bennett University students to find their perfect prom partner. The platform uses Microsoft Azure authentication for secure, verified access and Neo4J graph database for intelligent matching.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Neo4j](https://img.shields.io/badge/Neo4j-008CC1?style=for-the-badge&logo=neo4j&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

- 🎓 **University-Exclusive Access**: Sign in using Bennett University Outlook email
- 🔐 **Secure Authentication**: Powered by Microsoft Azure AD (MSAL)
- 💕 **Swipe-Based Matching**: Tinder-style interface with react-tinder-card
- 📱 **Contact Exchange**: Matched partners receive each other's phone numbers
- 🌐 **Graph Database**: Neo4J for efficient relationship mapping
- 🎨 **Modern UI**: Built with TailwindCSS and Framer Motion animations
- 📸 **Profile Photos**: Cloudinary integration for image management
- ⚡ **Server-Side Rendering**: Next.js 16 with App Router

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 16.1.1
- **Language**: TypeScript 5
- **UI Library**: React 19.2.3
- **Styling**: TailwindCSS 4
- **Animations**: Framer Motion 12.29.2
- **Icons**: Lucide React, Heroicons
- **Components**: Headless UI, react-tinder-card

### Backend & Database
- **Database**: Neo4J (with neo4j-driver 6.0.1)
- **Authentication**: Microsoft Azure AD (@azure/msal-browser)
- **Image Storage**: Cloudinary
- **Deployment**: Cloudflare Pages compatible

### Development Tools
- ESLint 9
- React Compiler (Babel Plugin)
- TypeScript strict mode

## 📋 Prerequisites

- Node.js 20 or higher
- Neo4J database instance
- Microsoft Azure AD application (MSAL instance)
- Cloudinary account
- Bennett University Outlook email (for testing)

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone https://github.com/manashkhandelwal/promcom.git
cd promcom
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Neo4J Database
NEO4J_URI=your_neo4j_uri
NEO4J_USERNAME=your_neo4j_username
NEO4J_PASSWORD=your_neo4j_password

# Microsoft Azure AD (MSAL)
NEXT_PUBLIC_MSAL_CLIENT_ID=your_msal_client_id
NEXT_PUBLIC_MSAL_AUTHORITY=your_msal_authority
NEXT_PUBLIC_MSAL_REDIRECT_URI=your_redirect_uri

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
promcom/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Landing page
│   ├── layout.tsx         # Root layout
│   ├── neo4j.action.ts    # Neo4J database actions
│   ├── msal-provider.tsx  # MSAL authentication provider
│   ├── context/           # React context providers
│   ├── components/        # Shared components
│   └── globals.css        # Global styles
├── components/            # UI components
├── db/                    # Database configuration
├── lib/                   # Utility libraries
│   └── msal.ts           # MSAL configuration
├── types/                # TypeScript type definitions
├── public/               # Static assets
└── package.json          # Project dependencies
```

## 🎯 How It Works

1. **Authentication**: Students sign in using their Bennett University Outlook email via Microsoft Azure AD
2. **Profile Creation**: Users create profiles with photos, bio, hobbies, and contact information
3. **Matching Algorithm**: Neo4J graph database tracks LIKE/DISLIKE relationships
4. **Swiping**: Users swipe through potential matches who have no existing connection
5. **Match**: When two users like each other, they're matched and can exchange contact info
6. **Contact Exchange**: Matched partners receive each other's phone numbers

## 🗄️ Database Schema (Neo4J)

**Node: Student**
```
Properties:
- applicationId (unique)
- fullName
- age
- email
- phone
- bio
- hobbies
- photoUrl
- createdAt
```

**Relationships**
- `[:LIKE]` - User likes another user
- `[:DISLIKE]` - User dislikes another user
- When mutual `[:LIKE]` exists = MATCH

## 📜 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🔒 Security Features

- ✅ Encrypted data transmission
- ✅ Verified Bennett University email requirement
- ✅ Azure AD authentication
- ✅ Server-side validation
- ✅ Secure token management (JOSE)

## 🌐 Deployment

The application is configured for deployment on Cloudflare Pages using `@cloudflare/next-on-pages`.

**Deploy to Cloudflare:**
```bash
npm run build
# Follow Cloudflare Pages deployment steps
```

## 🤝 Contributing

This is a university project for Bennett University students. If you're a student and want to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is private and intended for Bennett University students only.

## 👨‍💻 Author

**Manash Khandelwal** - [@manashkhandelwal](https://github.com/manashkhandelwal)
**Akshat Saini** - [@S-m-a-r-t](https://github.com/S-m-a-r-t)


## 🙏 Acknowledgments

- Bennett University for providing the platform
- Microsoft Azure for authentication services
- Neo4J for graph database technology
- All students who helped test and improve the platform

## 📧 Contact

For questions or support, please contact through your Bennett University email.

---

**Note**: This platform is exclusively for Bennett University students. Valid university email authentication is required for access.
