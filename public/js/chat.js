const socket = io()


const $inputForm = document.getElementById("chat-form")
const $input = document.getElementById("msg")
const $sendBtn = document.getElementById("send-btn")
const $sendLocation = document.getElementById("myBtn")
const $messagesDiv = document.getElementById("messages")
const $leaveBtn = document.getElementById("leave-btn")
const $users = document.getElementById("users")
const $roomName = document.getElementById("room-name")

const messageTemplate = document.getElementById("message-template").innerHTML
const locationTemplate = document.getElementById("location-template").innerHTML
const onlineUsersTemplate = document.getElementById("online-users-template").innerHTML
const roomNameTemplate = document.getElementById("room-name-template").innerHTML

const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})


$inputForm.addEventListener('submit', (e) => {
	e.preventDefault()

	$sendBtn.setAttribute("disabled","disabled")
	const message = $input.value

	socket.emit('sendMessage', message, (error) => {

		$sendBtn.removeAttribute("disabled")
		$input.value = ''
		$input.focus()

		if(error){
			return console.log(error)
		}
		console.log('Message delivered')
	})
})

$sendLocation.addEventListener('click', (e) => {
	if(!navigator.geolocation){
		return alert("Your browser does not support geolocation :(")
	}
	$sendLocation.setAttribute("disabled","disbaled")
	navigator.geolocation.getCurrentPosition((position) => {
		socket.emit('sendLocation', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		}, () => {
			$sendLocation.removeAttribute("disabled")
		})
	})
})

$leaveBtn.addEventListener("click", (e) => {
	const exitRoom = confirm("Leave room? ")
	if(exitRoom){
		location.href = '/'
	}
})

socket.on('message', (message) => {
	const requiredHtml = Mustache.render(messageTemplate, {
		username: message.username,
		message: message.text,
		time: moment(message.createdAt).format("h:mm a")

	})

	$messagesDiv.insertAdjacentHTML("beforeend", requiredHtml)
	$messagesDiv.scrollTop = $messagesDiv.scrollHeight;
})

socket.on('locationMessage', (link) => {
	const requiredHtml = Mustache.render(locationTemplate, {
		username: link.username,
		url: link.url,
		time: moment(link.createdAt).format("h:mm a")
	})

	$messagesDiv.insertAdjacentHTML("beforeend", requiredHtml)
	$messagesDiv.scrollTop = $messagesDiv.scrollHeight;
})

socket.on('usersInRoom', ({room, users}) => {
	const requiredHtml = Mustache.render(onlineUsersTemplate, {
		users
	})

	$users.innerHTML = requiredHtml

	const nextHtml = Mustache.render(roomNameTemplate, {
		room		
	})

	$roomName.textContent = nextHtml
})


socket.emit('join', {username, room}, (error) => {
	if(error){
		alert(error)
		location.href = '/'
	}
})