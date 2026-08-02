pipeline {
    agent any

    environment {
        IMAGE_NAME   = 'ps73171/employeehub-backend'
        IMAGE_TAG    = "${BUILD_NUMBER}"
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds') // Jenkins credentials ID
        SONAR_TOKEN  = credentials('sonar-token')
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo 'Building EmployeeHub application...'
                sh 'docker --version'
            }
        }

        stage('Test') {
            steps {
                echo 'Running application tests...'
                sh '''
                    cd backend
                    # example for Maven/Node - adjust as per your stack
                    # mvn test  OR  npm test
                '''
            }
        }

        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv('MySonarQubeServer') { // Jenkins > Configure System me define kiya hua name
                    sh '''
                        sonar-scanner \
                          -Dsonar.projectKey=employeehub-backend \
                          -Dsonar.sources=./backend \
                          -Dsonar.host.url=$SONAR_HOST_URL \
                          -Dsonar.login=$SONAR_TOKEN
                    '''
                }
            }
        }

        stage('Trivy Security Scan') {
            steps {
                sh '''
                    trivy image --exit-code 0 --severity HIGH,CRITICAL \
                    ${IMAGE_NAME}:${IMAGE_TAG} || true
                '''
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                    docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ./backend
                    docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest
                '''
            }
        }

        stage('Docker Push') {
            steps {
                sh '''
                    echo "$DOCKERHUB_CREDENTIALS_PSW" | docker login -u "$DOCKERHUB_CREDENTIALS_USR" --password-stdin
                    docker push ${IMAGE_NAME}:${IMAGE_TAG}
                    docker push ${IMAGE_NAME}:latest
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deployment stage will be configured after Kubernetes/Argo CD setup.'
                // Example (future):
                // sh 'kubectl set image deployment/employeehub-backend backend=${IMAGE_NAME}:${IMAGE_TAG}'
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'
        }
        success {
            echo 'EmployeeHub CI/CD Pipeline completed successfully!'
        }
        failure {
            echo 'EmployeeHub CI/CD Pipeline failed.'
        }
    }
}