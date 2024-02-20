import http from '../configs/http';

const pdev: any = {

    directory: async () => {
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
    },

    games: async () => {
        const url =
            http.host
            + http.api
            + http.version
            + http.user
            + '/get-game-instance-report';
        const response = await fetch(url, {
            headers: {
                "Authorization": 'Bearer ' + localStorage['token'],
            }
        });
        const json = await response.json();
        console.log(json);
        console.log('Directory report:\n' + json.report);
    },

};

(window as any).pdev = pdev;
export default pdev;