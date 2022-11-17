const moment = require('moment-jalaali')
moment.loadPersian({usePersianDigits: true})
exports.date =(date)=>{
    return moment(date);
}