import { formatDistanceToNow, parseISO } from 'date-fns';

export function timeAgo(time) {
   return formatDistanceToNow(parseISO(time), { addSuffix: true }).replace('about ', '')
}