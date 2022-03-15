import {
  collection,
  getDocs,
  doc,
  setDoc,
  Timestamp,
  getDoc,
  addDoc,
  query,
  orderBy,
  limit,
  DocumentReference,
} from "firebase/firestore/lite";
import { db } from "../firebase";

export async function getPosts() {
  const postsCollection = collection(db, "posts");
  const postsSnapshot = await getDocs(postsCollection);
  const posts = postsSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      title: data.title,
      slug: data.slug,
      date: data.date.toDate().toDateString(),
    };
  });

  return posts;
}

export async function createPost(post: {
  slug: string;
  title: string;
  content: string;
}) {
  const postDocumentRef = doc(db, `posts/${post.slug}`);
  await setDoc(postDocumentRef, {
    slug: post.slug,
    title: post.title,
    date: Timestamp.fromDate(new Date()),
  });

  const versionsCollectionRef = collection(db, `posts/${post.slug}/versions`);
  await addDoc(versionsCollectionRef, {
    content: post.content,
    date: Timestamp.fromDate(new Date()),
  });
}

export async function getPost(slug: string) {
  const postDocument = doc(db, "posts", slug);
  const postSnapshot = await getDoc(postDocument);
  const postData = postSnapshot.data();

  const versionsCollectionRef = collection(db, `posts/${slug}/versions`);
  const lastVersionQuery = query(
    versionsCollectionRef,
    orderBy("date", "desc"),
    limit(1)
  );
  const versionSnapshot = await getDocs(lastVersionQuery);
  const lastVersionData = versionSnapshot.docs[0].data();

  const post = {
    title: postData.title,
    slug: postData.slug,
    date: postData.date.toDate().toDateString(),
    content: lastVersionData.content,
    lastEdited: lastVersionData.date.toDate().toDateString(),
    versionId: versionSnapshot.docs[0].id,
  };

  return post;
}

export async function editPost(
  slug: string,
  post: {
    title: string;
    content: string;
  }
) {
  if (post.title) {
    const postDocumentRef = doc(db, `posts/${slug}`);
    await setDoc(
      postDocumentRef,
      {
        title: post.title,
      },
      { merge: true }
    );
  }

  if (post.content) {
    const versionsCollectionRef = collection(db, `posts/${slug}/versions`);
    await addDoc(versionsCollectionRef, {
      content: post.content,
      date: Timestamp.fromDate(new Date()),
    });
  }
}

export async function addQuote(
  postSlug: string,
  postVersionId: string,
  startOffset: number,
  endOffset: number,
  text: string,
  startXpath: string,
  endXpath: string
) {
  const quotesCollectionRef = collection(db, `posts/${postSlug}/quotes`);
  await addDoc(quotesCollectionRef, {
    postVersionId,
    text,
    startXpath,
    endXpath,
    startOffset,
    endOffset,
  });
}

export async function addComment(
  postSlug: string,
  text: string,
  quote?: DocumentReference
) {
  const commentsCollectionRef = collection(db, `posts/${postSlug}/comments`);
  await addDoc(commentsCollectionRef, {
    text,
    ...(quote ? { quote } : {}),
    createdAt: Timestamp.fromDate(new Date()),
  });
}

export async function addResponse(
  postSlug: string,
  postVersionId: string,
  startOffset: number,
  endOffset: number,
  commentText: string,
  quoteText: string,
  startXpath: string,
  endXpath: string
) {
  const quotesCollectionRef = collection(db, `posts/${postSlug}/quotes`);
  const quoteDocumentRef = await addDoc(quotesCollectionRef, {
    postVersionId,
    startOffset,
    endOffset,
    text: quoteText,
    startXpath,
    endXpath,
  });
  await addComment(postSlug, commentText, quoteDocumentRef);
}

export async function getComments(postSlug: string) {
  const commentsCollectionRef = collection(db, `posts/${postSlug}/comments`);
  const lastVersionQuery = query(
    commentsCollectionRef,
    orderBy("createdAt", "desc")
  );
  const commentsSnapshot = await getDocs(lastVersionQuery);

  return await Promise.all(
    commentsSnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const quote: any = data.quote && (await getDoc(data.quote)).data();

      return {
        text: data.text,
        createdAt: data.createdAt.toDate().toDateString(),
        id: doc.id,
        ...(quote ? { quote } : {}),
      };
    })
  );
}
