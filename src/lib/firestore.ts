import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { getDb } from "./firebase";
import type { Entry, NewEntry } from "./types";

/** Path to a user's private entries subcollection. */
function entriesCollection(uid: string) {
  return collection(getDb(), "users", uid, "entries");
}

/** Save a completed questionnaire for the signed-in user. */
export async function saveEntry(uid: string, entry: NewEntry): Promise<string> {
  const ref = await addDoc(entriesCollection(uid), {
    ...entry,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

/** Load all of the user's entries, oldest first (handy for trend charts). */
export async function getEntries(uid: string): Promise<Entry[]> {
  const q = query(entriesCollection(uid), orderBy("createdAt", "asc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    const createdAt =
      data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : Date.now();
    return {
      id: doc.id,
      type: data.type,
      answers: data.answers ?? [],
      score: data.score ?? 0,
      note: data.note ?? "",
      referenceDate: data.referenceDate ?? "",
      createdAt,
    } as Entry;
  });
}
