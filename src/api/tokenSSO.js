import axios from 'axios'
import config from './config';

const tokenSSO= axios.create({
    baseURL:config.ssoUrl
})
  


export default tokenSSO