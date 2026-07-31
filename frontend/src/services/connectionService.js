import { request } from './authService';

const unwrap = (promise) => promise.then((response) => response.data).catch((error) => {
  const message = error?.response?.data?.detail;
  throw new Error(typeof message === 'string' ? message : 'We could not complete that connection action. Please try again.');
});

export const CONNECTIONS_CHANGED = 'kalqlater:connections-changed';
export const notifyConnectionsChanged = () => window.dispatchEvent(new Event(CONNECTIONS_CHANGED));

export const sendConnectionRequest = (recipient_username, message = '') => unwrap(
  request({ url: '/community/connections', method: 'post', data: { recipient_username, message } }),
).then((data) => {
  notifyConnectionsChanged();
  return data;
});
export const getConnectionStatus = (username) => unwrap(request({ url: `/community/connections/status/${encodeURIComponent(username)}` }));
export const getIncomingConnections = (page = 1) => unwrap(request({ url: '/community/connections/incoming', params: { page } }));
export const getOutgoingConnections = (page = 1) => unwrap(request({ url: '/community/connections/outgoing', params: { page } }));
export const getAcceptedConnections = (page = 1) => unwrap(request({ url: '/community/connections/accepted', params: { page } }));
export const getPendingConnectionCount = () => unwrap(request({ url: '/community/connections/pending-count' }));

const changeStatus = (connectionId, action) => unwrap(
  request({ url: `/community/connections/${encodeURIComponent(connectionId)}/${action}`, method: 'post' }),
).then((data) => {
  notifyConnectionsChanged();
  return data;
});

export const acceptConnection = (connectionId) => changeStatus(connectionId, 'accept');
export const declineConnection = (connectionId) => changeStatus(connectionId, 'decline');
export const cancelConnection = (connectionId) => changeStatus(connectionId, 'cancel');
