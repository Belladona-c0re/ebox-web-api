import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StakingService {

    constructor() { }

    async getDateLimits() {

        let endpoint = 'https://www.ethbox.org/staking/fetch_data.php';

        let formData = new FormData();
        formData.append('action', 'get_date_limits');

        let response = await fetch(endpoint, { method: 'POST', body: formData });
        let { data: result } = await response.json();
        return result;
    }

    async getData(pageMonth, pageDate) {

        let endpoint = 'https://www.ethbox.org/staking/fetch_data.php';

        let formData = new FormData();
        formData.append('action', 'get_data');
        formData.append('month', pageMonth + 1);
        formData.append('day', pageDate);

        let response = await fetch(endpoint, { method: 'POST', body: formData });
        let { data: result } = await response.json();
        return result;
    }
    
}
