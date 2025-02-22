#!/bin/bash

# Répertoire du projet
PROJECT_DIR=/var/www/html/gatcha.fr/waifu/ui

# Aller dans le répertoire du projet
cd $PROJECT_DIR

# Tirer les dernières modifications de GitHub
echo "Pulling latest changes from GitHub..."
git reset --hard
git pull origin master

# Installer les dépendances
echo "Installing dependencies..."
npm install

# Générer le build de production
echo "Building the React project..."
npm run build

# Copier le build vers un répertoire public (optionnel)
echo "Deploying the build to /var/www/html/gatcha.fr/waifu/ui"
cp -R build/* /var/www/html/gatcha.fr/waifu/ui

# Redémarrer le serveur web si nécessaire (ex: Nginx, Apache)
# Pour Nginx, aucune action n'est nécessaire si le fichier est statique
# Pour PM2, redémarrez tout service Node.js
# Uncomment si utilisé par votre projet
# pm2 restart all

echo "Deployment complete!"
