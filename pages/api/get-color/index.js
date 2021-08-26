const convert = require("color-convert")

const getRandomNumber = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

// returns a random color
export default (req, res) => {
	const hsl = [
		getRandomNumber(0, 360),
		getRandomNumber(0, 100),
		getRandomNumber(0, 100),
	]

	const hex = convert.hsl.hex(hsl)
	const rgb = convert.hsl.rgb(hsl)

	// const hsv = convert.hsl.hsv(hsl)
	// const hwb = convert.hsl.hwb(hsl)
	// const cmyk = convert.hsl.cmyk(hsl)

	res.status(200).json({
		hsl: {
			css: `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`,
			raw: hsl,
		},
		hex: {
			css: `#${hex}`,
			raw: hex,
		},
		rgb: {
			css: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
			raw: rgb,
		},
		rgba: {
			css: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`,
			raw: rgb.concat([1]),
		},
	})
}
