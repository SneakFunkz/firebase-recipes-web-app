import firebase from "./FirebaseConfig.js";

const firestore = firebase.firestore();

const createDocument = (collection, document) => {
  return firestore.collection(collection).add(document);
};

const readDocument = (collection, id) => {
  return firestore.collection(collection).doc(id).get();
};

const readDocuments = async ({
  collection,
  queries,
  orderByField,
  orderByDirection,
  perPage,
  cursorId,
}) => {
  let collectionRef = firestore.collection(collection);

  //if queries is passed as an argument to the readDocuments function
  //only shows the queries with isPublished
  if (queries && queries.length > 0) {
    for (const query of queries) {
      debugger;
      collectionRef = collectionRef.where(
        query.field,
        query.condition,
        query.value
      );
    }
  }
  //CollectionRefs are being compounded
  //.where has to go before .orderBy
  if (orderByField && orderByDirection) {
    collectionRef = collectionRef.orderBy(orderByField, orderByDirection);
  }

  if (perPage) {
    collectionRef = collectionRef.limit(perPage);
  }

  //id of document at which we want to start loading results
  if (cursorId) {
    const document = await readDocument(collection, cursorId);

    collectionRef = collectionRef.startAfter(document);
  }

  return collectionRef.get();
};

const updateDocument = (collection, id, document) => {
  return firestore.collection(collection).doc(id).update(document);
};

const deleteDocument = (collection, id) => {
  return firestore.collection(collection).doc(id).delete();
};

const FirebaseFirestoreService = {
  createDocument,
  readDocuments,
  updateDocument,
  deleteDocument,
};

export default FirebaseFirestoreService;
