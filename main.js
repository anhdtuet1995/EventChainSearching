var oauthEventbriteKey = "WY5CK4MUPSE4DQSPEDWQ";
var numberEventInOnePage = 10;

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
  		imgProfile.src = this.image;
  		profileImage.appendChild(imgProfile);
  		profileTeaserLeft.appendChild(profileImage);
  		listGroup.appendChild(profileTeaserLeft);

  		var profileTeaserMain = document.createElement("div");
  		profileTeaserMain.classList.add("profile-teaser-main");
  		var profileName = document.createElement("h2");
  		profileName.classList.add("profile-name");
  		profileName.innerHTML = this.name;
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


function searchOnEventChain(keyWord, fromDate, toDate) {

	console.log("Start searching on EventChain");

	dateFiltering = "";
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
		"async": true,
		"crossDomain": true,
		"url": "https://api.eventchain.io/open",
		"method": "POST",
		"headers": {
		    "content-type": "application/json",
		    "accept": "*/*",
		    "cache-control": "no-cache",
		},
		"processData": false,
		  "data": "{\"query\":\"query{\\n        getEvents(\\n                    SearchParams:{\\n                        KeyWord: \\\"" + keyWord + "\\\"\\n     " + dateFiltering + "                 }\\n                )\\n                {\\n                    ID\\n                    CreateDate\\n                    CreateUserID\\n                    Status\\n                    TaxCalculationType\\n                    InWishList\\n                    BlockchainSecured\\n                    EventInfo {\\n                        Title\\n                        Host\\n                        StartDate\\n\\n                        EndDate: \\n\\n                        Description\\n                        EventImageURL\\n                        TimeZone {\\n                            TZoneID\\n                            FullName\\n                            Name\\n                        }\\n                    }\\n                    EventLocation {\\n                        VenueID\\n                        VenueName\\n                        DisplayMapOnEvent\\n                        Address {\\n                            Address1\\n                            Address2\\n                            City\\n                            CountryID\\n                            CountryName\\n                            ProvinceID\\n                            ProvinceName\\n                            PostalCode\\n                            MapCoords {\\n                                Lat\\n                                Long\\n                                Zoom\\n                            }\\n                        }\\n                    }\\n                    TicketTypes {\\n                        TicketTypeID\\n                        TypeName\\n                        EventID\\n                        Category\\n                        SeatingType\\n                        Price\\n                        Quantity\\n                        Description\\n                        Available\\n                        Currency\\n                        CurrencySign\\n                    }\\n                    ApplicableTaxes {\\n                        EventTaxID\\n                        TaxName\\n                        TaxPercent\\n                    }\\n                }\\n            }\"}"
	}

	$.ajax(settings).done(function (response) {
		var events = response.data.getEvents;
	  	for (i = 0; i < events.length; i++) {
	  		var name = events[i].EventInfo.Title;
	  		var locationName = events[i].EventLocation.Address.CountryName;
	  		var organizer = events[i].EventInfo.Host;
	  		var dateFrom = events[i].EventInfo.StartDate;
	  		var dateTo = events[i].EventInfo.EndDate;
	  		var imageUrl = events[i].EventInfo.EventImageURL;
	  		var url = "";
	  		
	  		let event = new EventInfo(name, locationName, organizer, dateFrom, dateTo, imageUrl, url);
	  		var elem = event.createEventInfoElement();
	  		document.getElementById("event-list").appendChild(elem);
	  	}

	  	console.log("Done");
	});
  
}

function searchOnEventBrite(keyWord, fromDate, toDate, location = null) {
	var url = "https://www.eventbriteapi.com/v3/events/search/?token=WY5CK4MUPSE4DQSPEDWQ";

	if (location != null) {
		url += "&location.within=10km&location.address=" + location; 
	}

	if (fromDate != null) {
		url += "&date_modified.range_start=" + fromDate;
	}

	if (toDate != null) {
		url += "&date_modified.range_end=" + toDate;
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

	$.ajax(settings).done(function (response) {
	  console.log(response);
	});

}