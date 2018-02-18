import React from 'react';

const Message = ({chat, user}) => (
    <li className={`chat ${user === chat.username ? "right" : "left"}`}>
        {user !== chat.username && (<strong>{chat.username}:</strong>)}
       <p className='chatParagraph'>
      {chat.content}</p>
    </li>
);

export default Message;