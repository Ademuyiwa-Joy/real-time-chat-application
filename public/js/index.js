const form = document.getElementById("form")
const roomName = document.getElementById("email")
const chatChannel = document.getElementById("room")



form.addEventListener("submit", () => {
	if(roomName.value === ""){
		roomName.value = chatChannel.value
	}
})