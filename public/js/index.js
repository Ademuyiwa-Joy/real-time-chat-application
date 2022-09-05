const form = document.getElementById("form")
const roomName = document.getElementById("room")
const chatChannel = document.getElementById("select")



form.addEventListener("submit", () => {
	if(roomName.value == ""){
		roomName.value = chatChannel.value
	}
})