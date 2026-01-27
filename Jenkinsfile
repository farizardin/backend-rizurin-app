pipeline {
  agent any

  options {
    disableConcurrentBuilds(abortPrevious: true)
  }

  environment {
    APP_NAME   = 'rizurin-app-api'
    IMAGE_NAME = 'rizurin/rizurin-app-api'
    IMAGE_TAG  = "${BUILD_NUMBER}"

    DOCKER_REGISTRY       = '192.168.8.60:8085'
    IMAGE_FULL            = "${DOCKER_REGISTRY}/${IMAGE_NAME}"
    DOCKER_CREDENTIALS_ID = 'harbor-cred'
    KUBECONFIG_CRED       = 'k3s-kubeconfig'
    NAMESPACE             = 'rizurin'
  }

  stages {

    stage('Test') {
      steps {
        script {
          try {
            sh 'docker run -d --name pg-test-${BUILD_NUMBER} -e POSTGRES_PASSWORD=root -e POSTGRES_DB=rizurin_app_test -p 5432:5432 postgres:15-alpine'
            sh 'sleep 10'
            sh """
              docker run --rm \
                --network host \
                -v \$(pwd):/app \
                -w /app \
                node:20-alpine \
                sh -c "npm install && npx sequelize-cli db:create --env test || true && npm test"
            """
          } finally {
            sh 'docker stop pg-test-${BUILD_NUMBER} || true'
            sh 'docker rm pg-test-${BUILD_NUMBER} || true'
          }
        }
      }
    }

    stage('Build Docker Image') {
      steps {
        sh """
          docker build \
            -t ${IMAGE_FULL}:${IMAGE_TAG} \
            -t ${IMAGE_FULL}:latest .
        """
      }
    }

    stage('Push Docker Image') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: DOCKER_CREDENTIALS_ID,
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh """
            echo "$DOCKER_PASS" | docker login ${DOCKER_REGISTRY} -u "$DOCKER_USER" --password-stdin
            docker push ${IMAGE_FULL}:${IMAGE_TAG}
            docker push ${IMAGE_FULL}:latest
          """
        }
      }
    }

    stage('Ensure Deployment Exists') {
      when { branch 'master' }
      steps {
        withCredentials([file(credentialsId: KUBECONFIG_CRED, variable: 'KUBECONFIG')]) {
          sh """
            kubectl apply -f k8s/
          """
        }
      }
    }

    stage('Update Image') {
      when { branch 'master' }
      steps {
        withCredentials([file(credentialsId: KUBECONFIG_CRED, variable: 'KUBECONFIG')]) {
          sh """
            kubectl set image deployment/${APP_NAME} \
              ${APP_NAME}=${IMAGE_FULL}:${IMAGE_TAG} \
              -n ${NAMESPACE}

            kubectl rollout status deployment/${APP_NAME} -n ${NAMESPACE}
          """
        }
      }
    }
  }
}
