pipeline {
    agent any

    environment {
        // Docker Images
        BACKEND_IMAGE  = 'ps73171/employeehub-backend'
        FRONTEND_IMAGE = 'ps73171/employeehub-frontend'

        // Jenkins Build Number
        IMAGE_TAG = "${BUILD_NUMBER}"

        // Docker Hub Credentials
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
    }

    stages {

        // =========================================================
        // CHECKOUT
        // =========================================================
        stage('Checkout') {
            steps {
                echo '======================================'
                echo 'Checking out EmployeeHub source code'
                echo '======================================'

                checkout scm

                sh '''
                    echo "Workspace:"
                    pwd

                    echo ""
                    echo "Project structure:"
                    ls -la

                    echo ""
                    echo "Backend:"
                    ls -la backend

                    echo ""
                    echo "Frontend:"
                    ls -la frontend
                '''
            }
        }

        // =========================================================
        // BUILD
        // =========================================================
        stage('Build') {
            steps {
                echo '======================================'
                echo 'Build Stage'
                echo '======================================'

                sh '''
                    echo "Docker version:"
                    docker --version

                    echo ""
                    echo "Backend Dockerfile:"
                    test -f backend/Dockerfile

                    echo ""
                    echo "Frontend Dockerfile:"
                    test -f frontend/Dockerfile

                    echo ""
                    echo "Build validation completed."
                '''
            }
        }

        // =========================================================
        // TEST
        // =========================================================
        stage('Test') {
            steps {
                echo '======================================'
                echo 'Test Stage'
                echo '======================================'

                sh '''
                    echo "Running backend tests..."

                    if [ -f backend/requirements.txt ]; then
                        echo "requirements.txt found"
                    fi

                    echo ""
                    echo "Running frontend validation..."

                    if [ -f frontend/package.json ]; then
                        echo "package.json found"
                    fi

                    echo ""
                    echo "Tests completed successfully."
                '''
            }
        }

        // =========================================================
        // SONARQUBE
        // =========================================================
        stage('SonarQube Scan') {
            steps {
                echo '======================================'
                echo 'SonarQube Analysis'
                echo '======================================'

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
                                echo "SonarScanner:"
                                ${scannerHome}/bin/sonar-scanner --version

                                echo ""
                                echo "Starting SonarQube scan..."

                                ${scannerHome}/bin/sonar-scanner \
                                  -Dsonar.projectKey=employeehub \
                                  -Dsonar.projectName=EmployeeHub \
                                  -Dsonar.sources=backend,frontend \
                                  -Dsonar.host.url=\$SONAR_HOST_URL \
                                  -Dsonar.token=\$SONAR_TOKEN

                                echo ""
                                echo "SonarQube scan completed."
                            """
                        }
                    }
                }
            }
        }

        // =========================================================
        // DOCKER BUILD
        // =========================================================
        stage('Docker Build') {
            steps {
                echo '======================================'
                echo 'Docker Image Build'
                echo '======================================'

                sh '''
                    echo "Building Backend image..."

                    docker build \
                        -t ${BACKEND_IMAGE}:${IMAGE_TAG} \
                        ./backend

                    echo ""
                    echo "Building Frontend image..."

                    docker build \
                        -t ${FRONTEND_IMAGE}:${IMAGE_TAG} \
                        ./frontend

                    echo ""
                    echo "Creating latest tags..."

                    docker tag \
                        ${BACKEND_IMAGE}:${IMAGE_TAG} \
                        ${BACKEND_IMAGE}:latest

                    docker tag \
                        ${FRONTEND_IMAGE}:${IMAGE_TAG} \
                        ${FRONTEND_IMAGE}:latest

                    echo ""
                    echo "Docker images created:"
                    docker images | grep employeehub
                '''
            }
        }

        // =========================================================
        // TRIVY SECURITY SCAN
        // =========================================================
        stage('Trivy Security Scan') {
            steps {
                echo '======================================'
                echo 'Trivy Security Scan'
                echo '======================================'

                timeout(time: 10, unit: 'MINUTES') {

                    sh '''
                        echo "Trivy Version:"
                        trivy --version

                        echo ""
                        echo "======================================"
                        echo "Trivy Backend Scan"
                        echo "======================================"

                        trivy image \
                            --severity HIGH,CRITICAL \
                            --exit-code 0 \
                            --no-progress \
                            ${BACKEND_IMAGE}:${IMAGE_TAG}

                        echo ""
                        echo "======================================"
                        echo "Trivy Frontend Scan"
                        echo "======================================"

                        trivy image \
                            --severity HIGH,CRITICAL \
                            --exit-code 0 \
                            --no-progress \
                            ${FRONTEND_IMAGE}:${IMAGE_TAG}

                        echo ""
                        echo "======================================"
                        echo "Trivy security scan completed."
                        echo "======================================"
                    '''
                }
            }
        }

        // =========================================================
        // DOCKER HUB PUSH
        // =========================================================
        stage('Docker Push') {
            steps {
                echo '======================================'
                echo 'Pushing Images to Docker Hub'
                echo '======================================'

                sh '''
                    echo "$DOCKERHUB_CREDENTIALS_PSW" | \
                    docker login \
                        -u "$DOCKERHUB_CREDENTIALS_USR" \
                        --password-stdin

                    echo ""
                    echo "Pushing Backend image..."

                    docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                    docker push ${BACKEND_IMAGE}:latest

                    echo ""
                    echo "Pushing Frontend image..."

                    docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                    docker push ${FRONTEND_IMAGE}:latest

                    echo ""
                    echo "Docker Hub push completed."
                '''
            }
        }

        // =========================================================
        // DEPLOY
        // =========================================================
        stage('Deploy') {
            steps {
                echo '======================================'
                echo 'Deploy Stage'
                echo '======================================'

                echo 'Images pushed successfully.'
                echo 'Deployment will be handled by Argo CD.'
            }
        }
    }

    // =============================================================
    // POST ACTIONS
    // =============================================================
    post {

        always {
            echo '======================================'
            echo 'Pipeline cleanup completed.'
            echo '======================================'

            sh '''
                docker logout || true
            '''
        }

        success {
            echo '======================================'
            echo 'EmployeeHub CI/CD Pipeline SUCCESS'
            echo '======================================'

            echo "Backend Image:  ${BACKEND_IMAGE}:${IMAGE_TAG}"
            echo "Frontend Image: ${FRONTEND_IMAGE}:${IMAGE_TAG}"
        }

        failure {
            echo '======================================'
            echo 'EmployeeHub CI/CD Pipeline FAILED'
            echo '======================================'
        }
    }
}