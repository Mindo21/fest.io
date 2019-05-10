async function generateStageForm(stageListItem) {
    let stage = null;
    const li = document.createElement("li");
    li.classList.add('addingStage');

    if (stageListItem) {
        // fetch stage
        const response = await fetch('/stage/' + stageListItem.firstChild.name);    // in this case, name is the stageId
        if (!response.ok) throw response;
        stage = await response.json();

        const nextItem = stageListItem.nextSibling;
        removeStageListItem(stageListItem);
        stagesList.insertBefore(li, nextItem);
    } else {
        removeStageListItem(); // removes the last list item
        stagesList.appendChild(li);    // appends at the end
    }

    // form section is the child of the li element

    const addNewFormSection = document.createElement("section");
    addNewFormSection.setAttribute("id", "addNewFormSection");
    li.appendChild(addNewFormSection);

    // the form has the artistId so that it can be brought back

    const addNewForm = document.createElement("form");
    if (stage) addNewForm.setAttribute("id", stage.id);
    addNewForm.setAttribute("action", "/stage");
    addNewForm.setAttribute("method", "POST");
    addNewFormSection.appendChild(addNewForm);

    const divId = document.createElement('input');
    divId.setAttribute("id", "invisibleInputId");
    divId.setAttribute("name", "id");
    if (stage) divId.setAttribute("value", stage.id);
    addNewForm.appendChild(divId);

    // everything is in the fieldset except buttons

    const fieldSet = document.createElement("fieldset");
    addNewForm.appendChild(fieldSet);

    // legend saying 'New Stage' or the name of the stage

    const legend1 = document.createElement('legend');
    fieldSet.appendChild(legend1);
    const span1 = document.createElement('span');
    span1.classList.add('number');
    span1.appendChild(document.createTextNode('1'));
    legend1.appendChild(span1);
    // load the stage name
    const newStageText = stage ? stage.name : 'New Stage';
    legend1.appendChild(document.createTextNode(newStageText));

    // input the name of the stage
    const inputNameLabel = document.createElement('label');
    inputNameLabel.setAttribute("for", "name");
    inputNameLabel.appendChild(document.createTextNode("Name:"));
    fieldSet.appendChild(inputNameLabel);

    const inputName = document.createElement('input');
    inputName.setAttribute("type", "text");
    inputName.setAttribute("name", "name");
    inputName.setAttribute("id", "name");
    inputName.setAttribute("placeholder", "Stage Name");
    inputName.setAttribute("pattern", "\\S[A-Za-z0-9 ]*");
    inputName.setAttribute("title", "The name has to be words made from characters a-Z or numbers, e.g. Main Stage");
    inputName.setAttribute("required", "");
    // load the stage name into input
    if (stage) inputName.setAttribute("value", stage.name);
    fieldSet.appendChild(inputName);

    // focus on the name
    inputName.focus();
    inputName.select();

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
    inputCancel.setAttribute("onclick", "stageCancelClicked()");
    btnsSection.appendChild(inputCancel);
}

function stageCancelClicked() {
    init(); // load all artists and stages
}