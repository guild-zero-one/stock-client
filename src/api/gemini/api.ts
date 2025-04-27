import axios from 'axios';

const apiGemini = axios.create({
    baseURL: 'http://localhost:9999',
    timeout: 1000000, //100 Segundos
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiGemini;