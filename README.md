# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/c834a780-9513-4106-a896-6f97468a1290

## Environment Variables

This project uses environment variables to manage configuration. Create a `.env` file in the project root with the following variables:

```
# GitHub Gist API Configuration
VITE_GITHUB_TOKEN=your_github_token
VITE_GIST_ID=your_gist_id
VITE_GIST_FILENAME=users.json

# Application Settings
VITE_APP_NAME=Mines-Hunt
```

**Note:** The GitHub token should have the `gist` scope enabled. If you encounter 403 Forbidden errors, check that your token is valid and has the correct permissions.

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/c834a780-9513-4106-a896-6f97468a1290) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

This project can be deployed using Lovable or Vercel.

### Using Lovable

Simply visit the [Lovable Project](https://lovable.dev/projects/c834a780-9513-4106-a896-6f97468a1290) and click on Share -> Publish.

### Using Vercel

This project is configured for easy deployment on Vercel.

1. **Push your code to a Git repository** (e.g., GitHub, GitLab, Bitbucket).
2. **Import your project into Vercel**:
   - Go to your Vercel dashboard and click "Add New... > Project".
   - Connect your Git provider and select your repository.
3. **Configure Project Settings**:
   - Vercel should automatically detect that this is a Vite project.
   - The `vercel.json` file in the project root provides the build configuration (build command `npm run build`, output directory `dist`, and rewrites for SPA).
   - **Environment Variables**: You will need to add the following environment variables in your Vercel project settings (Project > Settings > Environment Variables). These should match the ones in your local `.env` file:
     - `VITE_GITHUB_TOKEN`: Your GitHub personal access token with `gist` scope.
     - `VITE_GIST_ID`: The ID of your GitHub Gist used for storing user data.
     - `VITE_GIST_FILENAME`: The filename within the Gist (e.g., `users.json`).
     - `VITE_APP_NAME`: The name of your application (e.g., `Mines-Hunt`).
4. **Deploy**: Click the "Deploy" button. Vercel will build and deploy your project.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
