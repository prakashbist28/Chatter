// import { createContext, useState, useRef, useEffect } from "react";
// import { io } from "socket.io-client";
// import { host, allUsersRoute } from "../utils/APIroutes";
// import axios from "axios";

// export const AppContext = createContext();

// export const AppProvider = ({ children }) => {
//   const [currentuser, setcurrentuser] = useState(undefined);
//   const [contacts, setcontacts] = useState([]);
//   const [currentChat, setCurrentChat] = useState(undefined);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [onlineUsers, setOnlineUsers] = useState({});
//   const [latestMsgUpdate, setLatestMsgUpdate] = useState(0); // Trigger for re-fetch
//   const socket = useRef();

//   // Initialize socket
//   useEffect(() => {
//     if (!currentuser?._id) return;

//     if (!socket.current || !socket.current.connected) {
//       socket.current = io(host);
//     }

//     socket.current.emit("add-user", currentuser._id);

//     socket.current.on("get-online-users", (initialOnlineUsers) => {
//       const onlineMap = initialOnlineUsers.reduce((acc, userId) => {
//         acc[userId] = true;
//         return acc;
//       }, {});
//       setOnlineUsers(onlineMap);
//     });

//     socket.current.on("user-status-changed", ({ userId, isOnline }) => {
//       setOnlineUsers((prev) => ({ ...prev, [userId]: isOnline }));
//     });

//     socket.current.on("msg-receive", () => {
//       setLatestMsgUpdate((prev) => prev + 1); // Trigger contacts re-fetch
//     });
//   }, [currentuser]);

//   // Fetch contacts + merge with latest messages
//   useEffect(() => {
//     const fetchContacts = async () => {
//       if (!currentuser || !currentuser.isAvatarImageSet) return;

//       try {
//         const { data: contactsData } = await axios.get(
//           `${allUsersRoute}/${currentuser._id}`
//         );

//         const { data: latestMsgs } = await axios.get(
//           `${host}/api/messages/latest/${currentuser._id}`
//         );

//         const merged = contactsData.map((contact) => {
//           const latest = latestMsgs.find((msg) => msg.contactId === contact._id);
//           return {
//             ...contact,
//             lastMessage: latest?.lastMessage || "",
//             lastMessageTime: latest?.lastMessageTime || null,
//             unreadCount: latest?.unreadCount || 0,
//           };
//         });

//         merged.sort((a, b) => {
//           if (!a.lastMessageTime) return 1;
//           if (!b.lastMessageTime) return -1;
//           return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
//         });

//         setcontacts(merged);
//       } catch (error) {
//         console.error("Error fetching contacts or latest messages:", error);
//       }
//     };

//     fetchContacts();
//   }, [currentuser, latestMsgUpdate]);

  

//   return (
//     <AppContext.Provider
//       value={{
//         currentuser,
//         setcurrentuser,
//         contacts,
//         setcontacts,
//         currentChat,
//         setCurrentChat,
//         socket,
//         isLoaded,
//         setIsLoaded,
//         onlineUsers,
//         setOnlineUsers,
//         latestMsgUpdate, 
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   );
// };

import { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { host, allUsersRoute } from "../utils/APIroutes";
import axios from "axios";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentuser, setcurrentuser] = useState(undefined);
  const [contacts, setcontacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [latestMsgUpdate, setLatestMsgUpdate] = useState(0);
  const socket = useRef();

  // Mark messages as read for a contact
  const markMessagesAsRead = async (contactId) => {
    if (!currentuser?._id) return;
    try {
      await axios.post(`${host}/api/messages/mark-read`, {
        userId: currentuser._id,
        contactId,
      });
      setLatestMsgUpdate((prev) => prev + 1); // Trigger contacts re-fetch
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  // Initialize socket
  useEffect(() => {
    if (!currentuser?._id) return;

    if (!socket.current || !socket.current.connected) {
      socket.current = io(host);
    }

    socket.current.emit("add-user", currentuser._id);

    socket.current.on("get-online-users", (initialOnlineUsers) => {
      const onlineMap = initialOnlineUsers.reduce((acc, userId) => {
        acc[userId] = true;
        return acc;
      }, {});
      setOnlineUsers(onlineMap);
    });

    socket.current.on("user-status-changed", ({ userId, isOnline }) => {
      setOnlineUsers((prev) => ({ ...prev, [userId]: isOnline }));
    });

    // Listen for incoming messages
    socket.current.on("msg-receive", (msg) => {
      setLatestMsgUpdate((prev) => prev + 1);
      // If the message is for the currently open chat, mark as read immediately
      if (currentChat && msg.from === currentChat._id) {
        markMessagesAsRead(currentChat._id);
      }
    });
  }, [currentuser, currentChat]); // Add currentChat as dependency

  // Fetch contacts + merge with latest messages
  useEffect(() => {
    const fetchContacts = async () => {
      if (!currentuser || !currentuser.isAvatarImageSet) return;

      try {
        const { data: contactsData } = await axios.get(
          `${allUsersRoute}/${currentuser._id}`
        );

        const { data: latestMsgs } = await axios.get(
          `${host}/api/messages/latest/${currentuser._id}`
        );

        const merged = contactsData.map((contact) => {
          const latest = latestMsgs.find((msg) => msg.contactId === contact._id);
          return {
            ...contact,
            lastMessage: latest?.lastMessage || "",
            lastMessageTime: latest?.lastMessageTime || null,
            unreadCount: latest?.unreadCount || 0,
          };
        });

        merged.sort((a, b) => {
          if (!a.lastMessageTime) return 1;
          if (!b.lastMessageTime) return -1;
          return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
        });

        setcontacts(merged);
      } catch (error) {
        console.error("Error fetching contacts or latest messages:", error);
      }
    };

    fetchContacts();
  }, [currentuser, latestMsgUpdate]);

  return (
    <AppContext.Provider
      value={{
        currentuser,
        setcurrentuser,
        contacts,
        setcontacts,
        currentChat,
        setCurrentChat,
        socket,
        isLoaded,
        setIsLoaded,
        onlineUsers,
        setOnlineUsers,
        latestMsgUpdate,
        markMessagesAsRead, // <-- add this
      }}
    >
      {children}
    </AppContext.Provider>
  );
};