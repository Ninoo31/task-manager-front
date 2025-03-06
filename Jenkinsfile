pipeline {
    agent any

    tools {
        nodejs 'node_22'
    }

    options {
        disableResume()
        disableConcurrentBuilds abortPrevious: true
    }

    environment {
        AWS_REGION = 'us-east-1'
        ECR_URI = '600627340377.dkr.ecr.eu-north-1.amazonaws.com'
        ECR_REPO = 'task_manager_front'
        IMAGE_TAG = "$GIT_COMMIT"
        REPORTS_DIR = 'reports'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh "npm test -- --json --outputFile=${REPORTS_DIR}/test-results.json"
            }
        }

        stage('Audit Dependencies') {
            steps {
                sh "npm audit --json > ${REPORTS_DIR}/audit-report.json || true"
            }
        }

        stage('Build Frontend') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build -t ${ECR_URI}/${ECR_REPO}:${IMAGE_TAG} .
                    docker tag $ECR_REPO:$IMAGE_TAG $ECR_URI/$ECR_REPO:$IMAGE_TAG
                    docker tag $ECR_REPO:$IMAGE_TAG $ECR_URI/$ECR_REPO:latest
                '''
            }
        }

        stage('Trivy Vulnerability Scanner') {
            steps {
                sh '''
                    trivy image $ECR_URI/$ECR_REPO:$IMAGE_TAG \
                        --severity LOW,MEDIUM,HIGH \
                        --exit-code 0 \
                        --quiet \
                        --format json -o ${REPORTS_DIR}/trivy-image-MEDIUM-results.json

                    trivy image $ECR_URI/$ECR_REPO:$IMAGE_TAG \
                        --severity CRITICAL \
                        --exit-code 1 \
                        --quiet \
                        --format json -o ${REPORTS_DIR}/trivy-image-CRITICAL-results.json
                '''
            }
            post {
                always {
                    sh '''
                        trivy convert \
                            --format template --template "@/usr/local/share/trivy/templates/html.tpl" \
                            --output ${REPORTS_DIR}/trivy-image-MEDIUM-results.html \
                                ${REPORTS_DIR}/trivy-image-MEDIUM-results.json

                        trivy convert \
                            --format template --template "@/usr/local/share/trivy/templates/html.tpl" \
                            --output ${REPORTS_DIR}/trivy-image-CRITICAL-results.html \
                                ${REPORTS_DIR}/trivy-image-CRITICAL-results.json

                        trivy convert \
                            --format template --template "@/usr/local/share/trivy/templates/junit.tpl" \
                            --output ${REPORTS_DIR}/trivy-image-MEDIUM-results.xml \
                                ${REPORTS_DIR}/trivy-image-MEDIUM-results.json

                        trivy convert \
                            --format template --template "@/usr/local/share/trivy/templates/junit.tpl" \
                            --output ${REPORTS_DIR}/trivy-image-CRITICAL-results.xml \
                                ${REPORTS_DIR}/trivy-image-CRITICAL-results.json
                    '''
                }
            }
        }

        stage('Push Image to AWS ECR') {
            steps {
                withAWS(credentials: 'aws-credentials', region: 'eu-north-1') {
                    sh '''
                        aws ecr get-login-password --region ${AWS_REGION} |
                            docker login --username AWS --password-stdin ${ECR_URI}
                        docker push ${ECR_URI}/${ECR_REPO}:${IMAGE_TAG}
                    '''
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                script {
                    sshagent(['aws-dev-deploy-ec2-ecR']) {
                        sh '''
                            ssh -o StrictHostKeyChecking=no ubuntu@your-ec2-ip "
                            if sudo docker ps -a | grep -q "task-manager-front"; then
                                echo "Container found. Stopping..."
                                sudo docker stop "task-manager-front" && sudo docker rm "task-manager-front"
                                echo "Container stopped and removed."
                            fi
                            docker stop task-manager-front || true
                            docker rm task-manager-front || true
                            docker run -d --name task-manager-front -p 80:80 ${ECR_URI}/${ECR_REPO}:${IMAGE_TAG}
                            "
                        '''
                    }
                }
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, stdioRetention: '',
                testResults: "${REPORTS_DIR}/test-results.xml"
            junit allowEmptyResults: true, stdioRetention: '',
                testResults: "${REPORTS_DIR}/trivy-image-MEDIUM-results.xml"
            junit allowEmptyResults: true, stdioRetention: '',
                testResults: "${REPORTS_DIR}/trivy-image-CRITICAL-results.xml"

            publishHTML([
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: REPORTS_DIR,
                reportFiles: 'test-results.json',
                reportName: 'Test Report'
            ])
            publishHTML([
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: REPORTS_DIR,
                reportFiles: 'audit-report.json',
                reportName: 'Dependency Audit Report'
            ])
            publishHTML([
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: REPORTS_DIR,
                        reportFiles: 'trivy-report.json',
                        reportName: 'Trivy Security Report'
                    ])
        }
        success {
            echo '🚀 Frontend successfully deployed!'
        }
        failure {
            echo '❌ Deployment failed!'
        }
    }
}
