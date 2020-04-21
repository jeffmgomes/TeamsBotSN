const axios = require('axios');

class ServiceNow {
    constructor(token) {
        if (!token || !token.trim()) {
            throw new Error('ServiceNow: Invalid token received.');
        }

        this.request = axios.create({
            baseURL: process.env.ServiceNowInstance,
            timeout: 1000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });

    }

    async createTask(priority, description) {
        var requestBody = {
            "priority": priority,
            "short_description": "Task created using teams",
            "description": description
        };

        try {
            const response = await this.request.post('/api/now/table/sc_task', requestBody);
            return response; // The response will only be available if in the 2xx range
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                return error.response;
              } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
              } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
              }
        }
    }
}

module.exports.ServiceNow = ServiceNow;