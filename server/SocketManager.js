const io = require('./index.js').io

const { VERIFY_USER, USER_CONNECTED, USER_DISCONNECTED, 
		LOGOUT, COMMUNITY_CHAT, MESSAGE_RECIEVED, MESSAGE_SENT,
		TYPING,PRIVATE_MESSAGE,NEW_CHAT_USER  } = require('../client/src/Events')

const { createUser, createMessage, createChat, isCommunity } = require('../client/src/Factories')

let connectedUsers = { }

let communityChat = createChat(isCommunity,true);

module.exports = function(socket){
					
	
	//console.log("Socket Id:" + socket.id);

	let sendMessageToChatFromUser;

	let sendTypingFromUser;

	
	socket.on(VERIFY_USER, (nickname, callback)=>{
		if(isUser(connectedUsers, nickname)){
			callback({ isUser:true, user:null })
		}else{
			callback({ isUser:false, user:createUser({name:nickname, socketId:socket.id})})
		}
	})

	
	socket.on(USER_CONNECTED, (user)=>{
		user.socketId = socket.id
		connectedUsers = addUser(connectedUsers, user)
		socket.user = user

		sendMessageToChatFromUser = sendMessageToChat(user.name)
		sendTypingFromUser = sendTypingToChat(user.name)

		io.emit(USER_CONNECTED, connectedUsers)
		console.log(connectedUsers);

	})
	
	
	socket.on('disconnect', ()=>{
		if("user" in socket){
			connectedUsers = removeUser(connectedUsers, socket.user.name)

			io.emit(USER_DISCONNECTED, connectedUsers)
			console.log("Disconnect", connectedUsers);
		}
	})



	socket.on(LOGOUT, ()=>{
		connectedUsers = removeUser(connectedUsers, socket.user.name)
		io.emit(USER_DISCONNECTED, connectedUsers)
		console.log("Disconnect", connectedUsers);

	})

	//Get Community Chat
	socket.on(COMMUNITY_CHAT, (callback)=>{
		callback(communityChat)
	})

	socket.on(MESSAGE_SENT, ({chatId, message})=>{
		sendMessageToChatFromUser(chatId, message)
	})

	socket.on(TYPING, ({chatId, isTyping})=>{
		sendTypingFromUser(chatId, isTyping)
	})

	socket.on(PRIVATE_MESSAGE, ({receiver, sender}) => {
		if(receiver in connectedUsers) {
			const newChat = createChat({name: `${receiver}&${sender}`, users:[receiver, sender] })
		const receiverSocket = connectedUsers[receiver].socketId
		socket.to(receiverSocket).emit(PRIVATE_MESSAGE, newChat)
		socket.emit(PRIVATE_MESSAGE, newChat)
		}else{
			if(!(receiver in activeChat.users)) {
				activeChat.users
				.filter(user => user in connectedUsers)
				.map( user => connectedUsers[user])
				.map(user => {
					socket.to(user.socketId).emit(NEW_CHAT_USER, { chatID: activeChat.id, newUser: receiver})

				})
				socket.emit(NEW_CHAT_USER, { chatId: activeChat.id, newUser: receiver})
			}
			socket.to(receiverSocket).emit(PRIVATE_MESSAGE, activeChat)
		}
	} )

}


function sendTypingToChat(user){
	return (chatId, isTyping)=>{
		io.emit(`${TYPING}-${chatId}`, {user, isTyping})
	}
}


function sendMessageToChat(sender){
	return (chatId, message)=>{
		io.emit(`${MESSAGE_RECIEVED}-${chatId}`, createMessage({message, sender}))
	}
}


function addUser(userList, user){
	let newList = Object.assign({}, userList)
	newList[user.name] = user
	return newList
}


function removeUser(userList, username){
	let newList = Object.assign({}, userList)
	delete newList[username]
	return newList
}


function isUser(userList, username){
  	return username in userList
}