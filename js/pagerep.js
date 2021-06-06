const pagerepPage 			= document.querySelector("#pagerep");
const pagerep = {
	refString: pagerepPage.querySelector('#refString'),
	memFrames: pagerepPage.querySelector('#frames'),
	hits: pagerepPage.querySelector('#pagerepHits'),
	faults: pagerepPage.querySelector('#pagerepFaults'),
	hitsPerc: pagerepPage.querySelector('#pagerepHitsPerc'),
	faultsPerc: pagerepPage.querySelector('#pagerepFaultsPerc'),
	hitsRate: pagerepPage.querySelector('#pagerepHitsRate'),
	faultsRate: pagerepPage.querySelector('#pagerepFaultsRate'),
	tableContainer: pagerepPage.querySelector('#pagerepTableContainer'),
};

var algorithm = "fifo";

function doPagerepMagic(){
	let memFrames = parseInt(pagerep.memFrames.value);
	let refString = pagerep.refString.value.split(',');
	
	let resultArray 		= [];
	/*for(let i=0; i<refString.length; i++){
		resultArray[i] = [];
	}
	console.log(resultArray);*/
	
	let physicalMemory 		= [];
	let hits				= 0;
	let faults				= 0;
	
	for(let i=0; i<refString.length; i++){
		let str = refString[i];
		resultArray[i] = [];
		//console.log(physicalMemory.length, memFrames);
		if (physicalMemory.length == memFrames){
			for(let a=0; a<memFrames; a++){
				resultArray[i][a] = {str:resultArray[i-1][a].str, color:null}
			}
			
			let exists = false;
			for(let a=0; a<memFrames; a++){
				//console.log(physicalMemory[a],str);
				if (physicalMemory[a] == str){
					for (let k=0; k<memFrames; k++){
						if (resultArray[i][k].str == str)
							resultArray[i][k].color = "green";
					}
					exists = true;
					hits++;
				}
			}
			if (!exists){
				if (algorithm == "fifo"){
					for (let k=0; k<memFrames; k++){
						if (resultArray[i][k].str == physicalMemory[0]){
							resultArray[i][k].str = str;
							resultArray[i][k].color = "red";
							break;
						}
					}

					physicalMemory = physicalMemory.slice(1);
					physicalMemory.push(str);
				} else if (algorithm == "lru") {
					let toChange = -1;
					let distance;
					
					for(let k=0; k<memFrames; k++){
						for(let c=i-1; c>=0; c--){
							if (refString[c] == physicalMemory[k]){
								if (typeof(distance) !== "undefined"){
									if (c < distance){
										toChange = k;
										distance = c;
									}
								} else {
									toChange = k;
									distance = c;
								}
								break;
							}
						}
					}
					console.log(physicalMemory[toChange], str);
					
					physicalMemory[toChange] = str;
					resultArray[i][toChange].str = str;
					resultArray[i][toChange].color = "red";
				} else if (algorithm == "opt") {
					let toChange = -1;
					let distance;
					console.log('test');
					for(let k=0; k<memFrames; k++){ // for every number in the memory
						let found = false;
						for(let c=i+1; c<refString.length; c++){ // from last page to current page
							if (refString[c] == physicalMemory[k]){ // check if this page is equal to the memory number
								if (typeof(distance) !== "undefined"){
									if (c > distance){
										toChange = k;
										distance = c;
										console.log("distance", physicalMemory[k], distance);
									}
									found = true;
									break;
								} else {
									toChange = k;
									distance = c;
									found = true;
									console.log("++distance", physicalMemory[k], distance);
									break;
								}
							}
						}
						if (found == false){ // this number won't be used anymore. so use it to replace
							toChange = k;
							break;
						}
					}
					
					console.log(physicalMemory);
					
					physicalMemory[toChange] = str;
					resultArray[i][toChange].str = str;
					resultArray[i][toChange].color = "red";
				}
				
				//console.log('test');
				faults++;
			}
			console.log("#"+i, exists);
		} else {
			let found = false;
			for (let c=0; c<physicalMemory.length; c++){
				if (physicalMemory[c] == str){
					found = true;
				}
			}
			if (found){
				for (let c=0; c<physicalMemory.length; c++){
					if (physicalMemory[c] == str) {
						resultArray[i].push({str: physicalMemory[c], color: 'green'});
					} else {
						resultArray[i].push({str: physicalMemory[c], color: null});
					}
				}
				hits++;
			} else {
				physicalMemory.push(str);
				for (let c=0; c<physicalMemory.length; c++){
					resultArray[i].push({str: physicalMemory[c], color: null});
				}
				faults++;
			}
		}
	}
	
	console.log(resultArray);
	pagerep.hits.innerHTML = "Hits: "+hits;
	pagerep.faults.innerHTML = "Faults: "+faults;
	
	let resultTable = `<table class="table table-bordered table-dark">
							<thead>
								<tr>`;
	for(let i=0; i<refString.length; i++){
		resultTable += 				`<th scope="col" class="text-center" >${refString[i]}</th>`;
	}
	resultTable +=				`</tr>
							</thead>
							<tbody>`;
	for(let c=0; c<memFrames; c++){
		resultTable +=			`<tr>`;
		for(let i=0; i<refString.length; i++){
			let toAdd = resultArray[i][c]?.str || '';
			let style = resultArray[i][c]?.color && 'style="background-color:'+resultArray[i][c].color+'"' || '';
			resultTable +=			`<td class="text-center" ${style}>${toAdd}</td>`;
		}
		resultTable +=			`</tr>`;
	}
	resultTable +=			`</tbody>
						</table>`;
	
	pagerep.tableContainer.innerHTML = resultTable;
}

function onPagerepAlgorithmChange(newAlgo){
	algorithm = newAlgo;
}