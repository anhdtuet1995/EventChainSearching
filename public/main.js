var oauthEventbriteKey = "WY5CK4MUPSE4DQSPEDWQ";
var numberEventInOnePage = 10;
var cachingRes = [];
var currPage = 0;
var currEventBritePage = -1;
var eventBritePageCount = 0;
var currTitle = "";
var currLocation = "";
var currDateFrom = "";
var currDateTo = "";

function initSearch(keyWord, fromDate, toDate, location, loadingSuccess, loadingFail) {
	currPage = 0;
	var eventsInOnePage = [];
	cachingRes = [];
	//store current searching filter
	currTitle = keyWord;
	currLocation = location;
	currDateFrom = fromDate;
	currDateTo = toDate;

	//always search on eventchain first
	searchOnEventChain(keyWord, fromDate, toDate, location, 
		function(evcSuccessResult){
			console.log('Get eventchain done!!!!!!!!');
			
			cachingRes.push(...evcSuccessResult);
			//if first page is not enough page size
			if (cachingRes.length < numberEventInOnePage) {
				searchOnEventBrite(keyWord, fromDate, toDate, location, 
					function(ebSuccessResult){
						cachingRes.push(...ebSuccessResult);
						for (i = 0; i < numberEventInOnePage; i++) {
							if (cachingRes[i]) {
								eventsInOnePage.push(cachingRes[i]);
							}
						}
						console.log(currPage);
						loadingSuccess(eventsInOnePage);
					},
					function(ebError) {
						loadingFail(ebError);
					}
				);
			} else {
				for (i = 0; i < numberEventInOnePage; i++) {
					if (cachingRes[i]) {
						eventsInOnePage.push(cachingRes[i]);			
					}
				}
				loadingSuccess(eventsInOnePage);
				console.log(currPage);
			}
		}, function(evcError){
			loadingFail(evcError);
		}
	);
}

function prevPage(loadingSuccess, loadingFail) {
	var eventsInOnePage = [];
	if (currPage > 0) {
		currPage--;
	}
	//if number of event is enough to fill one page
	var currPos = currPage * numberEventInOnePage;
	for (i = currPos; i < currPos + 10; i++) {
		if (cachingRes[i]) {
			eventsInOnePage.push(cachingRes[i]);
		}
	}
	loadingSuccess(eventsInOnePage);
	console.log(currPage);
}

function nextPage(loadingSuccess, loadingFail) {
	var eventsInOnePage = [];
	if (cachingRes.length - (currPage + 1) * numberEventInOnePage >= numberEventInOnePage) {
		//if number of event is enough to fill one page
		console.log("nextPage 1");
		currPage++;
		var currPos = currPage * numberEventInOnePage;
		for (i = currPos; i < currPos + numberEventInOnePage; i++) {
			eventsInOnePage.push(cachingRes[i]);
		}
		loadingSuccess(eventsInOnePage);
		console.log(currPage);
	} else {
		//need get more events
		if (currEventBritePage < eventBritePageCount) {
			//if still get more events
			console.log("nextPage 2");
			searchOnEventBrite(currTitle, currDateFrom, currDateTo, currLocation, 
				function(ebSuccessResult){
					currPage++;
					cachingRes.push(...ebSuccessResult);
					var currPos = currPage * numberEventInOnePage;
					for (i = currPos; i < currPos + numberEventInOnePage; i++) {
						if (cachingRes[i]) {
							eventsInOnePage.push(cachingRes[i]);
						}
					}
					console.log(currPage);
					loadingSuccess(eventsInOnePage);
				},
				function(ebError) {
					loadingFail(ebError);
				},
				currEventBritePage + 1
			);
		} else {
			//all events were got
			console.log("nextPage 3");
			if (cachingRes.length - (currPage + 1) * numberEventInOnePage <= 0) {
				loadingFail(null);
			} else {
				currPage++;
				var currPos = currPage * numberEventInOnePage;
				for (i = currPos; i < currPos + numberEventInOnePage; i++) {
					if (cachingRes[i]) {
						eventsInOnePage.push(cachingRes[i]);
					}
				}
				loadingSuccess(eventsInOnePage);
			}
		} 
	}
}

function searchOnEventChain(keyWord, fromDate, toDate, location, eventchainSuccess, eventchainFailed) {
	var dateFiltering = "";
	if (fromDate) {
		dateFiltering += " DateFrom: \\\"" + fromDate + "\\\"\\n ";
	}
	else {
		dateFiltering += "";
	}

	if (toDate) {
		dateFiltering += " DateTo: \\\"" + toDate + "\\\"\\n ";
	}
	else {
		dateFiltering += "";
	}

	var settings = {
		url: 'https://api.eventchain.io/open',
		method: "POST",
		headers: {
			'Content-Type': 'application/json',
		},
		data: "{\"query\":\"query{\\n        getEvents(\\n                    SearchParams:{\\n                        KeyWord: \\\"" + keyWord + "\\\"\\n     " + dateFiltering + "                 }\\n                )\\n                {\\n                    ID\\n                    CreateDate\\n                    CreateUserID\\n                    Status\\n                    TaxCalculationType\\n                    InWishList\\n                    BlockchainSecured\\n                    EventInfo {\\n                        Title\\n                        Host\\n                        StartDate\\n\\n                        EndDate: \\n\\n                        Description\\n                        EventImageURL\\n                        TimeZone {\\n                            TZoneID\\n                            FullName\\n                            Name\\n                        }\\n                    }\\n                    EventLocation {\\n                        VenueID\\n                        VenueName\\n                        DisplayMapOnEvent\\n                        Address {\\n                            Address1\\n                            Address2\\n                            City\\n                            CountryID\\n                            CountryName\\n                            ProvinceID\\n                            ProvinceName\\n                            PostalCode\\n                            MapCoords {\\n                                Lat\\n                                Long\\n                                Zoom\\n                            }\\n                        }\\n                    }\\n                    TicketTypes {\\n                        TicketTypeID\\n                        TypeName\\n                        EventID\\n                        Category\\n                        SeatingType\\n                        Price\\n                        Quantity\\n                        Description\\n                        Available\\n                        Currency\\n                        CurrencySign\\n                    }\\n                    ApplicableTaxes {\\n                        EventTaxID\\n                        TaxName\\n                        TaxPercent\\n                    }\\n                }\\n            }\"}",
	};
	console.log("Start searching on EventChain");
	console.log(settings);

	$.ajax(settings).done(function (response) {
		console.log(response);

		var events = response.data.getEvents;
		var result = [];
		for (var i = 0; i < events.length; i++) {
			var name = events[i].EventInfo.Title;

			var organizer = events[i].EventInfo.Host;
			var dateFrom = events[i].EventInfo.StartDate;
			var dateTo = events[i].EventInfo.EndDate;
			var imageUrl = events[i].EventInfo.EventImageURL;

			var addressObj = events[i].EventLocation.Address;

			var fullAddress = [addressObj.Address1, addressObj.Address2, addressObj.City, addressObj.ProvinceName, addressObj.CountryName].filter(Boolean).join(", ").toLowerCase();

			console.log(fullAddress);

			var locationName = [addressObj.City, addressObj.ProvinceName, addressObj.CountryName].filter(Boolean).join(", ");

			var url = "https://eventchain.io/event-details/" + events[i].ID;

			if (fullAddress.includes(location.toLowerCase())) {
				let event = new EventInfo(name, locationName, organizer, dateFrom, dateTo, imageUrl, url);
				result.push(event);
			}
		}
		eventchainSuccess(result);
		console.log("Done");
	}).fail(function(error) {
		console.log(error);
		eventchainFailed(error);
	});

}

function searchOnEventBrite(keyWord, fromDate, toDate, location, eventbriteSuccess, eventbriteFailed, page = 0) {
	var url = "https://www.eventbriteapi.com/v3/events/search/?token=WY5CK4MUPSE4DQSPEDWQ&expand=organizer,venue";

	if (keyWord) {
		keyWord = keyWord.split(' ').join('+');
		url += "&q=" + keyWord;
	}

	if (location) {
		location = location.split(' ').join('+');
		url += "&location.address=" + location; 
	}

	if (fromDate) {
		url += "&start_date.range_start=" + encodeURI(new Date(fromDate).toISOString().substr(0, 19) + "Z");
	}

	if (toDate) {
		url += "&start_date.range_end=" + encodeURI(new Date(toDate).toISOString().substr(0, 19)  + "Z");
	}

	if (page && page > 0) {
		url += "&page=" + page;
	}

	var settings = {
		"async": true,
		"url": url,
		"crossDomain": true,
		"method": "GET",
		"headers": {
			"Authorization": "Bearer WY5CK4MUPSE4DQSPEDWQ",
		}
	}

	$.ajax(settings)
		.done(function (response) {
			console.log(response);
			var result = [];
			//store page number and page count
			currEventBritePage = response.pagination.page_number;
			eventBritePageCount = response.pagination.page_count;
		
			var events = response.events;
			for (let i = 0; i < events.length; i++) {
				var name = events[i].name.text;
				var dateFrom = events[i].start.utc;
				var dateTo = events[i].end.utc;
				var imageUrl;
				if (events[i].logo) {
					imageUrl = events[i].logo.url;
				} else {
					imageUrl = "public/no-img.png";
				}
				var url = events[i].url;
				var organizer;
				if (events[i].organizer) {
					organizer = events[i].organizer.name;
				} else {
					organizer = "undefined";
				}
				var locationName;
				if (events[i].venue) {
					locationName = events[i].venue.name;
				} else {
					locationName = "undefined";
				}
				let event = new EventInfo(name, locationName, organizer, dateFrom, dateTo, imageUrl, url);
				result.push(event);
			}
			eventbriteSuccess(result);
		})
		.fail(function(err) {
			eventbriteFailed(err);
		});

}