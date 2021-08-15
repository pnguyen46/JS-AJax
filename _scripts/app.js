'use strict';
const smartyUrl = 'https://us-street.api.smartystreets.com/street-address?auth-id=106056480360743095&street=86%20Frontage%20Road&city=Belmont&state=MA&candidates=10';

const parksUrl = 'https://developer.nps.gov/api/v1/parks?stateCode=ca&api_key=7jJDQSu6Q5rMBLZXgtwrRKuASE67jc3pG0U0DV9b';

const updateUISuccess = function(data) {
    console.log(data);
};

const updateUIError = function(error) {
    console.log(error);
};

const responseMethod = function(httpRequest) {
    if(httpRequest.readyState === 4) {
        if(httpRequest.status === 200) {
            updateUISuccess(httpRequest.responseText);
        }else {
            updateUIError(httpRequest.status + ': ' + httpRequest.responseText);
        }
    }
}

const createRequest = function(url){
    const httpRequest = new XMLHttpRequest(url);
    httpRequest.open('GET',url);
    httpRequest.send();
    httpRequest.addEventListener('readystatechange',(url) => {
        responseMethod(httpRequest);
    });
};
// createRequest(smartyUrl);
createRequest(parksUrl);
