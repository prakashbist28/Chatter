// import React, { useState, useContext } from "react";
// import styled from "styled-components";
// import { AppContext } from "../context/AppContext";

// const Contacts = ({ changeChat }) => {
//   const { contacts, currentuser, onlineUsers } = useContext(AppContext);
//   const [currentSelected, setCurrentSelected] = useState(undefined);
//   const [search, setSearch] = useState("");
//   const [visibleCount, setVisibleCount] = useState(8);

//   const changeCurrentChat = (index, contact) => {
//     setCurrentSelected(index);
//     changeChat(contact);
//   };

//   const filteredContacts = contacts
//     .filter((item) => item.username.toLowerCase().includes(search.toLowerCase()))
//     .slice(0, visibleCount);

//   const isContactOnline = (contactId) => onlineUsers && onlineUsers[contactId];

//   return (
//     <Container>
//       <div className="brand">
//         <input
//           className="searchbar"
//           placeholder="Search by username..."
//           onChange={(e) => {
//             setSearch(e.target.value);
//             setVisibleCount(8);
//           }}
//         />
//       </div>

//       <div className="contacts">
//         {filteredContacts.length > 0 ? (
//           filteredContacts.map((contact, index) => (
//             <div
//               key={contact._id}
//               className={`contact ${index === currentSelected ? "selected" : ""}`}
//               onClick={() => changeCurrentChat(index, contact)}
//             >
//               <div className="avatar-wrapper">
//                 <div className="avatar">
//                   <img
//                     src={`data:image/svg+xml;base64,${contact.avatarImage}`}
//                     alt={contact.username}
//                     onError={(e) => {
//                       e.target.src =
//                         "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23999'/%3E%3C/svg%3E";
//                     }}
//                   />
//                 </div>
//                 <span
//                   className={`status-indicator ${
//                     isContactOnline(contact._id) ? "online" : "offline"
//                   }`}
//                   title={isContactOnline(contact._id) ? "Online" : "Offline"}
//                 ></span>
//               </div>

//               <div className="contact-info">
//                 <h3>{contact.username}</h3>
//                 <span className="last-message">{contact.lastMessage}</span>
//               </div>

//               <div className="message-right">
//                 {contact.unreadCount > 0 && (
//                   <span className="unread-count">{contact.unreadCount}</span>
//                 )}
//                 {contact.lastMessageTime && (
//                   <div className="message-details">
//                   <span className="last-message-time">
//                     {new Date(contact.lastMessageTime).toLocaleTimeString([], {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })}
//                   </span>
//                   <span className="last-message-date">
//                     {new Date(contact.lastMessageTime).toLocaleDateString([], {
//                       day: "2-digit",
//                       month: "2-digit",
//                       year:"numeric",
//                     })}
//                   </span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))
//         ) : (
//           <div style={{ color: "white" }}>No contacts found</div>
//         )}

//         {visibleCount < contacts.length && (
//           <button className="load-more" onClick={() => setVisibleCount((v) => v + 4)}>
//             Load More
//           </button>
//         )}
//       </div>

//       <div className="current-user">
//         <div className="avatar">
//           <img
//             src={`data:image/svg+xml;base64,${currentuser?.avatarImage}`}
//             alt={currentuser?.username}
//             onError={(e) => {
//               e.target.src =
//                 "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23999'/%3E%3C/svg%3E";
//             }}
//           />
//         </div>
//         <div className="username">
//           <h3>{currentuser?.username}</h3>
//           <span className="status-text">You</span>
//         </div>
//       </div>
//     </Container>
//   );
// };


// const Container = styled.div`
//   display: grid;
//   grid-template-rows: auto 1fr auto;
//   height: 100%;
//   border-radius: 25px;
//   backdrop-filter: blur(50px);
//   border: 1px solid #b700ff;
//   overflow: hidden;
//   background-color: rgba(0, 0, 0, 0.3);

//   .brand {
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     gap: 1rem;
//     background: black;
//     box-shadow: 0px 0px 10px #ad10f6;
//     padding: 0.5rem;

//     .searchbar {
//       width: 14rem;
//       border: 1px solid #ad10f6;
//       padding: 0.5rem;
//       border-radius: 30px;
//       background: transparent;
//       color: white;
//       outline: none;
//       &:focus {
//         box-shadow: 0px 0px 10px #b700ff;
//       }
//     }
//   }

//   .contacts {
//     display: flex;
//     align-items: center;
//     flex-direction: column;
//     overflow-y: auto;
//     gap: 0.8rem;
//     padding: 1rem;

//     &::-webkit-scrollbar {
//       width: 0.2rem;
//     }
//     &::-webkit-scrollbar-thumb {
//       background-color: #b700ff;
//       border-radius: 1rem;
//     }

//     .contact {
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       background-color: #c53eff6d;
//       min-height: 5rem;
//       cursor: pointer;
//       width: 90%;
//       border-radius: 20px;
//       padding: 0.4rem 1rem;
//       border: 1px solid #b700ff;
//       transition: 0.25s ease-in-out;

//       &:hover {
//         background-color: #00000061;
//       }

//       .avatar-wrapper {
//         position: relative;
//         display: flex;
//         align-items: center;
//         gap: 0.5rem;

//         .avatar {
//           border-radius: 50%;
//           overflow: hidden;
//           background-color: #333;
//           img {
//             height: 3rem;
//             width: 3rem;
//             object-fit: cover;
//           }
//         }

//         .status-indicator {
//           position: absolute;
//           bottom: 0;
//           right: 0;
//           width: 12px;
//           height: 12px;
//           border-radius: 50%;
//           border: 2px solid #000;
//           background-color: #888;
//           &.online {
//             background-color: #4ade80;
//             box-shadow: 0 0 8px #4ade80, inset 0 0 4px rgba(74, 222, 128, 0.6);
//           }
//           &.offline {
//             background-color: #888;
//           }
//         }
//       }

//       .contact-info {
//         flex: 1;
//         display: flex;
//         flex-direction: column;
//         gap: 0.2rem;
//         margin-left: 0.5rem;
//         overflow: hidden;

//         h3 {
//           color: white;
//           margin: 0;
//           font-size: 1rem;
//           white-space: nowrap;
//           text-overflow: ellipsis;
//           overflow: hidden;
//         }

//         .last-message {
//           color: #ccc;
//           font-size: 0.8rem;
//           white-space: nowrap;
//           text-overflow: ellipsis;
//           overflow: hidden;
//         }
//       }

//       .message-right {
//         display: flex;
//         flex-direction: column;
//         align-items: flex-end;
//         gap: 0.3rem;

//         .unread-count {
//           background-color: #b700ff;
//           color: white;
//           font-size: 0.7rem;
//           font-weight: bold;
//           padding: 2px 6px;
//           border-radius: 10px;
//         }

//         .message-details{
//           display: flex;
//           flex-direction: column;
//           align-items: center;

//           .last-message-time {
//           font-size: 0.7rem;
//           color: #aaa;
//         }
//         .last-message-date {
//           font-size: 0.7rem;
//           color: #aaa;
//         }

//         }

//       }
//     }

//     .selected {
//       background-color: #8a00c145;
//       border: 1px solid #ad10f6;
//       box-shadow: 0 0 10px rgba(173, 16, 246, 0.5);
//     }

//     .load-more {
//       padding: 0.5rem 1.2rem;
//       margin-top: 10px;
//       border-radius: 10px;
//       border: 1px solid #b700ff;
//       background: #b700ff;
//       color: white;
//       cursor: pointer;
//       transition: 0.3s ease;
//       &:hover {
//         background: #000;
//         box-shadow: 0 0 10px #b700ff;
//       }
//     }
//   }

//   .current-user {
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     gap: 2rem;
//     background-color: #000000;
//     border-radius: 1rem;
//     box-shadow: 0px 0px 10px #ad10f6;
//     padding: 0.5rem;

//     .avatar img {
//       height: 4rem;
//       width: 4rem;
//       object-fit: cover;
//       border-radius: 50%;
//     }

//     .username {
//       display: flex;
//       flex-direction: column;
//       gap: 0.2rem;

//       h3 {
//         color: #f9f9f9;
//         margin: 0;
//       }

//       .status-text {
//         color: #aaa;
//         font-size: 0.8rem;
//         font-weight: 500;
//       }
//     }
//   }
// `;

// export default Contacts;



// filepath: d:\Projects-MERN\Projects\chatter\public\src\components\Contacts.jsx
import React, { useState, useContext } from "react";
import styled from "styled-components";
import { AppContext } from "../context/AppContext";

const Contacts = ({ changeChat }) => {
  const { contacts, currentuser, onlineUsers } = useContext(AppContext);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  const filteredContacts = contacts
    .filter((item) => item.username.toLowerCase().includes(search.toLowerCase()))
    .slice(0, visibleCount);

  const isContactOnline = (contactId) => onlineUsers && onlineUsers[contactId];

  return (
    <Container>
      <div className="brand">
        <input
          className="searchbar"
          placeholder="Search by username..."
          onChange={(e) => {
            setSearch(e.target.value);
            setVisibleCount(8);
          }}
        />
      </div>

      <div className="contacts">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact, index) => (
            <div
              key={contact._id}
              className={`contact ${index === currentSelected ? "selected" : ""}`}
              onClick={() => changeCurrentChat(index, contact)}
            >
              <div className="avatar-wrapper">
                <div className="avatar">
                  <img
                    src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                    alt={contact.username}
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23999'/%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <span
                  className={`status-indicator ${
                    isContactOnline(contact._id) ? "online" : "offline"
                  }`}
                  title={isContactOnline(contact._id) ? "Online" : "Offline"}
                ></span>
              </div>

              <div className="contact-info">
                <h3>{contact.username}</h3>
                <span className="last-message">{contact.lastMessage}</span>
              </div>

              <div className="message-right">
                {contact.unreadCount > 0 && (
                  <span className="unread-count">{contact.unreadCount}</span>
                )}
                {contact.lastMessageTime && (
                  <div className="message-details">
                  <span className="last-message-time">
                    {new Date(contact.lastMessageTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="last-message-date">
                    {new Date(contact.lastMessageTime).toLocaleDateString([], {
                      day: "2-digit",
                      month: "2-digit",
                      year:"numeric",
                    })}
                  </span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div style={{ color: "white" }}>No contacts found</div>
        )}

        {visibleCount < contacts.length && (
          <button className="load-more" onClick={() => setVisibleCount((v) => v + 4)}>
            Load More
          </button>
        )}
      </div>

      <div className="current-user">
        <div className="avatar">
          <img
            src={`data:image/svg+xml;base64,${currentuser?.avatarImage}`}
            alt={currentuser?.username}
            onError={(e) => {
              e.target.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23999'/%3E%3C/svg%3E";
            }}
          />
        </div>
        <div className="username">
          <h3>{currentuser?.username}</h3>
          <span className="status-text">You</span>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100%;
  border-radius: 25px;
  backdrop-filter: blur(50px);
  border: 1px solid #b700ff;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.3);

  .brand {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    background: black;
    box-shadow: 0px 0px 10px #ad10f6;
    padding: 0.5rem;

    .searchbar {
      width: 14rem;
      border: 1px solid #ad10f6;
      padding: 0.5rem;
      border-radius: 30px;
      background: transparent;
      color: white;
      outline: none;
      &:focus {
        box-shadow: 0px 0px 10px #b700ff;
      }
    }
  }

  .contacts {
    display: flex;
    align-items: center;
    flex-direction: column;
    overflow-y: auto;
    gap: 0.8rem;
    padding: 1rem;

    &::-webkit-scrollbar {
      width: 0.2rem;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #b700ff;
      border-radius: 1rem;
    }

    .contact {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #c53eff6d;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 20px;
      padding: 0.4rem 1rem;
      border: 1px solid #b700ff;
      transition: 0.25s ease-in-out;

      &:hover {
        background-color: #00000061;
      }

      .avatar-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        .avatar {
          border-radius: 50%;
          overflow: hidden;
          background-color: #333;
          img {
            height: 3rem;
            width: 3rem;
            object-fit: cover;
          }
        }

        .status-indicator {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid #000;
          background-color: #888;
          &.online {
            background-color: #4ade80;
            box-shadow: 0 0 8px #4ade80, inset 0 0 4px rgba(74, 222, 128, 0.6);
          }
          &.offline {
            background-color: #888;
          }
        }
      }

      .contact-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        margin-left: 0.5rem;
        overflow: hidden;

        h3 {
          color: white;
          margin: 0;
          font-size: 1rem;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .last-message {
          color: #ccc;
          font-size: 0.8rem;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }

      .message-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.3rem;

        .unread-count {
          background-color: #b700ff;
          color: white;
          font-size: 0.7rem;
          font-weight: bold;
          padding: 2px 6px;
          border-radius: 10px;
        }

        .message-details{
          display: flex;
          flex-direction: column;
          align-items: center;

          .last-message-time {
          font-size: 0.7rem;
          color: #aaa;
        }
        .last-message-date {
          font-size: 0.7rem;
          color: #aaa;
        }

        }

      }
    }

    .selected {
      background-color: #8a00c145;
      border: 1px solid #ad10f6;
      box-shadow: 0 0 10px rgba(173, 16, 246, 0.5);
    }

    .load-more {
      padding: 0.5rem 1.2rem;
      margin-top: 10px;
      border-radius: 10px;
      border: 1px solid #b700ff;
      background: #b700ff;
      color: white;
      cursor: pointer;
      transition: 0.3s ease;
      &:hover {
        background: #000;
        box-shadow: 0 0 10px #b700ff;
      }
    }
  }

  .current-user {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    background-color: #000000;
    border-radius: 1rem;
    box-shadow: 0px 0px 10px #ad10f6;
    padding: 0.5rem;

    .avatar img {
      height: 4rem;
      width: 4rem;
      object-fit: cover;
      border-radius: 50%;
    }

    .username {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;

      h3 {
        color: #f9f9f9;
        margin: 0;
      }

      .status-text {
        color: #aaa;
        font-size: 0.8rem;
        font-weight: 500;
      }
    }
  }
`;

export default Contacts;