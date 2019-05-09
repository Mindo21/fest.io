'use strict';

const addNewForm = document.getElementById('addNewForm');
const stageSelection = document.getElementById('stageSelection');

function applyClicked() {

}

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.timepicker');
    var instances = M.Timepicker.init(elems, { twelveHour: false });
});

async function fetchStages() {
    // fetch all stages
    const response = await fetch('/stage');
    if (!response.ok) throw response;
    return await response.json();
}

async function loadStages(stages) {
    if (!stages){
        stages = await fetchStages();
    }

    stageSelection.innerHTML = "";

    const optGroup = document.createElement("optgroup");
    optGroup.setAttribute("label", "Stages");
    stageSelection.appendChild(optGroup);

    stages.forEach((stage) => {
        const option = document.createElement("option");
        option.setAttribute("value", stage.id);
        option.appendChild(document.createTextNode(stage.name));
        optGroup.appendChild(option);
    });
    

    // <optgroup label="Stages">
    //     <option value="fishkeeping">Fishkeeping</option>
    // </optgroup>

    // add each stage to the list
    // stages.forEach((stage) => addStageListItem(stage));
    // add the add row
    // addStageListItem();
}


function init() {
    loadStages();
}

window.addEventListener('load', init);