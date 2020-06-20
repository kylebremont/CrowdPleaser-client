// Get the hash of the url
// const hash = window.location.hash.substring(1).split('&').reduce(function(initial, item) {
// 	if (item) {
// 		var parts = item.split('=');
// 		initial[parts[0]] = decodeURIComponent(parts[1]);
// 	}
// 	return initial;
// }, {});
// window.location.hash = '';
//
// export default hash;

export default function getHashParams() {
	var hashParams = {};
	var e,
		r = /([^&;=]+)=?([^&;]*)/g,
		q = window.location.hash.substring(1);
	while ((e = r.exec(q))) {
		hashParams[e[1]] = decodeURIComponent(e[2]);
	}
	return hashParams;
}
