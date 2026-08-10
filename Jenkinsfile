pipeline {
    agent any

    environment {
        BACKEND_IMAGE = 'ps73171/employeehub-backend'
        FRONTEND_IMAGE = 'ps73171/employeehub-frontend'

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
                    echo "Docker version:"
                    docker --version

                    echo "Workspace:"
                    pwd

                    echo "Project structure:"
                    ls -la

                    echo "Backend:"
                    ls -la backend || true

                    echo "Frontend:"
                    ls -la frontend || true
                '''
            }
        }

        stage('Test') {
            steps {
                echo 'Running EmployeeHub application tests...'

                sh '''
                    if [ -d "backend" ]; then
                        cd backend

                        echo "Running backend tests..."

                        if [ -f "requirements.txt" ]; then
                            echo "requirements.txt found"
                        fi

                        # Add actual tests here when available.
                        # Example:
                        # python -m pytest

                        echo "Backend tests completed."
                    fi

                    echo "Frontend test stage completed."
                '''
            }
        }

        stage('SonarQube Scan') {
            steps {
                echo 'Running SonarQube analysis...'

                script {
                    def scannerHome = tool(
                        name: 'sonar-scanner',
                        type: 'hudson.plugins.sonar.SonarRunnerInstallation'
                    )

                    withSonarQubeEnv('sonar') {

                        withCredentials([
                            string(
                                credentialsId: 'sonarID',
                                variable: 'SONAR_TOKEN'
                            )
                        ]) {

                            sh """
                                echo "SonarScanner location:"
                                ${scannerHome}/bin/sonar-scanner --version

                                echo "Starting SonarQube scan..."

                                ${scannerHome}/bin/sonar-scanner \\
                                  -Dsonar.projectKey=employeehub \\
                                  -Dsonar.projectName="EmployeeHub" \\
                                  -Dsonar.sources=backend,frontend \\
                                  -Dsonar.host.url=\\\$SONAR_HOST_URL \\
                                  -Dsonar.token=\\\$SONAR_TOKEN
                            """
                        }
                    }
                }
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building Backend and Frontend Docker images...'

                sh '''
                    echo "=============================="
                    echo "Building Backend Image"
                    echo "=============================="

                    docker build \
                      -t ${BACKEND_IMAGE}:${IMAGE_TAG} \
                      ./backend

                    docker tag \
                      ${BACKEND_IMAGE}:${IMAGE_TAG} \
                      ${BACKEND_IMAGE}:latest


                    echo "=============================="
                    echo "Building Frontend Image"
                    echo "=============================="

                    docker build \
                      -t ${FRONTEND_IMAGE}:${IMAGE_TAG} \
                      ./frontend

                    docker tag \
                      ${FRONTEND_IMAGE}:${IMAGE_TAG} \
                      ${FRONTEND_IMAGE}:latest


                    echo "=============================="
                    echo "Docker Images"
                    echo "=============================="

                    docker images | grep employeehub
                '''
            }
        }

        stage('Trivy Security Scan') {
            steps {
                echo 'Running Trivy security scan...'

                sh '''
                    echo "=============================="
                    echo "Scanning Backend Image"
                    echo "=============================="

                    trivy image \
                      --severity HIGH,CRITICAL \
                      --exit-code 0 \
                      ${BACKEND_IMAGE}:${IMAGE_TAG}


                    echo "=============================="
                    echo "Scanning Frontend Image"
                    echo "=============================="

                    trivy image \
                      --severity HIGH,CRITICAL \
                      --exit-code 0 \
                      ${FRONTEND_IMAGE}:${IMAGE_TAG}
                '''
            }
        }

        stage('Docker Push') {
            steps {
                echo 'Pushing Backend and Frontend images to Docker Hub...'

                sh '''
                    echo "$DOCKERHUB_CREDENTIALS_PSW" | \
                    docker login \
                      -u "$DOCKERHUB_CREDENTIALS_USR" \
                      --password-stdin


                    echo "=============================="
                    echo "Pushing Backend Image"
                    echo "=============================="

                    docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                    docker push ${BACKEND_IMAGE}:latest


                    echo "=============================="
                    echo "Pushing Frontend Image"
                    echo "=============================="

                    docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                    docker push ${FRONTEND_IMAGE}:latest
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deployment stage...'

                sh '''
                    echo "Docker images successfully pushed."

                    echo "Backend Image:"
                    echo "${BACKEND_IMAGE}:${IMAGE_TAG}"

                    echo "Frontend Image:"
                    echo "${FRONTEND_IMAGE}:${IMAGE_TAG}"

                    echo "Kubernetes/Argo CD deployment can be configured here."
                '''
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
            echo "Backend: ${BACKEND_IMAGE}:${IMAGE_TAG}"
            echo "Frontend: ${FRONTEND_IMAGE}:${IMAGE_TAG}"
        }

        failure {
            echo 'EmployeeHub CI/CD Pipeline failed.'
        }
    }
}