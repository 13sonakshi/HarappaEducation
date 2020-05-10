const crypto = require('crypto');
const jwt = require('jsonwebtoken');

class Utility {
    async generateToken() {
        return await new Promise((resolve, reject) => {
            crypto.randomBytes(48, function(err, buffer) {
                resolve(buffer.toString('hex'));
            });
        })
    }

    generateJwtToken(user_id){
        var token = jwt.sign({ id: user_id },
        process.env.JWT_SECRET, {
            expiresIn: 2073600 //86400 // expires in 24 hours
            });
        return token;
    }

    readTemplate(templatePath, templateVars) {
        return new Promise((resolve, reject) => {
            ejs.renderFile(templatePath, templateVars, (err, content) => {
                if (err) {
                    reject(err);
                    return response.setResponse(res).internalError(err);
                }else{
                    resolve(content);
                }
            });
        });
    }


    uploadToS3(fileName, folderPath, fileType, s3FolderPath) {
        console.log('INSIDE');
        var AWS = require('aws-sdk');
        var fs = require('fs');

        // Set the region
        var credentials = new AWS.SharedIniFileCredentials({profile: process.env.AWS_PROFILE});
        AWS.config.credentials = credentials;

        // AWS.config.update({region: 'us-east-1'});

        // Create S3 service object
        let s3 = new AWS.S3({apiVersion: '2006-03-01'});

        // call S3 to retrieve upload file to specified bucket
        var uploadParams = {Bucket: process.env.AWS_S3_BUCKET, Key: '', Body: '', ACL: "public-read",
            ContentType: fileType};

        uploadParams.Key = s3FolderPath + Math.floor(new Date() / 1000) + '_' + fileName ;

        uploadParams.Body = fs.readFileSync(process.cwd() + '/' + folderPath);
        console.log(uploadParams);
        return s3.upload(uploadParams).promise().then(function(data) {
            return data;
        }).catch((err) => {
            console.log(err);
            return false;
        })
    }


    checkUploadState(req, fieldName, bucketFolder) {
        console.log('000000000');
        console.log(req.files)

        if (req.files && req.files[fieldName]) {
            if(req.files[fieldName] instanceof Array) {
                const promises = req.files[fieldName].map((file) => {
                    return this.uploadToS3(file.filename, file.file, file.mimetype, bucketFolder);
                });
                return Promise.all(promises).then((results) => {
                    console.log(results);
                    return results;
                });
            } else {
                return this.uploadToS3(req.files[fieldName].filename, req.files[fieldName].file, req.files[fieldName].mimetype, bucketFolder);
            }

        } else {
            return new Promise((resolve, reject) => {
                resolve(false);
            });
        }
    }

}

module.exports = new Utility;
