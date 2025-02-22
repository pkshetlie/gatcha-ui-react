#!/bin/bash

# Arrêter le script en cas d'erreur
set -e

# Définir le répertoire exact du projet
PROJECT_DIR="/var/www/html/gatcha.fr/waifu-ui"

# Aller dans le bon dossier
cd $PROJECT_DIR

# Vérifier si nous sommes dans le bon répertoire
echo "Dossier actuel : $(pwd)"

# Mettre à jour le code source (si nécessaire)
git fetch origin main
git reset --hard origin/main

# Installer les dépendances
npm install --force

# Construire le projet
echo "Création du build pour le projet React..."
npm run build

echo "Build terminé avec succès."
