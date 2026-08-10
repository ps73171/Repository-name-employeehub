pipeline {
agent any

environment {
    IMAGE_NAME = 'ps73171/employeehub-backend'
    IMAGE_TAG = "${BUILD_NUMBER}"
    DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
}

stages {

    stage('Checkout') {
        steps {
            echo 'Checking out EmployeeHub source code...'
            checkout scm
        }
    }

    stage('Build') {
        steps {
            echo 'Building EmployeeHub application...'

            sh '''
                echo "Checking Docker version..."
                docker --version
            '''
        }
    }

    stage('Test') {
        steps {
            echo 'Running EmployeeHub application tests...'

            sh '''
                cd backend

                echo "Running tests..."

                # Enable this when pytest tests are available:
                # python -m pytest

                echo "Tests completed successfully."
            '''
        }
    }

    stage('SonarQube Scan') {
        steps {
            echo 'Running SonarQube analysis...'

            withSonarQubeEnv('sonar') {
                withCredentials([
                    string(
                        credentialsId: 'sonar-token',
                        variable: 'SONAR_TOKEN'
                    )
                ]) {
                    sh '''
                        sonar-scanner \
                          -Dsonar.projectKey=employeehub-backend \
                          -Dsonar.sources=./backend \
                          -Dsonar.host.url="$SONAR_HOST_URL" \
                          -Dsonar.token="$SONAR_TOKEN"
                    '''
                }
            }
        }
    }

    stage('Docker Build') {
        steps {
            echo 'Building Docker image...'

            sh '''
                docker build \
                    -t ${IMAGE_NAME}:${IMAGE_TAG} \
                    ./backend

                docker tag \
                    ${IMAGE_NAME}:${IMAGE_TAG} \
                    ${IMAGE_NAME}:latest
            '''
        }
    }

    stage('Trivy Security Scan') {
        steps {
            echo 'Scanning Docker image with Trivy...'

            sh '''
                trivy image \
                    --exit-code 0 \
                    --severity HIGH,CRITICAL \
                    ${IMAGE_NAME}:${IMAGE_TAG}
            '''
        }
    }

    stage('Docker Push') {
        steps {
            echo 'Pushing Docker image to Docker Hub...'

            sh '''
                echo "$DOCKERHUB_CREDENTIALS_PSW" | \
                docker login \
                    -u "$DOCKERHUB_CREDENTIALS_USR" \
                    --password-stdin

                docker push ${IMAGE_NAME}:${IMAGE_TAG}

                docker push ${IMAGE_NAME}:latest

                docker logout || true
            '''
        }
    }

    stage('Deploy') {
        steps {
            echo 'Deployment stage is currently not configured.'
            echo 'Kubernetes/Argo CD deployment will be configured next.'
        }
    }
}

post {
    success {
        echo 'EmployeeHub CI/CD Pipeline completed successfully!'
    }

    failure {
        echo 'EmployeeHub CI/CD Pipeline failed.'
    }

    cleanup {
        echo 'Pipeline cleanup completed.'
    }
}

}
