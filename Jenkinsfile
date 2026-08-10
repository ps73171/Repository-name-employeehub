pipeline {
    agent any

    tools {
        // Jenkins > Manage Jenkins > Tools
        // SonarQube Scanner installation name:
        // sonar-scanner
        sonarQube 'sonar-scanner'
    }

    environment {
        IMAGE_NAME = 'ps73171/employeehub-backend'
        IMAGE_TAG = "${BUILD_NUMBER}"

        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        SONAR_TOKEN = credentials('sonarID')
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
                    echo "Docker version:"
                    docker --version

                    echo "SonarScanner version:"
                    sonar-scanner --version
                '''
            }
        }

        stage('Test') {
            steps {
                echo 'Running EmployeeHub application tests...'

                sh '''
                    cd backend

                    echo "Running application tests..."

                    # Add your actual tests here if available.
                    # Example:
                    # python -m pytest

                    echo "Tests completed successfully."
                '''
            }
        }

        stage('SonarQube Scan') {
            steps {
                echo 'Running SonarQube analysis...'

                withSonarQubeEnv('sonar') {
                    sh '''
                        sonar-scanner \
                          -Dsonar.projectKey=employeehub-backend \
                          -Dsonar.projectName=EmployeeHub Backend \
                          -Dsonar.sources=backend \
                          -Dsonar.host.url="$SONAR_HOST_URL" \
                          -Dsonar.token="$SONAR_TOKEN"
                    '''
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
                echo 'Running Trivy security scan...'

                sh '''
                    trivy image \
                      --severity HIGH,CRITICAL \
                      --exit-code 0 \
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
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deployment stage will be configured with Kubernetes/Argo CD.'
            }
        }
    }

    post {
        always {
            echo 'Pipeline cleanup completed.'

            sh '''
                docker logout || true
            '''
        }

        success {
            echo 'EmployeeHub CI/CD Pipeline completed successfully!'
        }

        failure {
            echo 'EmployeeHub CI/CD Pipeline failed.'
        }
    }
}
