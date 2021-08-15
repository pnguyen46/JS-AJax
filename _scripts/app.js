'use strict';
// const smartyUrl = 'https://us-street.api.smartystreets.com/street-address?auth-id=106056480360743095&street=86%20Frontage%20Road&city=Belmont&state=MA&candidates=10';
const smartyUrl = 'https://us-street.api.smartystreets.com/street-address?auth-id=106056480360743095&candidates=10';
const smartyInit = {
    headers: {
        'Content-Type' : 'application/json',
         Host: 'us-street.api.smartystreets.com',
    },
};
const parksUrl = 'https://developer.nps.gov/api/v1/parks?stateCode=ca&api_key=7jJDQSu6Q5rMBLZXgtwrRKuASE67jc3pG0U0DV9b';

const addressField = document.querySelector('#address');
const cityField = document.querySelector('#city');
const stateField = document.querySelector('#state');
const zipField = document.querySelector('#zip');
const parkThumb = document.querySelector('#specials h2 img');
const parkSection = document.querySelector('#specials');
const parkName = document.querySelector('#specials h2 a');
const parkDesc = document.querySelector('#specials p');

const smartyUpdateUISuccess = function(parsedData) {
    // const parsedData = JSON.parse(data);
    // console.log(parsedData);
    const zip = parsedData[0].components.zipcode;
    const plus4 = parsedData[0].components.plus4_code;
    // console.log(zip + '-' + plus4);
    zipField.value = zip + '-' + plus4;
};

const smartyUpdateUIError = function(error) {
    console.log(error);
};

const parkUpdateUISuccess = function(parsedData){
    // const parsedData = JSON.parse(data);
    // console.log(parsedData);
    const number = Math.floor(Math.random() * parsedData.data.length);
    // console.log(number);
    parkName.textContent = parsedData.data[number].fullName;
    parkName.href = parsedData.data[number].url;
    parkDesc.textContent = parsedData.data[number].description;
    parkThumb.src = 'https://www.nps.gov/common/commonspot/templates/assetsCT/images/branding/logo.png';
    parkSection.classList.remove('hidden');

}

const parkUpdateUIError = function(error) {
    console.log(error);
};

// const responseMethod = function(httpRequest,succeed,fail) {
//     if(httpRequest.readyState === 4) {
//         if(httpRequest.status === 200) {
//             succeed(httpRequest.responseText);
//         }else {
//             fail(httpRequest.status + ': ' + httpRequest.responseText);
//         }
//     }
// }

// const createRequest = function(url,succeed,fail){
//     const httpRequest = new XMLHttpRequest(url);
//     httpRequest.open('GET',url);
//     httpRequest.send();
//     httpRequest.addEventListener('readystatechange',(url) => {
//         responseMethod(httpRequest,succeed,fail);
//     });
// };

const handleErrors = function(response) {
    if(!response.ok) {
        throw (response.status + ': ' + response.statusText);
    }
    return response.json();
}


const createRequest = function(url,succeed,fail,init) {
    fetch(url,init)
        .then((response) => handleErrors(response))
        .then((data) => succeed(data))
        .catch((error) => fail(error));
};

const checkCompletion = function(){
    if( addressField.value !== '' && 
        cityField.value !== '' && 
        stateField !== ''){
            const requestUrl = smartyUrl +
            '&street=' + addressField.value +
            '&city=' + cityField.value +
            '&state=' + stateField.value;
            createRequest(requestUrl,smartyUpdateUISuccess,smartyUpdateUIError,smartyInit);
        }
}
// createRequest(smartyUrl);
// createRequest(parksUrl,parkUpdateUISuccess,parkUpdateUIError);

addressField.addEventListener('blur',checkCompletion);
cityField.addEventListener('blur',checkCompletion);
stateField.addEventListener('blur',checkCompletion);
window.addEventListener('DOMContentLoaded',() => {
    createRequest(parksUrl,parkUpdateUISuccess,parkUpdateUIError);
});
