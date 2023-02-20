import dayjs from 'dayjs'

export function formatDateViaTimeDiff(timestamp: string) {
  const inputTime = dayjs(timestamp)
  const ifToday = dayjs().isSame(inputTime, 'day')
  if (ifToday) {
    return inputTime.format('HH:mm')
  } else {
    return inputTime.format('YYYY-M-D')
  }
}
