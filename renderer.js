const information = document.getElementById("info");
information.innerText = `This app is using Chrome (v${window.versions.chrome()}), Node.js (v${window.versions.node()}), and Electron (v${window.versions.electron()})`;

const func = async () => {
	const response = await window.versions.ping();
	const text = await window.versions.message();
	console.log(text);

	const version = document.querySelector("#version");
	version.innerHTML = response;
};

window.versions.message(function (event, data) {
	console.log("received data", data);
});

func();

window.versions.message().then((data) => {
	console.log(data);
});
