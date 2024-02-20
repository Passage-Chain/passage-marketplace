#!groovy

//global variables
REPO_URL = "250664004806.dkr.ecr.us-east-2.amazonaws.com" 
AWS_ECR_CRED = "ecr:us-east-2:b0370e48-8883-4ecf-9a8a-a34ed6f0599d"

node('jenkins-dev') {
    timestamps {
        try {
            notifyBuild('STARTED')
            stage('Checkout code') {
                checkout scm
            }
                        
            def serviceName = sh(returnStdout: true, script: "git config --get remote.origin.url | cut -f 5 -d '/' | sed 's/.git//g'").trim().toLowerCase()
            def SERVICE_NAME = "${params.stackenv}_${serviceName}"

            stage('docker-login') {
                withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'dd4836e6-c14c-4bc0-9139-920114805e81', usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY']]) {
                    sh """
                    aws ecr get-login-password --region ${params.stackregion} | sudo docker login --username AWS --password-stdin $REPO_URL
                    sudo docker build -t ${SERVICE_NAME} . 
                    sudo docker tag  ${SERVICE_NAME}:latest ${REPO_URL}/${SERVICE_NAME}:latest
                    sudo docker push ${REPO_URL}/${SERVICE_NAME}:latest
                    """
                }
            }

            stage('Deployment') {
                withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'dd4836e6-c14c-4bc0-9139-920114805e81', usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY']]) {
                    sh """
                    cd ./ECS-Objects && pwd
                    echo "yes" | TF_INPUT="true"  terraform init 
                    terraform plan -out=${SERVICE_NAME}.plan -var="aws_region=${params.stackregion}"                     
                    terraform apply ${SERVICE_NAME}.plan
                    aws ecs update-service --cluster ${params.stackenv} --service ${SERVICE_NAME} --task-definition ${SERVICE_NAME} --force-new-deployment --region=${params.stackregion}
                    """
                    }
                }
            stage('Docker images cleanup') {
                sh """
                sudo docker rmi -f ${REPO_URL}/${SERVICE_NAME}
                """
                }
            }
        catch (CaughtErr) {
            currentBuild.result = "FAILED"
            println("Caught exception: " + CaughtErr)
            // error = catchException exception: CaughtErr
            } 
        finally {
            println("CurrentBuild result: " + currentBuild.result)
            // Success or failure, always send notifications
            notifyBuild(currentBuild.result)
            step([$class: 'WsCleanup'])
            }
        }
    }

def notifyBuild(String buildStatus = 'STARTED') {
  // build status of null means successful
  buildStatus =  buildStatus ?: 'SUCCESS'

  // Default values
  def colorName = 'RED'
  def colorCode = '#FF0000'
  def subject = "${buildStatus}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'"
  def summary = "${subject} (${env.BUILD_URL})"

  // Override default values based on build status
  if (buildStatus == 'STARTED') {
    color = 'YELLOW'
    colorCode = '#FFFF00'
  } else if (buildStatus == 'SUCCESS') {
    color = 'GREEN'
    colorCode = '#00FF00'
  } else {
    color = 'RED'
    colorCode = '#FF0000'
  }

  // Send notifications
  slackSend (color: colorCode, message: summary)
}


// def sendemail(result, message, EMAIL_TO = 'meghana.challa@accionlabs.com') {
//     if (message == "SUCCESS") {
//         emailext body: 'Check console output at $BUILD_URL to view the results. \n\n ${CHANGES} \n\n -------------------------------------------------- \n${BUILD_LOG, maxLines=100, escapeHtml=false}', 
//         to: "${EMAIL_TO}", 
//         subject: 'Build success in Jenkins: $PROJECT_NAME - #$BUILD_NUMBER'
//     } else {
//         emailext body: 'Check console output at $BUILD_URL to view the results. \n\n ${CHANGES} \n\n -------------------------------------------------- \n${BUILD_LOG, maxLines=100, escapeHtml=false}', 
//         to: "${EMAIL_TO}", 
//         subject: 'Build failed in Jenkins: $PROJECT_NAME - #$BUILD_NUMBER'
//         }
//     }