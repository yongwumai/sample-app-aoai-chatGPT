import Cookies from 'universal-cookie';
import { v4 as uuidv4 } from "uuid";

export const getUid = () => {

    const cookies = new Cookies();
    var uuid = cookies.get('uuid');
    if (uuid == null) {
        uuid = uuidv4();
        cookies.set('uuid', uuid, { path: '/' });
    }
    return uuid;
}