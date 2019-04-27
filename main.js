var oauthEventbriteKey = "WY5CK4MUPSE4DQSPEDWQ";
var numberEventInOnePage = 10;
var cachingRes = [];
var currPage = -1;
var currEventBritePage = 0;
var eventBritePageCount = 0;
class EventInfo {
	constructor(name, location, organizer, dateFrom, dateTo, image, url) {
		this.name = name;
		this.location =  location;
		this.organizer =  organizer;
		this.dateFrom =  dateFrom;
		this.dateTo =  dateTo;
		this.image =  image;
		this.url =  url;
	}

	createEventInfoElement() {
		var listGroup = document.createElement("div");
		listGroup.classList.add("list-group-item");
		listGroup.classList.add("clearfix");

		var profileTeaserLeft = document.createElement("div");
		profileTeaserLeft.classList.add("profile-teaser-left");
		var profileImage = document.createElement("div");
		profileImage.classList.add("profile-img");
		var imgProfile = document.createElement("img");
		if (this.image) {
			imgProfile.src = this.image;
		} else {
			imgProfile.src = "no-img.png";
		}
		profileImage.appendChild(imgProfile);
		profileTeaserLeft.appendChild(profileImage);
		listGroup.appendChild(profileTeaserLeft);

		var profileTeaserMain = document.createElement("div");
		profileTeaserMain.classList.add("profile-teaser-main");
		var profileName = document.createElement("h3");
		profileName.classList.add("profile-name");
		profileName.innerHTML = "<a target='_blank' href=" + this.url + " >" + this.name + "</a>";
		profileTeaserMain.appendChild(profileName);
		var profileInfo = document.createElement("div");
		profileInfo.classList.add("profile-info");

		var dateInfo = document.createElement("div");
		dateInfo.classList.add("info");
		dateInfo.innerHTML = "<span>Date: </span> " + this.dateFrom;
		profileInfo.appendChild(dateInfo);

		var locationInfo = document.createElement("div");
		locationInfo.classList.add("info");
		locationInfo.innerHTML = "<span>Location: </span> " + this.location;
		profileInfo.appendChild(locationInfo);

		var organizerInfo = document.createElement("div");
		organizerInfo.classList.add("info");
		organizerInfo.innerHTML = "<span>Organizer: </span> " + this.organizer;
		profileInfo.appendChild(organizerInfo);

		profileTeaserMain.appendChild(profileInfo);
		listGroup.appendChild(profileTeaserMain);
		return listGroup;
	}
}

function initSearch(keyWord, fromDate, toDate, location, loadingSuccess, loadingFail) {
	currPage = 0;
	currEventBritePage = 0;
	//always search on eventchain first
	searchOnEventChain(keyWord, fromDate, toDate, location, 
		function(evcSuccessResult){
			cachingRes.concat(evcSuccessResult);
			if (cachingRes.length < numberEventInOnePage) {

			}
		}, function(evcError){

		}
	);
}

function prevPage() {

}

function nextPage(keyWord, fromDate, toDate, location, loadingSuccess, loadingFail) {
	if ()
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

			var url = "";

			if (fullAddress.includes(location.toLowerCase())) {
				let event = new EventInfo(name, locationName, organizer, dateFrom, dateTo, imageUrl, url);
				result.push(event);
			}
			eventchainSuccess(result);
		}

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
		url += "&date_modified.range_start=" + encodeURI(new Date(fromDate).toISOString().substr(0, 19) + "Z");
	}

	if (toDate) {
		url += "&date_modified.range_end=" + encodeURI(new Date(toDate).toISOString().substr(0, 19)  + "Z");
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
			var events = response.events;
			for (let i = 0; i < events.length; i++) {
				var name = events[i].name.text;
				var dateFrom = events[i].start.utc;
				var dateTo = events[i].end.utc;
				var imageUrl;
				if (events[i].logo) {
					imageUrl = events[i].logo.url;
				} else {
					imageUrl = "no-img.png";
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