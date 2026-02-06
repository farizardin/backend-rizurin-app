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
          // Sanitize JOB_NAME for safe use in Docker names/labels
          // Use more standard methods to avoid Jenkins sandbox security errors
          def rawJobName = env.JOB_NAME.replaceAll(/[^a-zA-Z0-9]/, '-')
          def sanitizedJobName = rawJobName.length() > 20 ? rawJobName.substring(0, 20) : rawJobName
          
          def ts = String.valueOf(System.currentTimeMillis())
          def timestamp = ts.length() > 8 ? ts.substring(ts.length() - 8) : ts
          
          def networkName = "net-${sanitizedJobName}-${BUILD_NUMBER}-${timestamp}"
          def pgContainer = "pg-${sanitizedJobName}-${BUILD_NUMBER}-${timestamp}"
          def nodeContainer = "node-${sanitizedJobName}-${BUILD_NUMBER}-${timestamp}"
          
          // Use a job-specific label to prevent killing containers from OTHER jobs
          def jobLabel = "rizurin-job=${sanitizedJobName}"
          
          // Create a physical script to avoid quoting issues
          writeFile file: 'test-runner.sh', text: """#!/bin/sh
set -e
npm install
npx sequelize-cli db:create --env test || true
npm test
"""
          sh "chmod +x test-runner.sh"

          try {
            // ONLY cleanup resources belonging to THIS specific job
            sh """
              docker ps -aq --filter "label=${jobLabel}" | xargs -r docker rm -f
              docker network ls -q --filter "label=${jobLabel}" | xargs -r docker network rm
            """

            sh "docker network create --label ${jobLabel} ${networkName}"
            sh "docker run -d --name ${pgContainer} --network ${networkName} --label ${jobLabel} -e POSTGRES_PASSWORD=root -e POSTGRES_DB=rizurin_app_test postgres:15-alpine"
            
            sh 'sleep 15' // Wait for DB readiness
            
            // Execute the physical script
            sh "docker run --name ${nodeContainer} --label ${jobLabel} --network ${networkName} -v \"\$(pwd)\":/app -w /app -e DB_HOST=${pgContainer} node:20-alpine ./test-runner.sh"
          } catch (e) {
            sh "docker logs ${nodeContainer} || true"
            sh "docker logs ${pgContainer} || true"
            throw e
          } finally {
            sh "docker stop ${nodeContainer} ${pgContainer} || true"
            sh "docker rm ${nodeContainer} ${pgContainer} || true"
            sh "docker network rm ${networkName} || true"
            sh "rm -f test-runner.sh"
          }
        }
      }
    }

    // stage('Migrate Production DB') {
    //   when { branch 'master' }
    //   steps {
    //     script {
    //       sh """
    //         docker run --rm \
    //           -v "\$(pwd)":/app \
    //           -w /app \
    //           -e NODE_ENV=production \
    //           node:20-alpine \
    //           sh -c "npm install && npx sequelize-cli db:create --env production || true && npx sequelize-cli db:migrate --env production"
    //       """
    //     }
    //   }
    // }

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
      when { branch 'master' }
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

    stage('Run DB Migration Kubernetes Job)') {
      when { branch 'master' }
      steps {
        withCredentials([file(credentialsId: KUBECONFIG_CRED, variable: 'KUBECONFIG')]) {
          sh """
            kubectl delete job rizurin-db-migrate -n ${NAMESPACE} --ignore-not-found
            kubectl wait --for=condition=complete job/rizurin-db-migrate -n ${NAMESPACE} --timeout=300s
          """
        }
      }
    }

    stage('Update Image of Kubernetes Cluster') {
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

    stage('Patch Kubernetes Traefik Service') {
      when { branch 'master' }
      steps {
        withCredentials([file(credentialsId: KUBECONFIG_CRED, variable: 'KUBECONFIG')]) {
          sh """
             # Ensure Traefik preserves client IP (fixes SNAT issue)
             kubectl patch svc traefik -n kube-system -p '{"spec":{"externalTrafficPolicy":"Local"}}' || true
          """
        }
      }
    }
  }
}
