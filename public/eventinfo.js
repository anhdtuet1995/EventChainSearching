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
			imgProfile.src = "public/no-img.png";
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