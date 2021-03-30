const JSON_ADDRESS = "127.0.0.1";
const JSON_PORT = 7190;
const POLLING_RATE = 1000;

const JSON_ENDPOINT = `http://${JSON_ADDRESS}:${JSON_PORT}/`;

var CurrentMap = "";

window.onload = function () {
	getData();
	setInterval(getData, POLLING_RATE);
};

var Desc = function (a, b) {
	if (a > b) return -1;
	if (a < b) return +1;
	return 0;
};

function getData() {
	fetch(JSON_ENDPOINT)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			appendData(data);
		})
		.catch(function (err) {
			clearData();
			console.log("Error: " + err);
		});
}

function appendData(data) {
	var mainContainer = document.getElementById("srtQueryData");
	mainContainer.innerHTML = "";

	mainContainer.innerHTML += `
	<div class="tag">
		<i class="fas fa-skull"></i>
	</div>
	<div id="valueBoss"><font size="4" color="#ff0000">0</font></div>`

	var BossHP = document.getElementById('valueBoss');

	var filterdEnemies = data.EnemyHealth.filter(m => { return m.MaximumHP == 30000 });
	//console.log("Filtered Enemies", filterdEnemies);
	filterdEnemies.sort(function (a, b) { return Asc(a.Percentage, b.Percentage) || Desc(a.CurrentHP, b.CurrentHP); }).forEach(function (item, index, arr) {
		if (item.IsAlive && index < 1) {
			BossHP.innerHTML = `<font size="4" color="#ff0000">${item.CurrentHP}</font>`;
		}
	});

	if (data.MapName.includes("Boss2F") || data.MapName.includes("Boss1F"))
	{
		console.log("Jack 3 Fight Started...");
		data.JackEyeHealth.sort(function (a, b) { return Desc(a.CurrentHP, b.CurrentHP); }).forEach(function (item, index) {
			if (item.IsAlive) {
				mainContainer.innerHTML += `<div class="tag"><i class="fas fa-eye"></i></div><div id="value"><font size="4" color="#ff0000">${item.CurrentHP}</font></div>`;
			}
		});
	}
}

function clearData() {
	var mainContainer = document.getElementById("srtQueryData");
	mainContainer.innerHTML = "";
}
