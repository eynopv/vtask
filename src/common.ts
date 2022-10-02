export function getTimestamp() {
  return Math.floor(getTimestampMS() / 1000);
}

function getTimestampMS() {
  return (new Date()).getTime();
}
