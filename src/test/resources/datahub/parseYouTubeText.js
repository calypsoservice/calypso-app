
let elementNodeListOf = document.querySelectorAll(".segment-text.style-scope.ytd-transcript-segment-renderer");
let result = "";
for (let i = 0; i < elementNodeListOf.length; i++) {
   result += elementNodeListOf[i].textContent.concat("\n");
}
console.log(result)

