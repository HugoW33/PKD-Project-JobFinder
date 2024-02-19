import axios from "axios";

//console.log(axios.isCancel('something'));

axios({
    method: 'get', 
    url: 'https://arbetsformedlingen.se/platsbanken/annonser?q=sjuksköterska',
    responseType: 'stream'
})
.then(response => {
        console.log(response);
});