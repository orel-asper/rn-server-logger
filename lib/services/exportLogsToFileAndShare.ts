
//@ts-nocheck
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import moment from 'moment';

const exportLogsToFileAndShare = async (logs) => {
    let txtFile = '';
    logs.sort((a, b) => b.timestamp - a.timestamp).forEach((point) => {
        const { type, timestamp, url, requestData, responseData, status } = point;
        txtFile += `
    TYPE: ${type}\n
    TIME: ${moment(timestamp).format('DD-MM-YY HH:mm:ss.SSS')}\n
    URL: ${url}\n
    REQUEST DATA: ${requestData}\n
    RESPONSE DATA: ${responseData}\n
    STATUS: ${status}\n
    ---------------------------------
    \n
    `;
    });

    const filename = 'logs.txt';
    const filepath = `${(RNFS.CachesDirectoryPath)}/${filename}`;
    await RNFS.writeFile(filepath, txtFile, 'utf8');
    await Share.open({ url: `file://${filepath}` });
};

export default exportLogsToFileAndShare;


