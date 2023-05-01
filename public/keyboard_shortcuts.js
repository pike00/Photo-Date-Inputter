let rotation_map = new Map()
rotation_map.set("ArrowRight", 90)
rotation_map.set("ArrowLeft", -90)
rotation_map.set("ArrowUp", 180)
rotation_map.set("ArrowDown", 180)

let rotation = 0

function handleRotate(key) {
	console.log("Handling rotation for " + key)
	rotation += rotation_map.get(key)
	// Cast to 0-360 to avoid overflows
	rotation %= 360

	let photo = document.getElementById('photo')
	photo.style.transform = 'rotate(' + rotation + 'deg)'
	$(document).ready(function () {
		$("#rotation").val(rotation)
	})
}

function updateDateWithPrevious() {
	priordate = $("#prior_date").text()
	document.getElementById("date").value = priordate
}


document.addEventListener("keydown", function (event) {
	var star = false

	// Submit on Enter
	if (event.key === "Enter") {
		document.getElementById("submit").click()
	}

	//Ignore keystrokes if the active field is the "Others" box
	if (document.activeElement === document.getElementById("others")) {
		return
	}

	// If the active field isn't the date box, but a number is entered, focus the date box
	if (document.getElementById('date') !== document.activeElement &&
		jQuery.inArray(event.key, ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"])) {
		document.getElementById('date').focus()
		document.getElementById('date').textContent = event.key
	}

	if (event.key.length === 1 && event.key >= "a" && event.key <= "z") {
		document.getElementById("person-select").focus()
	}

	if (jQuery.inArray(event.key, ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"]) !== -1) {
		handleRotate(event.key)
	}

	if (event.key === "*") document.getElementById('star').checked = !document.getElementById('star').checked

	if (event.key === "d") updateDateWithPrevious()

	if (event.ctrlKey && event.key === "Enter") {
		document.getElementById("submit").click()
	}
});
