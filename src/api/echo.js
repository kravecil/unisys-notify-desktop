import { api } from 'src/boot/axios'
import { hosts } from 'src/api/hosts'

import Echo from 'laravel-echo'

const Pusher = require('pusher-js');

export const echo = new Echo({
  broadcaster: 'pusher',
  key: 'PUSHER_APP_KEY',
  wsHost: hosts.ws.host,
  cluster: 'mt1',
  wsPort: 6001,
  forceTLS: false,
  disableStats: true,
  authorizer: (channel, options) => {
    return {
        authorize: (socketId, callback) => {
            api.post(hosts.ws + 'broadcasting/auth', {
                socket_id: socketId,
                channel_name: channel.name
            })
            .then(response => {
                callback(false, response.data);
            })
            .catch(error => {
                callback(true, error);
            });
        }
    };
  },
})
