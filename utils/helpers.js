module.exports = {
  // ensures the date is displayed how we want
  format_date: date => {
    return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(date).getFullYear()}`;
  },
  // ensures the time is displayed how we want
  format_time: date => {
    let hours = new Date(date).getHours();
    let amPm = 'am';
    if (hours > 12) {
      hours -= 12;
      amPm = 'pm';
    }
    return `${hours}:${('' + new Date(date).getMinutes()).padStart(2, 0)}${amPm}`;
  },
  // fixes issues with singular/plural
  format_plural: (word, amount) => {
    if (amount === 0 || amount > 1) {
      return `${word}s`;
    }
    return word;
  }
}