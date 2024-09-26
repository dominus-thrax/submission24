import AWS from 'aws-sdk'
import apiConfig from '../configs/api'

AWS.config.update({
    accessKeyId: apiConfig.accessKey,
    secretAccessKey: apiConfig.secretAccessKey,
    region: 'ap-south-1'
})

export default AWS;