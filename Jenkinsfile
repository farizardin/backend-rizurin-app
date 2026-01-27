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
          def networkName = "test-net-${BUILD_NUMBER}"
          def pgContainer = "pg-test-${BUILD_NUMBER}"
          def nodeContainer = "node-test-${BUILD_NUMBER}"
          def commonLabel = "project=rizurin-test"
          def testCmd = "npm install && npx sequelize-cli db:create --env test || true && npm test"
          try {
            // Comprehensive cleanup: removes both labeled resources and legacy name patterns
            sh "docker ps -aq --filter 'label=${commonLabel}' | xargs -r docker rm -f"
            sh "docker ps -aq --filter 'name=pg-test-' | xargs -r docker rm -f"
            sh "docker ps -aq --filter 'name=node-test-' | xargs -r docker rm -f"
            sh "docker network ls -q --filter 'label=${commonLabel}' | xargs -r docker network rm"
            sh "docker network ls -q --filter 'name=test-net-' | xargs -r docker network rm"

            sh "docker network create --label ${commonLabel} ${networkName}"
            sh "docker run -d --name ${pgContainer} --network ${networkName} --label ${commonLabel} -e POSTGRES_PASSWORD=root -e POSTGRES_DB=rizurin_app_test postgres:15-alpine"
            
            sh 'sleep 15' // Wait for DB readiness
            
            // Removed --rm to ensure we can get logs after exit
            sh """
              docker run --name ${nodeContainer} --label ${commonLabel} \
                --network ${networkName} \
                -v \$(pwd):/app \
                -w /app \
                -e DB_HOST=${pgContainer} \
                node:20-alpine \
                sh -c '${testCmd}'
            """
          } catch (e) {
            // Log both containers on failure
            sh "docker logs ${nodeContainer} || true"
            sh "docker logs ${pgContainer} || true"
            throw e
          }
 finally {
            sh "docker stop ${nodeContainer} ${pgContainer} || true"
            sh "docker rm ${nodeContainer} ${pgContainer} || true"
            sh "docker network rm ${networkName} || true"
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
