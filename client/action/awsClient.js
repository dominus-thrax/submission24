import AWS from 'aws-sdk'
import apiConfig from '../configs/api'

AWS.config.update({
    accessKeyId: process.env.accessKey,
    secretAccessKey:process.env.secretAccessKey,
    region: 'ap-south-1'  
})

export default AWS;