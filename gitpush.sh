#!/bin/bash

# Сообщение коммита
MSG=$1
if [ -z "$MSG" ]; then
    MSG="Автоматический коммит"
fi

# Проверка и инициализация git
if [ ! -d ".git" ]; then
    echo "Инициализация репозитория..."
    git init
fi

# Добавление всех файлов
git add .

# Коммит
git commit -m "$MSG"

# Проверка наличия origin
if ! git remote | grep -q origin; then
    echo "Репозиторий не привязан. Укажи URL GitHub:"
    read REPO
    git remote add origin "$REPO"
    git branch -M main
fi

# Пуш
git push -u origin main
