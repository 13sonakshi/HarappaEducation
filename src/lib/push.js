var FCM = require('fcm-node');
var apn = require("apn");
// var forceLogOutPushType = 4;
// var followRequestAcceptType = 5;

class Push{
    constructor(){

    }

    
    

     androidPush(deviceToken, messagePush, pushType, offerId,fromuserId,matchId,jobType,otherJobId) {
        //console.log(arguments);
        console.log('in android push' +deviceToken);
        var message = {
            ////this may vary according to the message type (single recipient, multicast, topic, et cetera)
    
            to: deviceToken,
        //    to:'cSifUNYqgzc:APA91bHtKdB8CwzqY6ewAD5wjR3TOT_4hfVz_q39s8t8SIJ1YI-6SHIgfV82P6v5OAdms5CT0-8UpzpEKR-ILeA744-Ww7eCDrg5gCavtemCdsHBzLZQFAqu8Xnh1UImqo6XD9Ywjw7o',
            collapse_key: '',
            data: {}
        };
        var serverKey = 'AIzaSyDmZgYbJX6O3W7slgONZ123EYwDLwbtdz8';
        
        var fcm = new FCM(serverKey);
    
        message.data = {};
        message.data.alert = messagePush;
        message.data.pushType = pushType;
       // message.data.badge = count;
        message.data.job_id = offerId;
        message.data.from_id = fromuserId;
        message.data.match_id = matchId;
        message.data.jobType = jobType;
        message.data.otherJobId=otherJobId;
        fcm.send(message, function (err, response) {
            if (err) {
                console.log('error');
                console.log(err);
                return true;
            } else {
                console.log('success aayyaaa');
                console.log(response);
                return true;
            }
        });
    }
    
    
     iphonePush(deviceToken, messagePush, pushType,  offerId,fromuserId,matchId,jobType,otherJobId) {
         console.log (pushType);
         if (pushType==10){
             var category="chat";
         }else{
            var category="match";
         }
        var message = "";
    
        var apnProvider = new apn.Provider({
            token: {
                key: 'AuthKey_M2QNBVFY7Z.p8', // Path to the key p8 file
                keyId: 'M2QNBVFY7Z', // The Key ID of the p8 file (available at https://developer.apple.com/account/ios/certificate/key)
                teamId: 'YTG6P74X4R', // The Team ID of your Apple Developer Account (available at https://developer.apple.com/account/#/membership/)
            },
            production: false // Set to true if sending a notification to a production iOS app
        });
        var note = new apn.Notification();
        note.topic = "com.kwixglobal.kbro";
        note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now. 
        note.badge = 0;
        note.sound = "default";
        note.alert = messagePush;
        note.pushType = pushType;
        note.job_id = offerId;
        note.from_id = fromuserId;
        note.match_id = matchId;
        note.jobType=jobType;
        note.otherJobId=otherJobId;

        note.threadId = category;
        
        note.payload = {};
        note.payload.alert = messagePush;
        note.payload.sound = 'default';
        note.payload.badge = 0;
        note.payload.pushType = pushType;
        note.payload.job_id = offerId;
        note.payload.from_id = fromuserId;
        note.payload.match_id = matchId;
        note.payload.jobType=jobType;;
        note.payload.otherJobId=otherJobId
        note.payload.threadId= category;
        console.log(note);
        console.log('before push');
      // var newToken="51d12e22a300829b7aed7f36e63debda546d94ee5fa1a52bcf780b92ee8eb843";
    //     apnProvider.send(note, deviceToken).then(result => {
    //         // Check the result for any failed devices
    //         // console.log(result);
    //         //console.log(note);
    // //                if (result.failed.length > 0){
    // //                return true;
    // //                }
    //     });
    
        apnProvider.send(note, deviceToken).then( result => {
          // Show the result of the send operation:
          console.log(result);
         });
        return true;
    }
        
    
}

module.exports = new Push;