var mymap = L.map('mapid').setView([51.505, -0.09], 4);//coordinates and zoom view
let listbox=document.getElementById("Country");
var OpenStreetMap_DE = L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
getGlobalData();
getCountriesData();
OpenStreetMap_DE.addTo(mymap);
//click_div();
init_chart();
function drawCircle(element){
	let{countryInfo}=element;
	let{lat,long}=countryInfo;
	var circle = L.circle([lat, long],{
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: (element.active/5+(element.casesPerOneMillion*2)+(element.cases/60))
	}).addTo(mymap);
	createPopup(element,circle);
};
function createPopup(element,circle){
	circle.bindPopup(`<div><h6><b>${element.country}</b></h6><p><b>Cases Today: </b>${element.todayCases}</p><p><b>Active: </b>${element.active}</p><p><b>Recovered: </b>${element.recovered}</div>`);
}
function addCountryData_Map(data){
	data.forEach((element)=>{
		drawCircle(element);
	});
};
function globalData(data){
	var newCases=document.getElementById("newCases");
	newCases.innerHTML=data.todayCases;
	var newRecovered=document.getElementById("newRecovered");
	newRecovered.innerHTML=data.todayRecovered;
	var newDeaths=document.getElementById("newDeaths");
	newDeaths.innerHTML=data.todayDeaths;
};
function createTable(countries) {
	// body... 
	var table=document.querySelector("tbody");
	for(let i=0;i<countries.length;i++){
		populate_listbox(countries[i].country);
		table.innerHTML+=`<tr><th scope="row">${countries[i].country}</th><td>${countries[i].todayCases}</td>
		<td>${countries[i].todayDeaths}</td><td>${countries[i].cases}</td><td>${countries[i].deaths}</td></tr>`
	}
};
function getGlobalData(){
	fetch("https://disease.sh/v3/covid-19/all").then((response)=>{
		return response.json();
	}).then((data)=>{
		globalData(data);
		console.log(data);
	})
};
function getCountriesData() {
	// body...
	fetch("https://disease.sh/v3/covid-19/countries").then((response)=>{
		return response.json();
	}).then((data)=>{
		createTable(data);
		console.log(data);
		addCountryData_Map(data);
		create_chart(get_continent_stats(data));
	}) 
};
function click_listbox() {
	get_country_data(listbox.value);
}
function populate_listbox (country) {
	listbox.innerHTML+=`<option value='${country}'>${country}</option>`
};
function get_country_data(country) {
	if(country!='Global'){
		fetch(`https://disease.sh/v3/covid-19/countries/${country}`).then((response)=>{
			return response.json();
		}).then((data)=>{
			console.log(data);
			let{countryInfo}=data;
			let{lat,long}=countryInfo;
			focus_country(lat,long,data);
		});
	}
	else{
		var card=document.getElementById("Country-Card");
		card.style.display = 'none';
	}
};
function focus_country(lat,long,data) {
	mymap.setView([lat,long]);
	populate_country_card(data);
};
function populate_country_card(data){
	var card=document.getElementById("Country-Card");
	card.style.display = 'block';
	card.innerHTML=`<div class="card country-info" style="width: 18rem;"><img src="${data.countryInfo.flag}" class="card-img-top" alt="..."><div class="card-body"><h5 class="card-title">${data.country}</h5>
	<p class="card-text"><b>Active:</b> ${data.active}<br><b>Recovered:</b> ${data.recovered}<br><b>Deceased:</b> ${data.deaths}<br>
	<b>Cases Today:</b> ${data.todayCases}<br>
	<b>Tests:</b> ${data.tests}</p>
    </div></div>`
}
function get_continent_stats(data){
	let continents=['Asia','Europe','Africa','Australia-Oceania','South America','North America'];
	let numbers=[];
	for(let i=0;i<continents.length;i++){
		numbers.push(data.filter((element,index)=>{
			return element.continent==continents[i];
		}).reduce((sum,currentValue)=>{
			return sum+currentValue.active;
		}, 0));
	}
	return numbers;
}

function render_chart(label,color) {
	const dataArray=fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=30").then((response)=>{
		return response.json();
	}).then((data)=>{
		console.log(data)
		if(label=="Cases"){
			let values=Object.keys(data.cases).map(element=>{
				return data.cases[element];
			});
			create_line_graph(Object.keys(data.cases),[values],[label],color);
		}
		else if(label=="Deaths"){
			let values2=Object.keys(data.cases).map(element=>{
				return data.deaths[element];
			});
			create_line_graph(Object.keys(data.cases),[values2],[label],color);
		}
	});
}

function init_chart() {
	render_chart("Cases","rgb(255, 54, 54)");
	div_click();
}

function div_click() {
	// body... 
	let btns=document.getElementsByClassName("top-card");
	const typeArray=['Cases','Recovered','Deaths'];
	const color = ['rgb(255, 54, 54)','green','rgb(143, 218, 255)']
	for(let i=0;i<3;i++){
		btns[i].onclick=function() {
		/* body... */
			newLineChart.destroy();
			render_chart(typeArray[i],color[i]);
		}
	}
}