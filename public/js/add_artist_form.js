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

    const inputName = document.createElement('input');
    inputName.setAttribute("type", "text");
    inputName.setAttribute("name", "name");
    inputName.setAttribute("placeholder", "Artist Name");
    inputName.setAttribute("pattern", "\\S[A-Za-z0-9]*");
    inputName.setAttribute("title", "Username should only contain lowercase letters. e.g. john");
    inputName.setAttribute("required", "");
    // load the artist name into input
    if (artist) inputName.setAttribute("value", artist.name);
    fieldSet.appendChild(inputName);

    // // input the genre for artist

    // const inputGenre = document.createElement('input');
    // inputGenre.setAttribute("type", "text");
    // inputGenre.setAttribute("name", "genre");
    // inputGenre.setAttribute("placeholder", "Genre");
    // // load the artist genre into input
    // if (artist) inputGenre.setAttribute("value", artist.genre);
    // fieldSet.appendChild(inputGenre);

    // // input the description for artist

    // const inputDescription = document.createElement('textarea');
    // inputDescription.setAttribute("name", "description");
    // inputDescription.setAttribute("placeholder", "Short Description");
    // // load the artist description into input
    // if (artist) inputDescription.appendChild(document.createTextNode(artist.description));
    // fieldSet.appendChild(inputDescription);

    // // legend for the selection of stage
    
    // const legend2 = document.createElement('legend');
    // fieldSet.appendChild(legend2);
    // const span2 = document.createElement('span');
    // span2.classList.add('number');
    // span2.appendChild(document.createTextNode('2'));
    // legend2.appendChild(span2);
    // legend2.appendChild(document.createTextNode('Stage'));

    // // option group - select the Stage

    // const stageSelection = document.createElement('select');
    // stageSelection.setAttribute("id", "stageSelection");
    // stageSelection.setAttribute("name", "stageName");
    // fieldSet.appendChild(stageSelection);
    // const optGroup = document.createElement('optgroup');
    // optGroup.setAttribute("label", "Stages");
    // stageSelection.appendChild(optGroup);

    // // load stages into the option group
    // const stages = await loadStages();
    // stages.forEach((stage) => {
    //     const option = document.createElement("option");
    //     option.setAttribute("value", stage.id);
    //     option.appendChild(document.createTextNode(stage.name));
    //     // load the artist stageId into selection input
    //     if (artist && artist.stageId == stage.id) option.setAttribute("selected", "selected");
    //     optGroup.appendChild(option);
    // });

    // // StartTime and EndTime

    // const inputStartTime = document.createElement('input');
    // inputStartTime.setAttribute("type", "text");
    // inputStartTime.setAttribute("name", "startTime");
    // inputStartTime.setAttribute("placeholder", "Start Time");
    // inputStartTime.setAttribute("required", "");
    // // load the artist startTime into input
    // if (artist) inputStartTime.setAttribute("value", artist.startTime);
    // inputStartTime.classList.add("timepicker");
    // fieldSet.appendChild(inputStartTime);

    // const inputEndTime = document.createElement('input');
    // inputEndTime.setAttribute("type", "text");
    // inputEndTime.setAttribute("name", "endTime");
    // inputEndTime.setAttribute("placeholder", "End Time");
    // inputEndTime.setAttribute("required", "");
    // // load the artist endTime into input
    // if (artist) inputEndTime.setAttribute("value", artist.endTime);
    // inputEndTime.classList.add("timepicker");
    // fieldSet.appendChild(inputEndTime);

    // // using materialize's timepicker
    // const timePickers = M.Timepicker.init(document.querySelectorAll('.timepicker'), {
    //     twelveHour: false,
    //     autoClose: true,
    //     defaultTime: 'now'
    // });

    // // legend for Images

    // const legend3 = document.createElement('legend');
    // addNewForm.appendChild(legend3);
    // const span3 = document.createElement('span');
    // span3.classList.add('number');
    // span3.appendChild(document.createTextNode('3'));
    // legend3.appendChild(span3);
    // legend3.appendChild(document.createTextNode('Images'));

    // // upload one icon image

    // // icon section
    // const uploadedIconSection = document.createElement('section');
    // uploadedIconSection.classList.add('uploadedIconSection');
    // addNewForm.appendChild(uploadedIconSection);
    // // icon label
    // const uploadedIconSpan = document.createElement('h4');
    // uploadedIconSpan.classList.add('uploadedIconSpan');
    // uploadedIconSpan.appendChild(document.createTextNode('Icon:'));
    // uploadedIconSection.appendChild(uploadedIconSpan);
    // // icon image (showing the icon)
    // const iconShape = document.createElement('div');    // iconShape to crop the icon
    // iconShape.classList.add('iconShape');
    // uploadedIconSection.appendChild(iconShape);
    // const icon = document.createElement('img');
    // icon.alt = 'icon';
    // icon.classList.add('uploadedIcon');
    // iconShape.appendChild(icon);
    // // input (choose file) - button visible, input invisible because of layout problems
    // const fileIconInputWrapper = document.createElement('div');
    // fileIconInputWrapper.classList.add("fileIconInputWrapper");
    // uploadedIconSection.appendChild(fileIconInputWrapper);
    // // button that is visible
    // const btnIconFile = document.createElement('div');
    // btnIconFile.classList.add("btnImgFile");
    // btnIconFile.appendChild(document.createTextNode("Upload an Icon"));
    // fileIconInputWrapper.appendChild(btnIconFile);
    // // input element hidden behind the button
    // const inputIconFile = document.createElement('input');
    // inputIconFile.setAttribute("type", "file");
    // inputIconFile.setAttribute("name", "iconFile");
    // inputIconFile.setAttribute("accept", "image/*");
    // inputIconFile.setAttribute("onchange", "addUploadedIcon(this)");
    // fileIconInputWrapper.appendChild(inputIconFile);

    // // load the icon image
    // loadArtistIcon(artist);

    // // upload multiple images

    // // images section
    // const uploadedImgSection = document.createElement('section');
    // uploadedImgSection.classList.add('uploadedImgSection');
    // addNewForm.appendChild(uploadedImgSection);
    // // images label
    // const uploadedImgSpan = document.createElement('h4');
    // uploadedImgSpan.classList.add('uploadedImgSpan');
    // uploadedImgSpan.appendChild(document.createTextNode('Images:'));
    // uploadedImgSection.appendChild(uploadedImgSpan);
    // // input (choose files) - button visible, input invisible because of layout problems
    // const fileInputWrapper = document.createElement('div');
    // fileInputWrapper.classList.add("fileInputWrapper");
    // uploadedImgSection.appendChild(fileInputWrapper);
    // // button that is visible
    // const btnImgFile = document.createElement('div');
    // btnImgFile.classList.add("btnImgFile");
    // btnImgFile.appendChild(document.createTextNode("Upload Images"));
    // fileInputWrapper.appendChild(btnImgFile);
    // // input element hidden behind the button
    // const inputImgFile = document.createElement('input');
    // inputImgFile.setAttribute("type", "file");
    // inputImgFile.setAttribute("name", "imgFile");
    // inputImgFile.setAttribute("accept", "image/*");
    // inputImgFile.setAttribute("onchange", "addUploadedImg(this)");
    // inputImgFile.setAttribute("multiple", "");
    // fileInputWrapper.appendChild(inputImgFile);

    // // images (showing the images)
    // loadArtistImages(artist, uploadedImgSection, fileInputWrapper);

    // Apply and Cancel buttons

    const inputApply = document.createElement('input');
    inputApply.setAttribute("type", "submit");
    inputApply.setAttribute("value", "Apply");
    inputApply.setAttribute("id", "applyBtn");
    inputApply.setAttribute("onclick", "artistApplyClicked(this.parentElement.id)");
    addNewForm.appendChild(inputApply);

    const inputCancel = document.createElement('input');
    inputCancel.setAttribute("type", "button");
    inputCancel.setAttribute("value", "Cancel");
    inputCancel.setAttribute("id", "cancelBtn");
    inputCancel.setAttribute("onclick", "artistCancelClicked()");
    addNewForm.appendChild(inputCancel);
}

async function loadArtistIcon(artist) {
    const icon = document.querySelector(".uploadedIcon");
    icon.src = await getArtistIcon(artist);
}

async function addUploadedIcon(input) {
    const id = input.parentElement.parentElement.parentElement.parentElement.id;
    const artists = await uploadArtist(id);
    const artist = artists.find(a => a.id == id);
    // images (showing the images)
    loadArtistIcon(artist);
    input.value = "";
}

function loadArtistImages(artist, parentEl, nextChild) {
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
    const id = input.parentElement.parentElement.parentElement.parentElement.id;

    const artists = await uploadArtist(id);
    const artist = artists.find(a => a.id == id);
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

async function uploadArtist(id) {
    const form = document.forms[0]; // there should always be only one
    const data = new FormData(form);
    data.append('id', id);  // appends the artistId or empty string "", server will deal with it
    console.log("form data: ", data);

    const response = await fetch('/artist', {
        method: 'POST',
        body: data
    });
    if (!response.ok) throw response;
    const artists = await response.json();
    return artists;
}

async function artistApplyClicked(id) {
    // const artists = await uploadArtist(id);
    // console.log(artists);
    // load new artists
    // loadArtists(artists);
}

async function artistCancelClicked() {
    await loadArtists();
}