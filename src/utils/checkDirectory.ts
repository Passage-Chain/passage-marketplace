import http from '../configs/http';

/**
 * A utility that allows superusers to check on the directory status through a 
 * backend route only open to superusers.
 */
const checkDirectory = async () => {
    const url =
        http.host
        + http.api
        + http.version
        + http.user
        + '/get-directory-census';
    const response = await fetch(url, {
        headers: {
            "Authorization": 'Bearer ' + localStorage['token'],
        }
    });
    const json = await response.json();
    console.log('Directory state:', JSON.stringify(json, null, 4));
}

export default checkDirectory;