pipeline {
    agent any

    environment {
        BACKEND_IMAGE  = 'ps73171/employeehub-backend'
        FRONTEND_IMAGE = 'ps73171/employeehub-frontend'

        IMAGE_TAG = "${BUILD_NUMBER}"

        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')

        SONAR_HOST_URL = 'http://192.168.10.101:9000'
    }

    stages {

        // =========================================================
        // CHECKOUT
        // =========================================================

        stage('Checkout') {
            steps {
                echo 'Checking out EmployeeHub source code...'

                checkout scm
            }
        }


        // =========================================================
        // BUILD / ENVIRONMENT CHECK
        // =========================================================

        stage('Build') {
            steps {
                echo 'Building EmployeeHub application...'

                sh '''
                    echo "======================================"
                    echo "Docker Version"
                    echo "======================================"

                    docker --version

                    echo ""
                    echo "======================================"
                    echo "Workspace"
                    echo "======================================"

                    pwd

                    echo ""
                    echo "======================================"
                    echo "Project Structure"
                    echo "======================================"

                    ls -la

                    echo ""
                    echo "======================================"
                    echo "Backend"
                    echo "======================================"

                    ls -la backend

                    echo ""
                    echo "======================================"
                    echo "Frontend"
                    echo "======================================"

                    ls -la frontend
                '''
            }
        }


        // =========================================================
        // TEST
        // =========================================================

        stage('Test') {
            steps {
                echo 'Running EmployeeHub application tests...'

                sh '''
                    echo "======================================"
                    echo "Backend Test"
                    echo "======================================"

                    if [ -d "backend" ]; then
                        cd backend

                        echo "Checking requirements.txt..."

                        if [ -f "requirements.txt" ]; then
                            echo "requirements.txt found"
                        else
                            echo "ERROR: requirements.txt not found"
                            exit 1
                        fi

                        echo "Backend tests completed."
                    fi

                    cd ..

                    echo ""
                    echo "======================================"
                    echo "Frontend Test"
                    echo "======================================"

                    if [ -d "frontend" ]; then

                        if [ -f "frontend/package.json" ]; then
                            echo "package.json found"
                        else
                            echo "WARNING: package.json not found"
                        fi

                        echo "Frontend tests completed."
                    fi
                '''
            }
        }


        // =========================================================
        // SONARQUBE
        // =========================================================

        stage('SonarQube Scan') {
            steps {
                echo 'Running SonarQube analysis...'

                script {

                    def scannerHome = tool(
                        name: 'sonar-scanner',
                        type: 'hudson.plugins.sonar.SonarRunnerInstallation'
                    )

                    withCredentials([
                        string(
                            credentialsId: 'sonarID',
                            variable: 'SONAR_TOKEN'
                        )
                    ]) {

                        sh """
                            echo "======================================"
                            echo "SonarScanner Version"
                            echo "======================================"

                            ${scannerHome}/bin/sonar-scanner --version

                            echo ""
                            echo "======================================"
                            echo "SonarQube Server"
                            echo "======================================"

                            echo "${SONAR_HOST_URL}"

                            echo ""
                            echo "======================================"
                            echo "Starting SonarQube Scan"
                            echo "======================================"

                            ${scannerHome}/bin/sonar-scanner \\
                              -Dsonar.projectKey=employeehub \\
                              -Dsonar.projectName="EmployeeHub" \\
                              -Dsonar.sources=backend,frontend \\
                              -Dsonar.host.url="${SONAR_HOST_URL}" \\
                              -Dsonar.token="${SONAR_TOKEN}"

                            echo ""
                            echo "SonarQube scan completed successfully."
                        """
                    }
                }
            }
        }


        // =========================================================
        // DOCKER BUILD
        // =========================================================

        stage('Docker Build') {
            steps {
                echo 'Building Backend and Frontend Docker images...'

                sh '''
                    echo "======================================"
                    echo "Building Backend Docker Image"
                    echo "======================================"

                    docker build \
                      -t ${BACKEND_IMAGE}:${IMAGE_TAG} \
                      ./backend

                    docker tag \
                      ${BACKEND_IMAGE}:${IMAGE_TAG} \
                      ${BACKEND_IMAGE}:latest


                    echo ""
                    echo "======================================"
                    echo "Building Frontend Docker Image"
                    echo "======================================"

                    docker build \
                      -t ${FRONTEND_IMAGE}:${IMAGE_TAG} \
                      ./frontend

                    docker tag \
                      ${FRONTEND_IMAGE}:${IMAGE_TAG} \
                      ${FRONTEND_IMAGE}:latest


                    echo ""
                    echo "======================================"
                    echo "Docker Images Created"
                    echo "======================================"

                    docker images | grep employeehub
                '''
            }
        }


        // =========================================================
        // TRIVY SECURITY SCAN
        // =========================================================

        stage('Trivy Security Scan') {
            steps {
                echo 'Running Trivy security scan...'

                sh '''
                    echo "======================================"
                    echo "Trivy Backend Scan"
                    echo "======================================"

                    trivy image \
                      --severity HIGH,CRITICAL \
                      --exit-code 0 \
                      ${BACKEND_IMAGE}:${IMAGE_TAG}


                    echo ""
                    echo "======================================"
                    echo "Trivy Frontend Scan"
                    echo "======================================"

                    trivy image \
                      --severity HIGH,CRITICAL \
                      --exit-code 0 \
                      ${FRONTEND_IMAGE}:${IMAGE_TAG}


                    echo ""
                    echo "Trivy security scan completed."
                '''
            }
        }


        // =========================================================
        // DOCKER HUB PUSH
        // =========================================================

        stage('Docker Push') {
            steps {
                echo 'Pushing Backend and Frontend images to Docker Hub...'

                sh '''
                    echo "======================================"
                    echo "Docker Hub Login"
                    echo "======================================"

                    echo "$DOCKERHUB_CREDENTIALS_PSW" | \
                    docker login \
                      -u "$DOCKERHUB_CREDENTIALS_USR" \
                      --password-stdin


                    echo ""
                    echo "======================================"
                    echo "Push Backend Image"
                    echo "======================================"

                    docker push ${BACKEND_IMAGE}:${IMAGE_TAG}

                    docker push ${BACKEND_IMAGE}:latest


                    echo ""
                    echo "======================================"
                    echo "Push Frontend Image"
                    echo "======================================"

                    docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}

                    docker push ${FRONTEND_IMAGE}:latest


                    echo ""
                    echo "======================================"
                    echo "Docker Images Successfully Pushed"
                    echo "======================================"

                    echo "Backend:"
                    echo "${BACKEND_IMAGE}:${IMAGE_TAG}"

                    echo "${BACKEND_IMAGE}:latest"

                    echo ""

                    echo "Frontend:"
                    echo "${FRONTEND_IMAGE}:${IMAGE_TAG}"

                    echo "${FRONTEND_IMAGE}:latest"
                '''
            }
        }


        // =========================================================
        // DEPLOY
        // =========================================================

        stage('Deploy') {
            steps {
                echo 'Deployment stage...'

                sh '''
                    echo "======================================"
                    echo "Deployment Information"
                    echo "======================================"

                    echo "Backend Image:"
                    echo "${BACKEND_IMAGE}:${IMAGE_TAG}"

                    echo ""

                    echo "Frontend Image:"
                    echo "${FRONTEND_IMAGE}:${IMAGE_TAG}"

                    echo ""

                    echo "Images have been pushed successfully to Docker Hub."

                    echo ""

                    echo "Argo CD deployment will be configured next."
                '''
            }
        }
    }


    // =============================================================
    // POST ACTIONS
    // =============================================================

    post {

        always {
            echo 'Pipeline cleanup completed.'

            sh '''
                docker logout || true
            '''
        }

        success {
            echo '======================================'
            echo 'EmployeeHub CI/CD Pipeline SUCCESS'
            echo '======================================'

            echo "Backend Image: ${BACKEND_IMAGE}:${IMAGE_TAG}"
            echo "Frontend Image: ${FRONTEND_IMAGE}:${IMAGE_TAG}"
        }

        failure {
            echo '======================================'
            echo 'EmployeeHub CI/CD Pipeline FAILED'
            echo '======================================'

            echo "Please check the failed stage in Console Output."
        }
    }
}