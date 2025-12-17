#!/bin/bash

# Скрипт для деплоя на GitHub Pages
# Использование: ./scripts/deploy.sh "commit message"

set -e  # Остановить при ошибке

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Начинаем деплой на GitHub Pages...${NC}"

# Проверяем, что мы в корне проекта
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Ошибка: Запустите скрипт из корня проекта${NC}"
    exit 1
fi

# Проверяем, что есть изменения для коммита
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}ℹ️  Нет изменений для коммита${NC}"
else
    # Коммитим изменения в текущую ветку
    COMMIT_MSG=${1:-"Update for deployment"}
    echo -e "${YELLOW}📝 Коммитим изменения: ${COMMIT_MSG}${NC}"
    git add .
    git commit -m "$COMMIT_MSG"
fi

# Получаем текущую ветку
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${YELLOW}📍 Текущая ветка: ${CURRENT_BRANCH}${NC}"

# Если мы не в main, пушим текущую ветку
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    echo -e "${YELLOW}⬆️  Пушим изменения в ветку ${CURRENT_BRANCH}${NC}"
    git push origin "$CURRENT_BRANCH"
fi

# Переключаемся на main и пушим (если нужно)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    echo -e "${YELLOW}🔄 Переключаемся на main${NC}"
    git checkout main
    git merge "$CURRENT_BRANCH"
    git push origin main
fi

# Переключаемся на deploy ветку
echo -e "${YELLOW}🔄 Переключаемся на ветку deploy${NC}"

# Проверяем, существует ли ветка deploy
if git show-ref --verify --quiet refs/heads/deploy; then
    git checkout deploy
else
    echo -e "${YELLOW}🆕 Создаем ветку deploy${NC}"
    git checkout -b deploy
fi

# Мержим изменения из main
echo -e "${YELLOW}🔀 Мержим изменения из main в deploy${NC}"
git merge main

# Пушим в deploy ветку
echo -e "${YELLOW}⬆️  Пушим в ветку deploy${NC}"
git push origin deploy

# Возвращаемся на исходную ветку
if [ "$CURRENT_BRANCH" != "deploy" ]; then
    echo -e "${YELLOW}🔄 Возвращаемся на ветку ${CURRENT_BRANCH}${NC}"
    git checkout "$CURRENT_BRANCH"
fi

echo -e "${GREEN}✅ Деплой запущен! Проверьте GitHub Actions для статуса сборки.${NC}"
echo -e "${GREEN}🌐 Сайт будет доступен через 2-3 минуты по адресу:${NC}"
echo -e "${GREEN}   https://$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\)\/\([^.]*\).*/\1.github.io\/\2/')/${NC}"