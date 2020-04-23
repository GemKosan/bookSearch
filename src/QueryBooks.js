import React from 'react';


function BookListing(props) {
	return (
		<div className="col-lg-4">
			<a href={props.canonicalVolumeLink}>
				<div className="card border-light">
					<div className="row no-gutters">
						<div className="col-auto">
							<img
								width="120"
								height="178"
								src={props.thumbnail}
								className="img-fluid"
								alt=""
							/>
						</div>
						<div className="col">
							<div className="card-block px-2">
								<h3 className="card-title">{props.title}</h3>
								<h4 className="card-subtitle mb-2 text-muted">by {props.author}</h4>
								<p className="card-text">{props.description}</p>
							</div>
						</div>
					</div>
				</div>
			</a>
		</div>
	);
}

class QueryBooks extends React.Component {
  constructor(props) {
		super(props);
		
    this.state = {
			results: []
		}
	}
	
	componentDidMount() {
		let searchForm = document.getElementById("search-form");
		let searchInput = document.getElementById('search-input');
		if(searchForm && searchInput){
			searchForm.addEventListener("submit", function(event) {
				event.preventDefault();
				this.runQuery(searchInput.value);
    	}.bind(this), false);
		}
	}
	
	runQuery(query) {
		let apiRequest = `https://www.googleapis.com/books/v1/volumes?maxResults=12&q=${query}`;

		fetch(apiRequest)
			.then(response => response.json())
			.then(JSONResponse => {
				if (JSONResponse.error) {
					let errorList = JSONResponse.error.errors;
					let errorString = "Google Books volume search returned ERRORS:";
					for(let i=0; i< errorList.length; i++)
						errorString += `\n\t${JSON.stringify(errorList[0].message)}, ${JSON.stringify(errorList[0].reason)}`;
					throw(new Error(errorString));
				}
				return JSONResponse;
			})
			.then(JSONResponse => {
				try {
					this.parseJSONResponse(JSONResponse);
				}
				catch(error) {
					throw(error);
				}

				return JSONResponse;
			})
			.catch(error => {
				if (error.message === 'Failed to fetch')
					alert(`Error fetching URL from ${apiRequest}`);
				else
					alert(error);
			});
	}

	parseJSONResponse(json) {
		let results = [];

		try {
			json.items.forEach(item => {		
				results.push(<BookListing
					key={item.id}
					id={item.id}
					title={(item.volumeInfo && item.volumeInfo.title) ? item.volumeInfo.title : "Title Unavailale"}
					author={(item.volumeInfo && item.volumeInfo.authors) ? item.volumeInfo.authors.join(', ') : "Authors Unavailale"}
					thumbnail={(item.volumeInfo && item.volumeInfo.imageLinks && item.volumeInfo.imageLinks.thumbnail) ? item.volumeInfo.imageLinks.thumbnail : "https://via.placeholder.com/120x178.png?text=No+image+available"}
					description={(item.volumeInfo && item.volumeInfo.description) ? item.volumeInfo.description : "Description Unavailale"}
					canonicalVolumeLink={(item.volumeInfo && item.volumeInfo.canonicalVolumeLink) ? item.volumeInfo.canonicalVolumeLink : ""}					
				/>);
			});
			
			this.setState({results: results});
		}
		catch(error) {
			throw error;
		}
	} 

  render() {
    return this.state.results;
  }
}


export default QueryBooks;
