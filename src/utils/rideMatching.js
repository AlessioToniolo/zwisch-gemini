import { db } from '../firebase';
import { matchRides } from './aiMatching';
import { collection, query, where, getDocs, getDoc, doc, addDoc, updateDoc } from 'firebase/firestore';

export const performRideMatching = async () => {
  try {
    const requestsQuery = query(collection(db, 'rideRequests'), where('status', '==', 'pending'));
    const requestsSnapshot = await getDocs(requestsQuery);

    const availabilitiesQuery = query(collection(db, 'driverAvailability'), where('status', '==', 'active'));
    const availabilitiesSnapshot = await getDocs(availabilitiesQuery);

    const requests = await Promise.all(requestsSnapshot.docs.map(async (docSnapshot) => {
      const userData = await getDoc(doc(db, 'users', docSnapshot.data().userId));
      return {
        id: docSnapshot.id,
        ...docSnapshot.data(),
        userEmail: userData.data().email
      };
    }));

    const availabilities = await Promise.all(availabilitiesSnapshot.docs.map(async (docSnapshot) => {
      const userData = await getDoc(doc(db, 'users', docSnapshot.data().userId));
      return {
        id: docSnapshot.id,
        ...docSnapshot.data(),
        userEmail: userData.data().email
      };
    }));

    // Group requests and availabilities by school domain
    const groupedRequests = groupBySchoolDomain(requests);
    const groupedAvailabilities = groupBySchoolDomain(availabilities);

    let allMatches = [];

    // Perform matching for each school domain
    for (const domain in groupedRequests) {
      if (groupedAvailabilities[domain]) {
        const domainMatches = await matchRides(groupedRequests[domain], groupedAvailabilities[domain]);
        allMatches = allMatches.concat(domainMatches);
      }
    }

    // Process matches
    for (const match of allMatches) {
      const { requestId, availabilityId, compatibilityScore, type } = match;

      if (compatibilityScore > 0.7) {
        if (type === 'one-time') {
          await createOneTimeRide(requestId, availabilityId);
        } else if (type === 'recurring') {
          await createRecurringCarpool(requestId, availabilityId);
        }

        await createMatchNotifications(requestId, availabilityId, type);
      }
    }

    console.log('Ride matching completed successfully');
    return allMatches;
  } catch (error) {
    console.error('Error in ride matching:', error);
    throw error;
  }
};

const groupBySchoolDomain = (items) => {
  return items.reduce((acc, item) => {
    const domain = item.userEmail.split('@')[1];
    if (!acc[domain]) {
      acc[domain] = [];
    }
    acc[domain].push(item);
    return acc;
  }, {});
};

const createOneTimeRide = async (requestId, availabilityId) => {
  const rideRef = await addDoc(collection(db, 'rides'), {
    requestId,
    availabilityId,
    status: 'matched',
    type: 'one-time',
    createdAt: new Date()
  });

  await updateDoc(doc(db, 'rideRequests', requestId), { status: 'matched', rideId: rideRef.id });
  await updateDoc(doc(db, 'driverAvailability', availabilityId), { status: 'matched', rideId: rideRef.id });
};

const createRecurringCarpool = async (requestId, availabilityId) => {
  const carpoolRef = await addDoc(collection(db, 'carpools'), {
    requestId,
    availabilityId,
    status: 'active',
    type: 'recurring',
    createdAt: new Date()
  });

  await updateDoc(doc(db, 'rideRequests', requestId), { status: 'matched', carpoolId: carpoolRef.id });
  await updateDoc(doc(db, 'driverAvailability', availabilityId), { status: 'matched', carpoolId: carpoolRef.id });
};

const createMatchNotifications = async (requestId, availabilityId, type) => {
  const requestDoc = await getDoc(doc(db, 'rideRequests', requestId));
  const availabilityDoc = await getDoc(doc(db, 'driverAvailability', availabilityId));

  const rideType = type === 'one-time' ? 'ride' : 'carpool';

  await addDoc(collection(db, 'notifications'), {
    userId: requestDoc.data().userId,
    title: `${rideType.charAt(0).toUpperCase() + rideType.slice(1)} Matched`,
    message: `Your ${rideType} request has been matched! Check your ${rideType}s for details.`,
    read: false,
    createdAt: new Date()
  });

  await addDoc(collection(db, 'notifications'), {
    userId: availabilityDoc.data().userId,
    title: `${rideType.charAt(0).toUpperCase() + rideType.slice(1)} Matched`,
    message: `Your ${rideType} offer has been matched! Check your ${rideType}s for details.`,
    read: false,
    createdAt: new Date()
  });
};

export const runMatchingOnNewEntry = async () => {
  await performRideMatching();
};