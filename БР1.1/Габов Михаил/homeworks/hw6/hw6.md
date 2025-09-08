## Первичная настройка

Сперва создал пару ssh ключей на сервере и авторизовал публичный

![image](assets/image.png)

Сделал 4 публичных репозитория на Docker Hub под каждый микросервис

![alt text](assets/image2.png)

Затем передал ключи и пароли в Github Actions

![alt text](assets/image3.png)

## Создание Workflow файла

При создании файла учитываю, что `working-directory` находится не в корне проекта, а в lab4

deploy.yml

```yaml
name: Deploy Lab4 Project

on:
  push:
    branches: [ "main" ]
    paths:
      - 'ITMO-ACS-Backend-2025/БР1.1/Габов Михаил/labs/lab4/**'

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    
    defaults:
      run:
        working-directory: './ITMO-ACS-Backend-2025/БР1.1/Габов Михаил/labs/lab4'
        
    strategy:
      matrix:
        service: [api-gateway, auth-users, recipes, interactions]

    steps:
    - name: Checkout repository
      uses: actions/checkout@v3

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2

    - name: Log in to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKERHUB_USERNAME }}
        password: ${{ secrets.DOCKERHUB_TOKEN }}

    - name: Build and push Docker image for ${{ matrix.service }}
      uses: docker/build-push-action@v4
      with:
        context: .
        file: './ITMO-ACS-Backend-2025/БР1.1/Габов Михаил/labs/lab4/services/${{ matrix.service }}/Dockerfile'
        push: true
        tags: ${{ secrets.DOCKERHUB_USERNAME }}/${{ matrix.service }}:latest

  deploy:
    runs-on: ubuntu-latest
    needs: build-and-push

    steps:
    - name: Deploy to Server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USERNAME }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          cd ~/"ITMO_BACKEND/ITMO-ACS-Backend-2025/БР1.1/Габов Михаил/labs/lab4"
          docker-compose pull
          docker-compose down
          docker-compose up -d
```

Изменения на main запустят сборку проекта

для каждого из 4-х микросервисов заменил блок build на блок image

    image: mgd2003d/auth-users-service:latest