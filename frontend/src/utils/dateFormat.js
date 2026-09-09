import moment from 'moment'
export const dateFormat = (date) =>{
    return moment(date).format('DD/MM/YYYY')
}
export const chartDate = (date) => {
    return moment(date).format("MMM YY");
  };