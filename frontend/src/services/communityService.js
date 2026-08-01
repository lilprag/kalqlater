import axios from 'axios';
import { API_URL } from './apiConfig';
import { request } from './authService';
const unwrap=p=>p.then(r=>r.data);
export const getDirectory=(filters={},page=1,limit=18)=>unwrap(request({url:'/community/profiles',params:{...filters,page,limit}}));
// This intentionally omits the session header: Result-page tribe previews may
// only surface profiles that are public to every visitor.
export const getPublicDirectory=(filters={},page=1,limit=18)=>axios.get(`${API_URL}/community/profiles`,{params:{...filters,page,limit}}).then((response)=>response.data);
export const getPublicProfile=username=>unwrap(request({url:`/community/profiles/${username}`}));
export const getMyProfile=()=>unwrap(request({url:'/community/me'}));
export const checkUsername=username=>unwrap(request({url:`/community/username/${username}`}));
export const createProfile=payload=>unwrap(request({url:'/community/profile',method:'post',data:payload}));
export const updateProfile=payload=>unwrap(request({url:'/community/profile',method:'put',data:payload}));
export const deactivateProfile=()=>unwrap(request({url:'/community/profile/deactivate',method:'post'}));
export const deleteProfile=()=>unwrap(request({url:'/community/profile',method:'delete'}));
export const getMatch=()=>({label:'Connection context',reason:'Personality insights are interpretive context, not a compatibility score.'});
export const saveLatestPersonalityType=type=>localStorage.setItem('kalqlater_latest_personality_type_v1',type);
