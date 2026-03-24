import { collection, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect } from "react";
import API_URL from "../../config";
import { clientAuth, db } from "../../firebase";

const useChatMessages = (chatId, setMessages, setIsOnline, setLastSeen, setIsTyping) => {

  useEffect(() => {
    if (!clientAuth?.currentUser) return;
    if (!chatId) {
      setMessages([]);
      return;
    }
    try {
      // Check if chat is blocked first
      const chatDocRef = doc(db, "chats", chatId);
      const unsubscribeChat = onSnapshot(
        chatDocRef,
        (docSnap) => {
          if (docSnap.exists() && docSnap.data()?.blocked === true) {
            setMessages([]);
            return;
          }
        },
        (error) => { }
      );

      const q = query(
        collection(db, "chats", chatId, "messages"),
        orderBy("timestamp", "asc")
      );

      const unsubscribe = onSnapshot(
        q,
        async (snapshot) => {
          try {
            const messages = snapshot?.docs?.map(doc => doc.data());
            setMessages(messages);

            try {
              await fetch(`${API_URL}/chat/mark-as-read`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${await clientAuth?.currentUser?.getIdToken()}`,
                },
                body: JSON.stringify({ chatId: chatId }),
              });
            } catch (err) { }
          } catch (e) { }
        },
        (error) => {
          console.error("❗Firestore snapshot error:", error);
        }
      );

      const profileId = chatId.split("_").find(id => id !== clientAuth?.currentUser.uid);

      const onlineStatusDocRef = doc(
        collection(db, clientAuth?.currentUser.uid.slice(0, 4), profileId, "device"),
        "online"
      );

      const unsubscribeOnlineStatus = onSnapshot(
        onlineStatusDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setIsOnline(data?.online ?? false);
            setLastSeen(data?.lastSeen ?? null);
          } else {
            setIsOnline(false);
          }
        },
        (error) => {
          console.error("❗Firestore snapshot error (online):", error);
        }
      );

      const typingDocRef = doc(db, "chats", chatId, "typing", profileId);
      const unsubscribeTyping = onSnapshot(
        typingDocRef,
        (docSnap) => {
          if (docSnap.exists() && docSnap.data()?.isTyping) {
            if (docSnap.data().updatedAt && docSnap.data().updatedAt > Date.now() - 5000) {
              setIsTyping(true);
            } else setIsTyping(false);
          } else setIsTyping(false);
        },
        (error) => { }
      );

      return () => {
        unsubscribe();
        unsubscribeChat();
        unsubscribeOnlineStatus();
        unsubscribeTyping();
      }
    }
    catch (e) { }

  }, [chatId]);
};

export default useChatMessages;
