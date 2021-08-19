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
const parksFallback = {
    "url": "https://www.nps.gov/alca/index.htm",
    "fullName": "Alcatraz Island",
    "description": "Alcatraz reveals stories of American incarceration, justice, and our common humanity. This small island was once a fort, a military prison, and a maximum security federal penitentiary. In 1969, the Indians of All Tribes occupied Alcatraz for 19 months in the name of freedom and Native American civil rights. We invite you to explore Alcatraz's complex history and natural beauty.",
};

/*Selecting elements from the DOM */
const addressField = document.querySelector('#address');
const cityField = document.querySelector('#city');
const stateField = document.querySelector('#state');
const zipField = document.querySelector('#zip');
const parkThumb = document.querySelector('#specials h2 img');
const parkSection = document.querySelector('#specials');
const parkName = document.querySelector('#specials h2 a');
const parkDesc = document.querySelector('#specials p');

/*Display the zipcode if the request is successful */
const smartyUpdateUISuccess = function(parsedData) {
    // const parsedData = JSON.parse(data);
    // console.log(parsedData);
    const zip = parsedData[0].components.zipcode;
    const plus4 = parsedData[0].components.plus4_code;
    // console.log(zip + '-' + plus4);
    zipField.value = zip + '-' + plus4;
};

/*Display the error if the request failed */
const smartyUpdateUIError = function(error) {
    console.log(error);
};

/*Display the park information if the request is successful */
const parkUpdateUISuccess = function(parsedData){
    // console.log(data);
    // const parsedData = JSON.parse(data);
    console.log(parsedData);
    const number = Math.floor(Math.random() * parsedData.data.length);
    // console.log(number);
    parkName.textContent = parsedData.data[number].fullName;
    parkName.href = parsedData.data[number].url;
    parkDesc.textContent = parsedData.data[number].description;
    parkThumb.src = 'https://www.nps.gov/common/commonspot/templates/assetsCT/images/branding/logo.png';
    parkSection.classList.remove('hidden');

}

/*Display the error if the request failed.
Display the fall back parks information */
const parkUpdateUIError = function(error) {
    // console.log(error);
    parkName.textContent = parksFallback.fullName;
    parkName.href = parksFallback.url;
    parkDesc.textContent = parksFallback.description;
    parkThumb.src = 'https://www.nps.gov/common/commonspot/templates/assetsCT/images/branding/logo.png';
    parkSection.classList.remove('hidden');
};

// const responseMethod = function(httpRequest,succeed,fail) {
//     if(httpRequest.readyState === httpRequest.DONE) {
//         if(httpRequest.status === 200) {
//             succeed(httpRequest.responseText);
//         }else {
//             fail(httpRequest.status + ': ' + httpRequest.responseText);
//         }
//     }
// };

// const createRequest = function(url,succeed,fail){
//     const httpRequest = new XMLHttpRequest(url);
//     httpRequest.open('GET',url);
//     httpRequest.addEventListener('readystatechange',(url) => {
//         responseMethod(httpRequest,succeed,fail);
//     });
//     httpRequest.send();
// };

/*Check the returned request to see if there is an errors.
Return an error if there is one else return an object containing all the neccessary data*/
const handleErrors = function(response) {
    if(!response.ok) {
        throw new Error((response.status + ': ' + response.statusText));
    }
    return response.json(); // will parse the json string into an object
}

/* Fetch request from the provided url. 
Check to see if there is an error with the request.
Process the object to display data.
Perform error handling*/
const createRequest = function(url,succeed,fail,init) {
    fetch(url,init)
        .then((response) => handleErrors(response))
        .then((data) => succeed(data))
        .catch((error) => fail(error));
};

/* Checks if the value of address,city, and state are empty then proceed to build the url for smarty request*/
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

/*Event listener that run once user tab out of the address field, city field, or state field.
Each listener call the checkCompletion() to input the need data so a custom url can be build for data requesting*/
addressField.addEventListener('blur',checkCompletion);
cityField.addEventListener('blur',checkCompletion);
stateField.addEventListener('blur',checkCompletion);

/*Event listener that will run once the page has finished loading.
Call the createRequest() to create a request and retrive datas*/
window.addEventListener('DOMContentLoaded',() => {
    createRequest(parksUrl,parkUpdateUISuccess,parkUpdateUIError);
});
