async function generateArtistForm(artistListItem) {
    let artist = null;
    const li = document.createElement("li");
    li.classList.add('addingArtist');

    if (artistListItem) {
        // fetch artist
        const response = await fetch('/artist/' + artistListItem.firstChild.id);
        if (!response.ok) throw response;
        artist = await response.json();

        const nextItem = artistListItem.nextSibling;
        removeArtistListItem(artistListItem);
        artistsList.insertBefore(li, nextItem);
    } else {
        removeArtistListItem(); // removes the last list item
        artistsList.appendChild(li);    // appends at the end
    }

    // form section is the child of the li element

    const addNewFormSection = document.createElement("section");
    addNewFormSection.setAttribute("id", "addNewFormSection");
    li.appendChild(addNewFormSection);

    // the form has the artistId so that it can be brought back

    const addNewForm = document.createElement("form");
    if (artist) addNewForm.setAttribute("id", artist.id);
    addNewForm.setAttribute("action", "/artist");
    addNewForm.setAttribute("method", "POST");
    addNewFormSection.appendChild(addNewForm);

    // invisible input just to pass the artist's id to the form data
    const divId = document.createElement('input');
    divId.setAttribute("id", "invisibleInputId");
    divId.setAttribute("name", "id");
    if (artist) divId.setAttribute("value", artist.id);
    addNewForm.appendChild(divId);

    // everything is in the fieldset except buttons

    const fieldSet = document.createElement("fieldset");
    addNewForm.appendChild(fieldSet);

    // legend saying 'New Artist' or the name of the artist

    const legend1 = document.createElement('legend');
    fieldSet.appendChild(legend1);
    const span1 = document.createElement('span');
    span1.classList.add('number');
    span1.appendChild(document.createTextNode('1'));
    legend1.appendChild(span1);
    // load the artist name
    const newArtistText = artist ? artist.name : 'New Artist';
    legend1.appendChild(document.createTextNode(newArtistText));

    // input the name of the artist
    const inputNameLabel = document.createElement('label');
    inputNameLabel.setAttribute("for", "name");
    inputNameLabel.appendChild(document.createTextNode("Name:"));
    fieldSet.appendChild(inputNameLabel);
    
    const inputName = document.createElement('input');
    inputName.setAttribute("type", "text");
    inputName.setAttribute("name", "name");
    inputName.setAttribute("id", "name");
    inputName.setAttribute("placeholder", "Artist Name");
    inputName.setAttribute("pattern", "\\S[A-Za-z0-9 ]*");
    inputName.setAttribute("title", "The name has to be words made from characters a-Z or numbers, e.g. Bruno Mars");
    inputName.setAttribute("required", "");
    // load the artist name into input
    if (artist) inputName.setAttribute("value", artist.name);
    fieldSet.appendChild(inputName);

    // focus on the name
    inputName.focus();
    inputName.select();

    // input the genre for artist
    const inputGenreLabel = document.createElement('label');
    inputGenreLabel.setAttribute("for", "genre");
    inputGenreLabel.appendChild(document.createTextNode("Genre:"));
    fieldSet.appendChild(inputGenreLabel);

    const inputGenre = document.createElement('input');
    inputGenre.setAttribute("type", "text");
    inputGenre.setAttribute("name", "genre");
    inputGenre.setAttribute("id", "genre");
    inputGenre.setAttribute("placeholder", "Genre");
    inputGenre.setAttribute("pattern", "\\S.*");
    inputGenre.setAttribute("title", "The genre has to start with a non-space character, e.g. R&B");
    inputGenre.setAttribute("required", "");
    // load the artist genre into input
    if (artist) inputGenre.setAttribute("value", artist.genre);
    fieldSet.appendChild(inputGenre);

    // input the description for artist
    const inputDescLabel = document.createElement('label');
    inputDescLabel.setAttribute("for", "description");
    inputDescLabel.appendChild(document.createTextNode("Short Description:"));
    fieldSet.appendChild(inputDescLabel);

    const inputDescription = document.createElement('textarea');
    inputDescription.setAttribute("name", "description");
    inputDescription.setAttribute("id", "description");
    inputDescription.setAttribute("placeholder", "Short Description");
    inputDescription.setAttribute("pattern", "\\S.*");
    inputDescription.setAttribute("title", "The description has to start with a non-space character, e.g. This is a rock-band.");
    inputDescription.setAttribute("required", "");
    // load the artist description into input
    if (artist) inputDescription.appendChild(document.createTextNode(artist.description));
    fieldSet.appendChild(inputDescription);

    // legend for the selection of stage
    
    const legend2 = document.createElement('legend');
    fieldSet.appendChild(legend2);
    const span2 = document.createElement('span');
    span2.classList.add('number');
    span2.appendChild(document.createTextNode('2'));
    legend2.appendChild(span2);
    legend2.appendChild(document.createTextNode('Stage'));

    // option group - select the Stage
    const stageSelectionLabel = document.createElement('label');
    stageSelectionLabel.setAttribute("for", "stageSelection");
    stageSelectionLabel.appendChild(document.createTextNode("Select the Stage, where the Artist will perform:"));
    fieldSet.appendChild(stageSelectionLabel);

    const stageSelection = document.createElement('select');
    stageSelection.setAttribute("id", "stageSelection");
    stageSelection.setAttribute("name", "stageId");
    stageSelection.setAttribute("pattern", ".*");
    stageSelection.setAttribute("title", "It has to be an existing stage, select from the list or create a new one.");
    stageSelection.setAttribute("required", "");
    fieldSet.appendChild(stageSelection);
    const optGroup = document.createElement('optgroup');
    optGroup.setAttribute("label", "Stages");
    stageSelection.appendChild(optGroup);

    // load stages into the option group
    const stages = await loadStages();
    if (stages && stages.length <= 0) {
        // if there are no stages
        const option = document.createElement("option");
        option.setAttribute("value", "-1");
        option.appendChild(document.createTextNode("There are no stages yet..."));
        option.setAttribute("disabled", "");
        optGroup.appendChild(option);
    } else if (stages) {
        // list the loaded stages in options
        stages.forEach((stage) => {
            const option = document.createElement("option");
            option.setAttribute("value", stage.id);
            option.appendChild(document.createTextNode(stage.name));
            // load the artist stageId into selection input
            if (artist && artist.stageId == stage.id) option.setAttribute("selected", "");
            optGroup.appendChild(option);
        });
    }

    // if they want to add a new stage
    const linkToAddNewStage = document.createElement('a');
    linkToAddNewStage.setAttribute("id", "linkToAddNewStage");
    linkToAddNewStage.setAttribute("href", "#stagesSection");
    linkToAddNewStage.setAttribute("onclick", "goToAddNewStage()");
    linkToAddNewStage.appendChild(document.createTextNode("Or add a new stage..."));
    fieldSet.appendChild(linkToAddNewStage);
    
    // StartTime and EndTime
    const inputStartTimeSection = document.createElement('section');
    inputStartTimeSection.classList.add("timepickerSection");
    fieldSet.appendChild(inputStartTimeSection);

    const inputStartTimeLabel = document.createElement('label');
    inputStartTimeLabel.setAttribute("for", "startTime");
    inputStartTimeLabel.appendChild(document.createTextNode("The start of the Artist's performance:"));
    inputStartTimeSection.appendChild(inputStartTimeLabel);

    const inputStartTime = document.createElement('input');
    inputStartTime.setAttribute("type", "text");
    inputStartTime.setAttribute("name", "startTime");
    inputStartTime.setAttribute("id", "startTime");
    inputStartTime.setAttribute("placeholder", "Start Time");
    stageSelection.setAttribute("pattern", "[0-9][0-9]:[0-9][0-9]");
    stageSelection.setAttribute("title", "It has to be a time (hh:mm), e.g. 17:45");
    inputStartTime.setAttribute("required", "");
    // load the artist startTime into input
    if (artist) inputStartTime.setAttribute("value", artist.startTime);
    inputStartTime.classList.add("timepicker");
    inputStartTimeSection.appendChild(inputStartTime);

    const inputEndTimeSection = document.createElement('section');
    inputEndTimeSection.classList.add("timepickerSection");
    fieldSet.appendChild(inputEndTimeSection);

    const inputEndTimeLabel = document.createElement('label');
    inputEndTimeLabel.setAttribute("for", "endTime");
    inputEndTimeLabel.appendChild(document.createTextNode("The end of the Artist's performance:"));
    inputEndTimeSection.appendChild(inputEndTimeLabel);

    const inputEndTime = document.createElement('input');
    inputEndTime.setAttribute("type", "text");
    inputEndTime.setAttribute("name", "endTime");
    inputEndTime.setAttribute("id", "endTime");
    inputEndTime.setAttribute("placeholder", "End Time");
    stageSelection.setAttribute("pattern", "[0-9][0-9]:[0-9][0-9]");
    stageSelection.setAttribute("title", "It has to be a time (hh:mm), e.g. 17:45");
    inputEndTime.setAttribute("required", "");
    // load the artist endTime into input
    if (artist) inputEndTime.setAttribute("value", artist.endTime);
    inputEndTime.classList.add("timepicker");
    inputEndTimeSection.appendChild(inputEndTime);

    // using materialize's timepicker
    const timePickers = M.Timepicker.init(document.querySelectorAll('.timepicker'), {
        twelveHour: false,
        autoClose: true,
        defaultTime: 'now'
    });

    // legend for Images

    const legend3 = document.createElement('legend');
    fieldSet.appendChild(legend3);
    const span3 = document.createElement('span');
    span3.classList.add('number');
    span3.appendChild(document.createTextNode('3'));
    legend3.appendChild(span3);
    legend3.appendChild(document.createTextNode('Images'));

    // upload one icon image

    // icon section
    const uploadedIconSection = document.createElement('section');
    uploadedIconSection.classList.add('uploadedIconSection');
    addNewForm.appendChild(uploadedIconSection);
    // icon label
    const uploadedIconSpan = document.createElement('h4');
    uploadedIconSpan.classList.add('uploadedIconSpan');
    uploadedIconSpan.appendChild(document.createTextNode('Icon:'));
    uploadedIconSection.appendChild(uploadedIconSpan);
    // icon image (showing the icon)
    const iconShape = document.createElement('div');    // iconShape to crop the icon
    iconShape.classList.add('iconShape');
    uploadedIconSection.appendChild(iconShape);
    const icon = document.createElement('img');
    icon.alt = 'icon';
    icon.classList.add('uploadedIcon');
    iconShape.appendChild(icon);
    // input (choose file) - button visible, input invisible because of layout problems
    const fileIconInputWrapper = document.createElement('div');
    fileIconInputWrapper.classList.add("fileIconInputWrapper");
    uploadedIconSection.appendChild(fileIconInputWrapper);
    // button that is visible
    const btnIconFile = document.createElement('div');
    btnIconFile.classList.add("btnImgFile");
    btnIconFile.appendChild(document.createTextNode("Upload an Icon"));
    fileIconInputWrapper.appendChild(btnIconFile);
    // input element hidden behind the button
    const inputIconFile = document.createElement('input');
    inputIconFile.setAttribute("type", "file");
    inputIconFile.setAttribute("name", "iconFile");
    inputIconFile.setAttribute("accept", "image/*");
    inputIconFile.setAttribute("onchange", "addUploadedIcon(this)");
    fileIconInputWrapper.appendChild(inputIconFile);

    // load the icon image
    loadArtistIcon(artist);

    // upload multiple images

    // images section
    const uploadedImgSection = document.createElement('section');
    uploadedImgSection.classList.add('uploadedImgSection');
    addNewForm.appendChild(uploadedImgSection);
    // images label
    const uploadedImgSpan = document.createElement('h4');
    uploadedImgSpan.classList.add('uploadedImgSpan');
    uploadedImgSpan.appendChild(document.createTextNode('Images:'));
    uploadedImgSection.appendChild(uploadedImgSpan);
    // input (choose files) - button visible, input invisible because of layout problems
    const fileInputWrapper = document.createElement('div');
    fileInputWrapper.classList.add("fileInputWrapper");
    uploadedImgSection.appendChild(fileInputWrapper);
    // button that is visible
    const btnImgFile = document.createElement('div');
    btnImgFile.classList.add("btnImgFile");
    btnImgFile.appendChild(document.createTextNode("Upload Images"));
    fileInputWrapper.appendChild(btnImgFile);
    // input element hidden behind the button
    const inputImgFile = document.createElement('input');
    inputImgFile.setAttribute("type", "file");
    inputImgFile.setAttribute("name", "imgFile");
    inputImgFile.setAttribute("accept", "image/*");
    inputImgFile.setAttribute("onchange", "addUploadedImg(this)");
    inputImgFile.setAttribute("multiple", "");
    fileInputWrapper.appendChild(inputImgFile);

    // images (showing the images)
    loadArtistImages(artist, uploadedImgSection, fileInputWrapper);

    // Apply and Cancel buttons

    const btnsSection = document.createElement('section');
    btnsSection.setAttribute("id", "btnsSection");
    addNewForm.appendChild(btnsSection);

    const inputApply = document.createElement('input');
    inputApply.setAttribute("type", "submit");
    inputApply.setAttribute("value", "Apply");
    inputApply.setAttribute("id", "applyBtn");
    btnsSection.appendChild(inputApply);

    const inputCancel = document.createElement('input');
    inputCancel.setAttribute("type", "button");
    inputCancel.setAttribute("value", "Cancel");
    inputCancel.setAttribute("id", "cancelBtn");
    inputCancel.setAttribute("onclick", "artistCancelClicked()");
    btnsSection.appendChild(inputCancel);
}

function goToAddNewStage() {
    addingNewStage();
    return true;
}

async function loadArtistIcon(artist) {
    const icon = document.querySelector(".uploadedIcon");
    icon.src = await getArtistIcon(artist);
}

async function addUploadedIcon(input) {
    const artists = await uploadArtist();
    const invisibleInputId = document.getElementById('invisibleInputId');
    const id = invisibleInputId.value;
    let artist;
    if (id == "") {
        // there was a new artist added -> must be the last one
        artist = artists[artists.length-1];
        invisibleInputId.value = artist.id; // set the id to the invisible input
        invisibleInputId.parentElement.setAttribute("id", artist.id);   // set the id of the form
    } else {
        // an existing artist was updated
        artist = artists.find(a => a.id == id);
    }
    console.log("artists returned after upload: ", artists);
    console.log("artist id: ", id);

    // images (showing the images)
    loadArtistIcon(artist);
    input.value = "";
}

function loadArtistImages(artist, parentEl, nextChild) {
    console.log("loading artist images... artist: ", artist);
    // erase the images
    const noImgSpan = document.querySelector(".noImgSpan");
    if (noImgSpan) noImgSpan.remove();
    const uploadedImgs = document.querySelectorAll(".uploadedImg");
    if (uploadedImgs.length > 0) uploadedImgs.forEach(img => img.remove());

    if ((artist && artist.images.length <= 0) || (!artist)) {
        // display no image...
        const noImgSpan = document.createElement('span');
        noImgSpan.classList.add('noImgSpan');
        noImgSpan.appendChild(document.createTextNode('There are no images uploaded yet...'));
        parentEl.insertBefore(noImgSpan, nextChild);
    } else if (artist) {
        // load all the images
        artist.images.forEach((imgName) => {
            const img = document.createElement('img');
            img.src = '/img/' + artist.id + '/' + imgName;
            img.alt = imgName || 'uploaded image';
            img.classList.add('uploadedImg');
            parentEl.insertBefore(img, nextChild);
        });
    }
}

async function addUploadedImg(input) {
    const uploadedImgSection = document.querySelector(".uploadedImgSection");
    const fileInputWrapper = document.querySelector(".fileInputWrapper");
    const artists = await uploadArtist();
    const invisibleInputId = document.getElementById('invisibleInputId');
    const id = invisibleInputId.value;
    let artist;
    if (id == "") {
        // there was a new artist added -> must be the last one
        artist = artists[artists.length-1];
        invisibleInputId.value = artist.id; // set the id to the invisible input
        invisibleInputId.parentElement.setAttribute("id", artist.id);   // set the id of the form
    } else {
        // an existing artist was updated
        artist = artists.find(a => a.id == id);
    }
    console.log("artists returned after upload: ", artists);
    console.log("artist id: ", id);
    // images (showing the images)
    loadArtistImages(artist, uploadedImgSection, fileInputWrapper);
    input.value = "";
}

async function getArtistIcon(artist) {
    if (!artist) return defaultImg;
    const response = await fetch('/img/' + artist.id + '/' + artist.icon);    
    // if there is no icon found, return default image
    if (response.status != 200) {
        return defaultImg;
    }
    // return the call to the icon
    return '/img/' + artist.id + '/' + artist.icon;
}

async function uploadArtist() {
    const form = document.forms[0]; // there should always be only one
    const data = new FormData(form);
    //data.append('id', id);  // appends the artistId or empty string "", server will deal with it

    const response = await fetch('/artist', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
        },
        body: data
    });
    if (!response.ok) throw response;
    const artists = await response.json();
    return artists;
}

function artistCancelClicked() {
    init(); // load all artists and stages
}