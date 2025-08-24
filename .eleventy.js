const { DateTime } = require("luxon");
const { eleventyImageTransformPlugin } = require("@11ty/eleventy-img");
const isProduction = process.env.ELEVENTY_ENV === "production";
const htmlnano = require("htmlnano");
const htmlSave = require("htmlnano").presets.safe;

module.exports = function (eleventyConfig) {
	// Add the Eleventy Image plugin with fast build settings
	eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
		// Reduced formats for faster builds - skip AVIF in development
		formats: isProduction ? ["webp", "jpeg"] : ["jpeg"],
		// Fewer widths for faster processing
		widths: isProduction ? [400, 800, 1200] : [800],
		urlPath: "/static/images/",
		outputDir: "./dist/static/images/",
		generateAlt: true,
		// Extended cache for better performance
		cacheOptions: {
			duration: "7d",
		},
		// Optimize for speed over maximum compression
		defaultAttributes: {
			loading: "lazy",
			decoding: "async",
			sizes: "(max-width: 768px) 100vw, 50vw"
		},
		// Faster compression settings
		sharpWebpOptions: {
			quality: 80,
			effort: 2  // Much faster than 6
		},
		sharpJpegOptions: {
			quality: 80,
			progressive: false,  // Faster than progressive
			mozjpeg: false       // Faster than mozjpeg
		}
	});

	// Folders to copy to build dir
	eleventyConfig.addPassthroughCopy("src/static");

	// Filter to parse dates
	eleventyConfig.addFilter("htmlDateString", function (dateObj) {
		return DateTime.fromJSDate(dateObj, {
			zone: "utc",
		}).toFormat("yyyy-LL-dd");
	});

	// Example Collections
	// Filter source file names using a glob
	// eleventyConfig.addCollection("posts", function (collectionApi) {
	// 	return collectionApi.getFilteredByGlob("./src/_posts/**/*.md");
	// });

	// Compress/Minify HTML output on production builds only
	if (isProduction) {
		eleventyConfig.addTransform("compressHTMLOutput", (content, outputPath) => {
			const options = {
				removeEmptyAttributes: false, // Disable the module "removeEmptyAttributes"
				collapseWhitespace: "conservative", // Pass options to the module "collapseWhitespace"
			};
			// posthtml, posthtml-render, and posthtml-parse options
			const postHtmlOptions = {
				lowerCaseTags: true, // https://github.com/posthtml/posthtml-parser#options
				quoteAllAttributes: false, // https://github.com/posthtml/posthtml-render#options
			};

			if (outputPath.endsWith(".html")) {
				return htmlnano
					.process(content, options, htmlSave, postHtmlOptions)
					.then(function (result) {
						return result.html;
					})
					.catch(function (err) {
						console.error(err);
						return content;
					});
			}

			return content;
		});
	}

	// This allows Eleventy to watch for file changes during local development.
	eleventyConfig.setUseGitIgnore(false);
	return {
		dir: {
			input: "src/",
			output: "dist",
			includes: "_includes",
			layouts: "_layouts",
		},
		templateFormats: ["html", "md", "njk"],
		htmlTemplateEngine: "njk",
		passthroughFileCopy: true,
	};
};
