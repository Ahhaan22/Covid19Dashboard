let myPieChart=document.getElementById("myPieChart").getContext('2d');
let myLineChart=document.getElementById("myLineChart").getContext('2d');
let newLineChart;
//let myLineChart2=document.getElementById("myLineChart2").getContext('2d');
function create_chart(chartData1) {
	// body... 
	const newChart = new Chart(myPieChart,{
		type: 'doughnut',
		data:{
			labels:['Asia','Europe','Africa','Australia-Oceania','South America','North America'],
			datasets:[{
				label:'Quantity',
				data:chartData1,
				backgroundColor:["#4287f5","#ff2929","Green","#7aff5c","#ff54cc","Yellow"],
				borderWidth:0
			}]
		},
		options:{
			responsive: true,
			plugins: {
            	legend: {
                	display: true,
                	labels:{
                		font:{
                			size:16,
                		}
                	},
                	position:'bottom',
            	}
        	},
		}
	});
}
//updateData(newChart,[200,100]);
function updateData(newData){
	console.log(newChart.data.datasets);
	newChart.data.datasets.forEach(function(dataset,index) {
		// statements
		dataset.data.push(newData[index]);
	});
	newChart.update();
}
function create_line_graph (dates,newData,labels,color) {
	newLineChart=new Chart(myLineChart,{
		type:'line',
		data:{
			labels: dates,
  			datasets: [{
  				label:labels[0],
    			data: newData[0],
    			fill: true,
    			backgroundColor: color,
    			tension: 0.1
  			}],
		},
		options:{
			maintainAspectRatio: false,
			ticks: {
          // forces step size to be 50 units
         	 	stepSize: 10000000
       	 	}
		}
	})
};