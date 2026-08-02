pipeline {
agent any

environment {
    IMAGE_NAME = 'ps73171/employeehub-backend'
    IMAGE_TAG = "${BUILD_NUMBER}"
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
        }
    }

    stage('SonarQube Scan') {
        steps {
            echo 'SonarQube scan will run here'
        }
    }

    stage('Trivy Security Scan') {
        steps {
            echo 'Trivy security scan will run here'
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
            echo 'Docker image push will be configured after Docker Hub credentials are added.'
        }
    }

    stage('Deploy') {
        steps {
            echo 'Deployment stage will be configured after Kubernetes/Argo CD setup.'
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
}

}
