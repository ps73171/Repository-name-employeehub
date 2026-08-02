pipeline {
agent any

```
environment {
    DOCKER_REGISTRY = "docker.io"
    DOCKERHUB_USER = "ps73171"

    BACKEND_IMAGE = "ps73171/employeehub-backend"
    FRONTEND_IMAGE = "ps73171/employeehub-frontend"

    IMAGE_TAG = "${BUILD_NUMBER}"
}

stages {

    stage('Checkout') {
        steps {
            echo '========================================'
            echo 'Checking out EmployeeHub source code'
            echo '========================================'

            checkout scm
        }
    }

    stage('Backend Test') {
        steps {
            echo 'Running backend Python syntax checks...'

            sh '''
                cd backend
                python3 -m compileall app
            '''
        }
    }

    stage('Frontend Test & Build') {
        steps {
            echo 'Installing frontend dependencies and building application...'

            sh '''
                cd frontend

                npm install

                npm run build
            '''
        }
    }

    stage('SonarQube Analysis') {
        steps {
            echo 'Running SonarQube code quality analysis...'

            sh '''
                echo "SonarQube analysis will run here"
                echo "SonarQube configuration will be connected in Jenkins"
            '''
        }
    }

    stage('Trivy Filesystem Scan') {
        steps {
            echo 'Running Trivy filesystem security scan...'

            sh '''
                trivy fs \
                --severity HIGH,CRITICAL \
                --exit-code 0 \
                .
            '''
        }
    }

    stage('Docker Build') {
        steps {
            echo 'Building EmployeeHub Docker images...'

            sh '''
                docker build \
                -t ${BACKEND_IMAGE}:${IMAGE_TAG} \
                -t ${BACKEND_IMAGE}:latest \
                ./backend

                docker build \
                -t ${FRONTEND_IMAGE}:${IMAGE_TAG} \
                -t ${FRONTEND_IMAGE}:latest \
                ./frontend
            '''
        }
    }

    stage('Trivy Docker Image Scan') {
        steps {
            echo 'Scanning backend Docker image...'

            sh '''
                trivy image \
                --severity HIGH,CRITICAL \
                --exit-code 0 \
                ${BACKEND_IMAGE}:${IMAGE_TAG}
            '''

            echo 'Scanning frontend Docker image...'

            sh '''
                trivy image \
                --severity HIGH,CRITICAL \
                --exit-code 0 \
                ${FRONTEND_IMAGE}:${IMAGE_TAG}
            '''
        }
    }

    stage('Docker Hub Push') {
        steps {
            echo 'Pushing Docker images to Docker Hub...'

            withCredentials([
                usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USERNAME',
                    passwordVariable: 'DOCKER_PASSWORD'
                )
            ]) {

                sh '''
                    echo "$DOCKER_PASSWORD" | docker login \
                    -u "$DOCKER_USERNAME" \
                    --password-stdin

                    docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                    docker push ${BACKEND_IMAGE}:latest

                    docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                    docker push ${FRONTEND_IMAGE}:latest

                    docker logout
                '''
            }
        }
    }

    stage('Deploy to Kubernetes') {
        steps {
            echo 'Deploying EmployeeHub to Kubernetes...'

            sh '''
                echo "Kubernetes deployment will be configured here."
                echo "Backend Image: ${BACKEND_IMAGE}:${IMAGE_TAG}"
                echo "Frontend Image: ${FRONTEND_IMAGE}:${IMAGE_TAG}"
            '''
        }
    }
}

post {

    success {
        echo '''
        ========================================
        EmployeeHub CI/CD Pipeline SUCCESS
        ========================================
        '''
    }

    failure {
        echo '''
        ========================================
        EmployeeHub CI/CD Pipeline FAILED
        Check Console Output
        ========================================
        '''
    }

    always {
        echo 'Pipeline execution completed.'
    }
}
```

}
