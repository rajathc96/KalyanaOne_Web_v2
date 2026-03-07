import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect } from "react";
import { clientAuth, db } from "../../firebase";

const useChats = (currentUserId, setData, setIsLoading) => {
    useEffect(() => {
        if (!clientAuth?.currentUser || !currentUserId) return;
        try {
            const q = query(
                collection(db, "chats"),
                where("participants", "array-contains", currentUserId),
                orderBy("lastTimestamp", "desc"));

            const unsubscribe = onSnapshot(q, (snapshot) => {
                try {
                    if (!snapshot?.empty) {
                        const updatedChats = snapshot?.docs
                            ?.filter((doc) => doc.data()?.blocked !== true)
                            ?.map((doc) => {
                                const data = doc.data();
                                const receiverId = data.participants.find((id) => id !== currentUserId);
                                const receiverData = data[receiverId] || null;

                                return {
                                    id: doc.id,
                                    lastMessage: data.lastMessage,
                                    lastSender: data.lastSender,
                                    lastTimestamp: data.lastTimestamp,
                                    readByReceiver: data.readByReceiver,
                                    receiverId,
                                    receiverData,
                                    deleted: data?.deleted || false,
                                };
                            });
                        setData(updatedChats);
                    }
                    else {
                        setData([]);
                    }
                }
                catch (er) { }
                finally {
                    setIsLoading(false);
                }
            });

            return () => {
                unsubscribe();
            };
        }
        catch (e) { }
    }, [currentUserId]);

};

export default useChats;
