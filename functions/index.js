const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendPushNotification = functions.firestore
  .document('rides/{rideId}')
  .onUpdate(async (change, context) => {
    const newValue = change.after.data();
    const previousValue = change.before.data();

    // Check if the status has changed
    if (newValue.status !== previousValue.status) {
      const rideId = context.params.rideId;

      // Get the user IDs for both the rider and the driver
      const riderId = newValue.riderId;
      const driverId = newValue.driverId;

      // Get the FCM tokens for both users
      const riderDoc = await admin.firestore().collection('users').doc(riderId).get();
      const driverDoc = await admin.firestore().collection('users').doc(driverId).get();

      const riderToken = riderDoc.data().fcmToken;
      const driverToken = driverDoc.data().fcmToken;

      if (riderToken) {
        const message = {
          token: riderToken,
          notification: {
            title: 'Ride Status Update',
            body: `Your ride (ID: ${rideId}) status has changed to ${newValue.status}.`
          },
          data: {
            rideId: rideId,
            status: newValue.status
          }
        };
        await admin.messaging().send(message);
      }

      if (driverToken) {
        const message = {
          token: driverToken,
          notification: {
            title: 'Ride Status Update',
            body: `Your ride (ID: ${rideId}) status has changed to ${newValue.status}.`
          },
          data: {
            rideId: rideId,
            status: newValue.status
          }
        };
        await admin.messaging().send(message);
      }
    }
  });