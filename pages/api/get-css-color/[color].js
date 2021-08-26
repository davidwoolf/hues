// Return either the color space or descriptive name depending on what is passed in
const convert = require("color-convert")

import cssColors from "../../../css-colors"

export default (req, res) => {
	const { color, type } = req.query

	if (type && type.toLowerCase() === "hex") {
		const sanitized_color =
			color.length === 3
				? `${color[0]}${color[0]}${color[1]}${color[1]}${color[2]}${color[2]}`
				: color

		if (sanitized_color.length < 6) {
			return res.status(400).json({
				status: 400,
				message: "Please pass a hex color with 3 or 6 characters",
			})
		}

		const name = Object.keys(cssColors).find(
			(key) => cssColors[key] === `#${sanitized_color}`
		)

		if (name === undefined) {
			// return error
			return res.status(404).json({
				status: 404,
				message: "No css color matches that hex value",
			})
		}

		res.status(200).json({
			name: name,
		})
	} else {
		if (!cssColors[color]) {
			return res.status(404).json({
				status: 404,
				message: "No hex color matches that css color name",
			})
		}

		const hex = cssColors[color]
		const hsl = convert.hex.hsv(hex)
		const rgb = convert.hex.rgb(hex)

		res.status(200).json({
			hsl: {
				css: `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`,
				raw: hsl,
			},
			hex: {
				css: `${hex}`,
				raw: hex.replace("#", ""),
			},
			rgb: {
				css: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
				raw: rgb,
			},
			rgba: {
				css: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`,
				raw: rgb.concat([1]),
			},
		})
	}
}
