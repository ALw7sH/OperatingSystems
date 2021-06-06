const cpuPage 				= document.querySelector("#cpu");
const proccessTable 		= cpuPage.querySelector(".cpu-table");
const quantumInput 			= cpuPage.querySelector("#rr-quantum");
const magicButton 			= cpuPage.querySelector("#cpu-magic");
const displayGanttChart  	= cpuPage.querySelector("#ganttChart");

var algorithm 		= "fcfs";
var processes 		= [];
var runningTime 	= 0;
var currentProcess 	= -1;
var quantum 		= 0;
var rbStep			= 0;

function readProcesses(){
	processes = [];
	
	let tbody = proccessTable.children[1];
	for (let p=0; p<tbody.children.length; p++){
		let arrivalTime = parseInt(tbody.children[p].children[1].children[0].value);
		let burstTime = parseInt(tbody.children[p].children[2].children[0].value);
		processes[p] = {
			pid: p+1,
			arrival_time: arrivalTime,
			burst_time: burstTime,
			remaining_time: burstTime,
			waiting_time: 0,
			response_time: -1,
			turnaround_time: 0
		};
		if (algorithm == "pp" || algorithm == "pnp"){
			processes[p].priority = parseInt(tbody.children[p].children[3].children[0].value);
		}
	}
}

function findProcess(){
	let processesNum = processes.length;
	
	if (algorithm == "fcfs"){
		if (currentProcess != -1 && processes[currentProcess].remaining_time > 0){
			return currentProcess;
		} else {
			for (let p=0; p<processesNum; p++){
				let process = processes[p];
				if (process.remaining_time > 0){
					if (process.arrival_time <= runningTime){
						return p;
					}
				}
			}
		}
	} else if (algorithm == "sjf") {
		if (currentProcess != -1 && processes[currentProcess].remaining_time > 0){
			return currentProcess;
		} else {
			for (let p=0; p<processesNum; p++){
				let process = processes[p];
				if (process.remaining_time > 0){
					if (process.arrival_time <= runningTime){
						return p;
					}
				}
			}
		}
	} else if (algorithm == "srjf") {
		let shortest = -1;
		for (let p=0; p<processesNum; p++){
			let process = processes[p];
			if (process.remaining_time > 0){
				if (process.arrival_time <= runningTime){
					if (shortest == -1){
						shortest = p;
					} else {
						if (process.remaining_time < processes[shortest].remaining_time){
							shortest = p;
						}
					}
				}
			}
		}
		
		if (currentProcess != -1 && processes[currentProcess].remaining_time > 0 && currentProcess != shortest){
			if (processes[currentProcess].remaining_time == processes[shortest].remaining_time){
				shortest = currentProcess;
			}
		}
		
		return shortest;
	} else if (algorithm == "rb") {
		if (currentProcess == -1){
			for (let p=rbStep; p<processesNum; p++){
				let process = processes[p];
				if (process.remaining_time > 0){
					if (process.arrival_time <= runningTime){
						return p;
					}
				}
			}
		} else {
			if (runningTime%quantum == 0){
				rbStep++;
				if (rbStep == processesNum){
					rbStep = 0;
				}
				for (let p=rbStep; p<processesNum; p++){
					let process = processes[p];
					if (process.remaining_time > 0){
						if (process.arrival_time <= runningTime){
							return p;
						}
					}
				}
			} else {
				return currentProcess;
			}
		}
	} else if (algorithm == "pp") {
		let proc = -1
		for (let p=0; p<processesNum; p++){
			let process = processes[p];
			if (process.remaining_time > 0){
				if (process.arrival_time <= runningTime){
					if (proc == -1){
						proc = p;
					} else {
						if (process.priority < processes[proc].priority){
							proc = p;
						}
					}
				}
			}
		}
		return proc;
	} else if (algorithm == "pnp") {
		if (currentProcess != -1 && processes[currentProcess].remaining_time > 0){
			return currentProcess;
		} else {
			for (let p=0; p<processesNum; p++){
				let process = processes[p];
				if (process.remaining_time > 0){
					if (process.arrival_time <= runningTime){
						return p;
					}
				}
			}
		}
	}
	return -1;
}

function getProcessFromPID(pid){
	for (let p=0; p<processes.length; p++){
		if (processes[p].pid == pid){
			return p;
		}
	}
}

function doMagic(){
	magicButton.disabled = true;
	
	readProcesses();
	if (algorithm == "fcfs") {
		processes.sort((a, b) => b.arrival_time < a.arrival_time);
	} else if (algorithm == "sjf") {
		processes.sort((a, b) => b.burst_time < a.burst_time);
	} else if (algorithm == "rb") {
		processes.sort((a, b) => b.arrival_time < a.arrival_time);
		quantum = parseInt(quantumInput.querySelector('input').value);
		rbStep = 0;
	} else if (algorithm == "pnp") {
		processes.sort((a, b) => b.priority < a.priority);
	}
	
	let ganttChart = "";
	
	runningTime = 0;
	let finishedProcesses = 0;
	currentProcess = -1;
	let processesNum = processes.length;
	let safety = 0;
	while (finishedProcesses < processesNum) {
		let getProcess = findProcess();
		console.log(runningTime, getProcess, rbStep);
		if (getProcess != -1){
			if (currentProcess != -1){
				if (getProcess != currentProcess){
					if (processes[currentProcess].remaining_time > 0){
						ganttChart += "-P"+(processes[currentProcess].pid)+"-"+runningTime;
					}
				}
			} else {
				ganttChart += runningTime;
			}
			
			currentProcess = getProcess;
			processes[currentProcess].remaining_time--;
			
			if (processes[currentProcess].response_time == -1){
				processes[currentProcess].response_time = runningTime-processes[currentProcess].arrival_time;
			}
			
			if (processes[currentProcess].remaining_time == 0){
				finishedProcesses++;
				ganttChart += "-P"+(processes[currentProcess].pid)+"-"+(runningTime+1);
				
				processes[currentProcess].waiting_time = (runningTime+1)-processes[currentProcess].arrival_time-processes[currentProcess].burst_time;
				processes[currentProcess].turnaround_time = (runningTime+1)-processes[currentProcess].arrival_time;
			}
		}
		runningTime++;
		safety++;
		if (safety >= 5000){
			console.log("Stopped by safety");
			break;
		}
	}
	
	processes.sort((a, b) => b.pid < a.pid);
	
	displayGanttChart.innerHTML = "Gantt Chart: "+ ganttChart;
	let resultArray = cpuPage.querySelector("#resultArray");
	
	let result = `<table class="table table-bordered table-dark">
					<thead>
						<tr>
							<th scope="col">Process</th>
							<th scope="col">Arrival Time</th>
							<th scope="col">Burst Time</th>
							<th scope="col">Waiting Time</th>
							<th scope="col">Response Time</th>
							<th scope="col">Turnaround Time</th>
						</tr>
					</thead>
					<tbody>`;
	for (let p=0; p<processes.length; p++){
		result +=		`<tr>
							<td class="ps-2"><strong>${processes[p].pid}</strong></td>
							<td>${processes[p].arrival_time}</td>
							<td>${processes[p].burst_time}</td>
							<td>${processes[p].waiting_time}</td>
							<td>${processes[p].response_time}</td>
							<td>${processes[p].turnaround_time}</td>
						</tr>`;
	}
	result +=		`</tbody>
				</table>`;
	resultArray.innerHTML = result;
	magicButton.disabled = false;
}

function increaseProcesses(){
	let tbody = proccessTable.children[1];
	if (tbody.children.length < 5){
		let newRow = document.createElement("tr");
		newRow.innerHTML = `<td class="ps-2"><strong>`+ (tbody.children.length+1) +`</strong></td>
							<td><input type="text" /></td>
							<td><input type="text" /></td>`;
		if (algorithm == "pp" || algorithm == "pnp"){
			newRow.innerHTML += `<td><input type="text" /></td>`;
		}
		tbody.appendChild(newRow);
		cpuPage.querySelector("#procNum").value = tbody.children.length;
	}
}

function decreaseProcesses(){
	let tbody = proccessTable.children[1];
	if (tbody.children.length > 1){
		tbody.children[tbody.children.length-1].remove();
		cpuPage.querySelector("#procNum").value = tbody.children.length;
	}
}

function onAlgorithmChange(newAlgo){
	if (newAlgo == "rb"){
		quantumInput.style.display = "block";
	} else {
		quantumInput.style.display = "none";
	}
	
	if (newAlgo == "pp" || newAlgo == "pnp"){
		if (algorithm != "pp" && algorithm != "pnp") {
			let col = document.createElement("th");
			col.setAttribute("scope", "col");
			col.innerHTML = "Priority";
			proccessTable.children[0].children[0].appendChild(col);
			
			let tbody = proccessTable.children[1];
			for (let p=0; p<tbody.children.length; p++){
				let priority = document.createElement("td");
				priority.innerHTML = '<input type="text" />';
				tbody.children[p].appendChild(priority);
			}
		}
	} else {
		if (proccessTable.children[0].children[0].children[3])
			proccessTable.children[0].children[0].children[3].remove();
		
		let tbody = proccessTable.children[1];
		for (let p=0; p<tbody.children.length; p++){
			if (tbody.children[p].children[3])
				tbody.children[p].children[3].remove();
		}
	}
	
	algorithm = newAlgo;
}