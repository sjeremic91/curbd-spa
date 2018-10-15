export function smartSearch(haystack, needle) {
  haystack = haystack.toLowerCase()
  needle = needle.toLowerCase()

  let j = 0;
  for (let i = 0; i < haystack.length; i++) {
    if (haystack[i] == needle[j] && j < needle.length) {
      j++;
    }
    if (j == needle.length)
      return true;
  }

  return j == needle.length;

}
