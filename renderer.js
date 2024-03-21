const information = document.getElementById("info");
information.innerText = `This app is using Chrome (v${window.versions.chrome()}), Node.js (v${window.versions.node()}), and Electron (v${window.versions.electron()})`;

const func = async () => {
	const response = await window.versions.ping();
	const version = document.querySelector("#version")
	version.innerHTML = response;
};

func();
