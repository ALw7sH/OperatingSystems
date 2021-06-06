const bankersPage 				= document.querySelector("#deadlock");
const bankers = {
	tablesContainer: bankersPage.querySelector("#bankers-tables"),
	resNum: bankersPage.querySelector("#resNum"),
	procNum: bankersPage.querySelector("#procNum"),
	magicButton: bankersPage.querySelector("#bankers-magic"),
	available: bankersPage.querySelector("#bankersAvailable"),
	safeseq: bankersPage.querySelector("#bankersSafeSeq"),
	needTableContainer: bankersPage.querySelector("#bankersNeedTableContainer"),
	requestSelect: bankersPage.querySelector("#bankers-request-select"),
	requestTableContainer: bankersPage.querySelector("#bankers-request-table-container"),
	requestResult: bankersPage.querySelector("#banker-request-result")
};

const resNames = ['A', 'B', 'C', 'D', 'F'];

var allocation 	= [];
var max			= [];
var available 	= [];
var original_available = [];
var need		= [];
/*allocation = [ 	[ 4, 0, 0, 1 ], // P0 // This is Allocation Matrix 
					[ 1, 1, 0, 0 ], // P1 
					[ 0, 5, 3, 3 ], // P2 
					[ 1, 2, 5, 4 ], // P3 
					[ 0, 2, 1, 2 ] ]; // P4 

max = [ 			[ 6, 0, 1, 2 ], // P0 // MAX Matrix 
					[ 2, 7, 5, 0 ], // P1 
					[ 1, 6, 5, 3 ], // P2 
					[ 2, 3, 5, 6 ], // P3 
					[ 1, 6, 5, 6 ] ]; // P4
available = [3, 2, 1, 1];*/
/*allocation = [ 	[ 1, 3, 1, 2 ], // P0 // This is Allocation Matrix 
					[ 3, 1, 2, 1 ], // P1 
					[ 2, 0, 0, 1 ], // P2 
					[ 2, 1, 0, 3 ], // P3 
					[ 1, 4, 3, 2 ] ]; // P4 

max = [ 			[ 1, 4, 2, 4 ], // P0 // MAX Matrix 
					[ 5, 2, 5, 2 ], // P1 
					[ 4, 2, 1, 2 ], // P2 
					[ 2, 3, 1, 6 ], // P3 
					[ 3, 6, 6, 5 ] ]; // P4
available = [3, 3, 2, 1];*/

function increaseBankersResources(){
	let resNum = parseInt(bankers.resNum.value);
	let procNum = parseInt(bankers.procNum.value);
	
	if (resNum < 5){
		let procTable = bankers.tablesContainer.children[0];
		procTable.children[0].children[0].children[1].colSpan = resNum+1;
		procTable.children[0].children[0].children[2].colSpan = resNum+1;
		
		let resources = procTable.children[0].children[1];
		resources.innerHTML = '';
		for (let r=0; r<resNum+1; r++){
			resources.innerHTML += `<th scope="col" class="text-center">${resNames[r]}</th>`;
		}
		for (let r=0; r<resNum+1; r++){
			resources.innerHTML += `<th scope="col" class="text-center">${resNames[r]}</th>`;
		}
		
		for (let p=0; p<procNum; p++){
			let newInput = document.createElement('td');
			newInput.innerHTML = '<input type="text" />';
			procTable.children[1].children[p].appendChild(newInput);
			
			let newInput2 = document.createElement('td');
			newInput2.innerHTML = '<input type="text" />';
			procTable.children[1].children[p].appendChild(newInput2);
		}
		
		
		let avalTable = bankers.tablesContainer.children[1];
		avalTable.children[0].children[0].children[0].colSpan = resNum+1;
		
		resources = avalTable.children[0].children[1];
		resources.innerHTML = '';
		for (let r=0; r<resNum+1; r++){
			resources.innerHTML += `<th scope="col" class="text-center">${resNames[r]}</th>`;
		}
		
		let newInput = document.createElement('td');
		newInput.innerHTML = '<input type="text" />';
		avalTable.children[1].children[0].appendChild(newInput);
		
		bankers.resNum.value = resNum+1;
	}
}

function decreaseBankersResources(){
	let resNum = parseInt(bankers.resNum.value);
	let procNum = parseInt(bankers.procNum.value);
	
	if (resNum > 2){
		let procTable = bankers.tablesContainer.children[0];
		procTable.children[0].children[0].children[1].colSpan = resNum-1;
		procTable.children[0].children[0].children[2].colSpan = resNum-1;
		
		let resources = procTable.children[0].children[1];
		resources.children[resNum-2].remove();
		resources.children[resources.children.length-1].remove();
		
		for (let p=0; p<procNum; p++){
			procTable.children[1].children[p].children[resNum-2].remove();
			procTable.children[1].children[p].children[procTable.children[1].children[p].children.length-1].remove();
		}
		
		
		let avalTable = bankers.tablesContainer.children[1];
		avalTable.children[0].children[0].children[0].colSpan = resNum-1;
		
		resources = avalTable.children[0].children[1];
		resources.children[resources.children.length-1].remove();
		
		avalTable.children[1].children[0].children[avalTable.children[1].children[0].children.length-1].remove();
		
		bankers.resNum.value = resNum-1;
	}
}

function increaseBankersProcessors(){
	let resNum = parseInt(bankers.resNum.value);
	let procNum = parseInt(bankers.procNum.value);
	
	if (procNum < 10){
		let newRow = document.createElement('tr');
		let newInput = document.createElement('td');
		newInput.className = "ps-2";
		newInput.innerHTML = '<strong>P'+ (procNum) +'</strong>';
		newRow.appendChild(newInput);
		for (let r=0; r<resNum; r++){
			let newInput = document.createElement('td');
			newInput.innerHTML = '<input type="text" />';
			newRow.appendChild(newInput);
			
			let newInput2 = document.createElement('td');
			newInput2.innerHTML = '<input type="text" />';
			newRow.appendChild(newInput2);
		}
		
		let procTable = bankers.tablesContainer.children[0];
		procTable.children[1].appendChild(newRow);
		
		bankers.procNum.value = procNum+1;
	}
}

function decreaseBankersProcessors(){
	let resNum = parseInt(bankers.resNum.value);
	let procNum = parseInt(bankers.procNum.value);
	
	if (procNum > 1){
		let procTable = bankers.tablesContainer.children[0];
		procTable.children[1].children[procTable.children[1].children.length-1].remove();
		
		bankers.procNum.value = procNum-1;
	}
}

function readBankersData(){
	let resNum = parseInt(bankers.resNum.value);
	let procNum = parseInt(bankers.procNum.value);
	allocation 	= [];
	max			= [];
	available 	= [];
	need		= [];
	
	let procTable = bankers.tablesContainer.children[0];
	for (let p=0; p<procNum; p++){
		let row = procTable.children[1].children[p];
		for (let r=1; r<resNum+1; r++){
			let alloc = parseInt(row.children[r].children[0].value);
			if (!allocation[p]){
				allocation[p] = [];
			}
			allocation[p][r-1] = alloc;
		}
		for (let r=resNum+1; r<(resNum*2)+1; r++){
			let mx = parseInt(row.children[r].children[0].value);
			if (!max[p]){
				max[p] = [];
			}
			max[p][(r-1)-resNum] = mx;
		}
	}
	
	let avalTable = bankers.tablesContainer.children[1];
	for (let r=0; r<resNum; r++){
		let aval = parseInt(avalTable.children[1].children[0].children[r].children[0].value);
		available[r] = aval;
	}
}

function doBankersMagic(){
	readBankersData();
	let resNum = parseInt(bankers.resNum.value);
	let procNum = parseInt(bankers.procNum.value);
	
	for(let r=0; r<=resNum; r++){
		original_available[r] = available[r];
	}
	
	let safe = [];
	let ind = 0;
	
	let f = [];
	for(let p=0; p<procNum; p++){
		f[p] = 0;
	}
	
	// calculate need
	for(let p=0; p<procNum; p++){
		for(let r=0; r<resNum; r++){
			if (!need[p]){
				need[p] = [];
			}
			need[p][r] = max[p][r]-allocation[p][r];
		}
	}
	for(let k=0; k<5; k++){
		for(let p=0; p<procNum; p++){
			if (f[p] == 0){
				let flag = false;
				for(let r=0; r<resNum; r++){
					if (need[p][r] > available[r]){
						flag = true;
						break;
					}
				}
				
				if (flag == false){
					safe[ind++] = "P"+(p);
					for (let r=0; r<resNum; r++){
						available[r] += allocation[p][r];
					}
					f[p] = 1;
				}
			}
		}
	}
	
	bankers.available.innerHTML = "Available: "+ available.join(", ");
	bankers.safeseq.innerHTML = "Safe Sequence: "+ safe.join(", ");
	
	let needTable = `<table class="table table-bordered table-dark bankers-need-table">
						<thead>
							<tr>
								<th scope="col" rowspan="2" class="text-center" ></th>
								<th scope="col" colspan="${resNum}" class="text-center" >Need</th>
							</tr>
							<tr>`
	for (let r=0; r<resNum; r++){
		needTable += 			`<th scope="col" class="text-center">${resNames[r]}</th>`;
	}
	needTable +=			`</tr>
						</thead>
						<tbody>`;
	for(let p=0; p<procNum; p++){
		needTable += 		`<tr>
								<td class="ps-2"><strong>P${p}</strong></td>`;
		for (let r=1; r<=resNum; r++){
			needTable += 		`<td>${need[p][r-1]}</td>`;
		}
		needTable += 		`</tr>`;
	}
	needTable +=		`</tbody>
					</table>`;
	
	bankers.needTableContainer.innerHTML = needTable;
	
	let requestTable = `<table class="table table-bordered table-dark bankers-aval-table mt-3">
							<thead>
								<tr>
									<th scope="col" colspan="${resNum}" class="text-center" >Request</th>
								</tr>
								<tr>`
	for (let r=0; r<resNum; r++){
		requestTable += 			`<th scope="col" class="text-center">${resNames[r]}</th>`;
	}
	requestTable +=				`</tr>
							</thead>
							<tbody>
								<tr>`;
	for (let r=1; r<=resNum; r++){
		requestTable += 			`<td><input type="text" /></td>`;
	}
	requestTable +=				`</tr>
							</tbody>
						</table>`;
	bankers.requestTableContainer.innerHTML = requestTable;
	
	bankers.requestSelect.innerHTML = '';
	for (let p=0; p<procNum; p++){
		bankers.requestSelect.innerHTML += '<option value="'+ p +'">P'+ (p) +'</option>';
	}
	
	bankersPage.querySelector('#bankers-request').style.display = 'block';
}

function doBankersMagic2(){
	let resNum = parseInt(bankers.resNum.value);
	let procNum = parseInt(bankers.procNum.value);
	
	let request = [];
	
	let safe = [];
	
	let ind = 0;
	
	let f = [];
	for(let p=0; p<procNum; p++){
		f[p] = 0;
	}
	
	let requestTable = bankers.requestTableContainer.children[0];
	for(let r=0; r<resNum; r++){
		request[r] = parseInt(requestTable.children[1].children[0].children[r].children[0].value);
	}
	
	let proc = parseInt(bankers.requestSelect.value);
	
	let request_available = [];
	for(let r=0; r<resNum; r++){
		request_available[r] = original_available[r]-request[r];
	}
	
	let request_allocation = JSON.parse(JSON.stringify(allocation));
	for(let r=0; r<resNum; r++){
		request_allocation[proc][r] += request[r];
	}
	
	let request_need = JSON.parse(JSON.stringify(need));
	for(let r=0; r<resNum; r++){
		request_need[proc][r] -= request[r];
	}
	
	console.log(request_allocation[proc]);
	console.log(request_need[proc]);
	
	let flag = false;
	for(let r=0; r<resNum; r++){
		console.log(request[r], need[proc][r]);
		if (request[r] > need[proc][r]){
			flag = true;
			break;
		}
	}
	console.log(flag);
	if (flag === false){
		flag = false;
		for(let r=0; r<resNum; r++){
			console.log(request[r], request_available[r]);
			if (request[r] > request_available[r]){
				flag = true;
				break;
			}
		}
		console.log('++', flag);
		if (flag === false){
			for(let k=0; k<5; k++){
				for(let p=0; p<procNum; p++){
					if (f[p] == 0){
						let flag = false;
						for(let r=0; r<resNum; r++){
							if (request_need[p][r] > request_available[r]){
								flag = true;
								break;
							}
						}
						
						if (flag == false){
							safe[ind++] = "P"+(p);
							for (let r=0; r<resNum; r++){
								request_available[r] += request_allocation[p][r];
							}
							f[p] = 1;
						}
					}
				}
			}
			
			bankers.requestResult.innerHTML = safe.join(', ');
		} else {
			// P? must wait since resources are not available
			bankers.requestResult.innerHTML = 'Unsafe. P'+ (proc) +' must wait since resources are not available';
		}
	} else {
		// Process has exceeded its maximum claim
		bankers.requestResult.innerHTML = 'Unsafe. Process has exceeded its maximum claim';
	}
}