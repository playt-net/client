import slugify from "slugify";
slugify.extend({
	"/": "-",
	".": "-",
	":": "-",
});

export const normalizeEnvironmentName = (url: URL) => {
	return slugify(url.origin + url.pathname, {
		lower: true,
		strict: true,
		replacement: "-",
	});
};
