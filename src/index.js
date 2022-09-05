const express = require ("express")
const http = require("http")
const path = require("path")
const socketio = require("socket.io")
const port = 3000;
const {generateMessage, generateLocationMessage} = require("./utils/generate")
const {addUser, removeUser, getActiveUser, getAllUsersInRoom} = require("./utils/users")
const publicDirectoryPath = path.join(__dirname, "../public")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
	console.log("websocket-connection on")
	
	socket.on('join', (options, callback) => {
		const {error, user} = addUser({id: socket.id, ...options})
		if(error){
			return callback(error)
		}
			
		socket.join(user.room)

		socket.emit('message', generateMessage("Aladey-C", `Welcome to this Chat-room, ${user.username}.`));
		socket.broadcast.to(user.room).emit('message', generateMessage("Aladey-C", `${user.username} just joined...`))
		io.to(user.room).emit("usersInRoom", {
			room: user.room,
			users: getAllUsersInRoom(user.room)
		})
		callback()
	})

	socket.on('sendMessage', (message, callback) => {
		const user = getActiveUser(socket.id)


		io.to(user.room).emit('message', generateMessage(user.username, message))
				
		callback()
	})

	socket.on('sendLocation', (coords, callback) => {
		const user = getActiveUser(socket.id)
		
		io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
		callback()
	})
	
	socket.on('disconnect', () => {
		const user = removeUser(socket.id)
		if(user){
			io.to(user.room).emit('message', generateMessage("Aladey-C", `${user.username} has left the Chat-room...`))
			console.log("web-connection closed")
			io.to(user.room).emit("usersInRoom", {
				room: user.room,
				users: getAllUsersInRoom(user.room)
			})
		}
	})
})

server.listen(port, () => {
	console.log(`Server running on port ` + port)
})
