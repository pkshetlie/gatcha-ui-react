#!/bin/bash

# Arrêter le script en cas d'erreur
set -e

# Chemin du projet sur le serveur
PROJECT_DIR="/var/www/html/gatcha.fr/waifu-ui"

# Aller dans le répertoire du projet
cd $PROJECT_DIR

# Mettre à jour le code source depuis le dépôt distant
echo "Pulling latest changes from Git repository..."
git pull origin master

# Installer ou mettre à jour les dépendances
echo "Installing/updating npm dependencies..."
npm install

# Créer les fichiers optimisés pour la production
echo "Building application for production..."
npm run build

# Vérifiez les permissions des fichiers générés, si nécessaire.
echo "Deployment complete. Files are ready!"
