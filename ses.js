

const aws = require("aws-sdk");

let secrets;
if(process.env.NODE_ENV == "production") {
    secrets = process.env;
} else {
    secrets = require("./secrets.json");
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-central-1"
});


exports.send = (email, secretCode) => {
    return ses.sendEmail({
        Source: "marconewman@icloud.com",
        Destination: {
            ToAddresses: [email]
        },
        Message: {
            Subject: {
                Data: "authorized password reset"
            },
            Body: {
                Text: {
                    Data: "Your password reset code: " + [secretCode]
                }
            }
        }
    }).promise();
}