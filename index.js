console.log(firebase);
var database = firebase.database();

function getAll(){
	return new Promise(function(resolve, reject){
		var getVal = database.ref('/test1').orderByKey()
		getVal.on('value', function(snapshot){
			console.log(snapshot.val());
			resolve(snapshot.val());
		})

		//firebase.database().ref('/test1').once('value').then(function(snapshot) {
		//	console.log(snapshot.val());
		//})
	})
}

function getCars(){
	return new Promise(function(resolve, reject){
		var cars = database.ref('/Cars');
		cars.on('value', function(snapshot){
			console.log(snapshot.val());
			resolve(snapshot.val())
		})
	});
}

function write(obj){
	console.log('Write', obj);


}

function getByMake(data){
	let make = document.getElementById('searchMakeTextbox').value;
	Car.getAllByMake(make).then(cars => {
		let divs = cars.map(car => { return `<div>
			<h4>${car.make}</h4>
			<ul>
				<li><label>Model: </label>${car.model}</li>
				<li><label>Make: </label>${car.color}</li>
				<li><label>Year: </label>${car.year}</li>
				<li><label>Wheel Count: </label>${car.wheelCount}</li>
				<li><label>Has Power Windows: </label>${car.hasPowerWindows}</li>
			</ul>
		</div>` });
		document.getElementById('carByMake').innerHTML = divs;
	})
}

function getByModel(data){
	let make = document.getElementById('searchModelMakeTextbox').value;
	let model = document.getElementById('searchModelModelTextbox').value;
	Car.getAllByModel(make, model).then(car => {
		let div = car ? `<div>
			<h4>${car.make}</h4>
			<ul>
				<li><label>Make: </label>${car.color}</li>
				<li><label>Year: </label>${car.year}</li>
				<li><label>Wheel Count: </label>${car.wheelCount}</li>
				<li><label>Has Power Windows: </label>${car.hasPowerWindows}</li>
			</ul>
		</div>` : '';
		document.getElementById('carByModel').innerHTML = div;
	})
}



class Car{

	constructor(make, model, color, wheelCount, hasPowerWindows){
		this.make = make;
		this.model = model;
		this.color = color;
		this.wheelCount = wheelCount;
		this.hasPowerWindows = hasPowerWindows;
	}

	static parseMakes(data){
		let objects = [];
		for(let make in data){
			let models  = data[make];

			for(let model in models){
				let details = models[model];
				objects.push(new Car(
					make,
					model,
					details.color,
					details.wheels,
					details.powerWindows
				))
			}
		}
		return objects;
	}

	static getAll(){
		return new Promise(function(resolve, reject){
			let cars = database.ref('/Cars');
			cars.on('value', function(snapshot){
				let results = snapshot.val() || [];
				let objects = [];

				for(let make in results){
					let models  = results[make];

					for(let model in models){
						let details = models[model];
						objects.push(new Car(
							make,
							model,
							details.color,
							details.wheels,
							details.powerWindows
						))
					}
				}

				return resolve(objects);
			})
		})
	}

	static getAllByMake(make){
		return new Promise(function(resolve, reject){
			let cars = database.ref('/Cars').orderByKey().equalTo(make).limitToFirst(1);
			cars.on('value', function(snapshot){
				let results = snapshot.val() || {};
				let arr = Car.parseMakes(results);
				resolve(arr);
			})
		})
	}

	static getAllByModel(make, model){
		return new Promise(function(resolve, reject){
			let cars = database.ref('/Cars/' + make).orderByKey().equalTo(model).limitToFirst(1);
			cars.on('value', function(snapshot){
				let results = snapshot.val() || {};
				resolve(results[model]);
			})
		})
	}

	static getAllByColor(color){
		return new Promise(function(resolve, reject){
			let cars = database.ref('/Cars')
		})
	}
}

Car.getAll().then(data => {
	let divs = [];

	divs = data.map(car => {
		return `
		<div>
			<h4>${car.make}</h4>
			<ul>
				<li><label>Model: </label>${car.model}</li>
				<li><label>Make: </label>${car.color}</li>
				<li><label>Year: </label>${car.year}</li>
				<li><label>Wheel Count: </label>${car.wheelCount}</li>
				<li><label>Has Power Windows: </label>${car.hasPowerWindows}</li>
			</ul>
		</div>
		`
	})
	document.getElementById('cars').innerHTML = divs.toString();
})