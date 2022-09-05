const users = []

const addUser = ({id, username, room}) => {
	username = username.trim()
	room = room.trim()

	if(!username || !room){
		return {
			error: "Username and room are required."
		}
	}

	const existingUser = users.find((user) => user.room === room && user.username === username)
	
	if(existingUser){
		return {
			error: "Username is already in use, please choose another."
		}
	}

	const user = {id, username, room}
	users.push(user)
	return {user}
}

const removeUser = (id) => {
	const userIndex = users.findIndex((user) => user.id === id)

	if(userIndex !== -1){
		return users.splice(userIndex, 1)[0]
	}
}

const getActiveUser = (id) => {
	return users.find((user) => user.id === id)	
}

const getAllUsersInRoom = (room) => {
	room.trim()
	return users.filter((user) => user.room === room)
}

module.exports = {
	addUser,
	getActiveUser,
	getAllUsersInRoom,
	removeUser
}
