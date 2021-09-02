const convert = require("color-convert")

const validHexColor = (hex) => {
	const sanitized_color = hex.replace("#", "")

	if (
		sanitized_color.includes(",") ||
		sanitized_color.length % 3 !== 0 ||
		sanitized_color.length > 6
	) {
		return false
	}

	return true
}

const checkNumberRange = (min, max, value) => {
	return !isNaN(value) && Number(value) >= min && Number(value) <= max
}

const validRGBColor = (rgb) => {
	const sanitized_color = rgb.replace("rgb(", "").replace(")", "").split(",")

	const invalid_space = sanitized_color.filter(
		(value) => !checkNumberRange(0, 255, value)
	)

	if (invalid_space.length || sanitized_color.length > 3) {
		return false
	}

	return true
}

const validRGBAColor = (rgba) => {
	const colors = rgba.replace("rgba(", "").replace(")", "").split(",")
	const sanitized_rgb = colors.slice(0, -1)

	const invalid_space = sanitized_rgb.filter(
		(value) => !checkNumberRange(0, 255, value)
	)
	const valid_alpha = checkNumberRange(0, 1, colors[3])

	if (invalid_space.length || colors.length > 4 || !valid_alpha) {
		return false
	}

	return true
}

const validHSLColor = (hsl) => {
	const color = hsl
		.replace("hsl(", "")
		.replace(")", "")
		.replace("%", "")
		.split(",")

	if (
		!checkNumberRange(0, 360, color[0]) ||
		!checkNumberRange(0, 100, color[1]) ||
		!checkNumberRange(0, 100, color[2])
	) {
		return false
	}

	return true
}

const getColors = (color, space = "hex") => {
	let hex = "#000000"
	let hsl = [0, 0, 0]
	let rgb = [0, 0, 0]
	let rgba = [0, 0, 0, 1]

	if (space === "hex") {
		if (!validHexColor(color)) {
			return res.status(400).json({
				status: 400,
				message:
					"Please pass a valid hex color with 3 or 6 characters or change your color space",
			})
		}

		hex = color.includes("#") ? color : `#${color}`
		hsl = convert.hex.hsl(hex)
		rgb = convert.hex.rgb(hex)
		rgba = rgb.concat([1])
	} else if (space === "rgb") {
		if (!validRGBColor(color)) {
			return res.status(400).json({
				status: 400,
				message: "Please pass a valid rgb string",
			})
		}

		rgb = color.split(",")
		hex = `#${convert.rgb.hex(rgb)}`
		hsl = convert.rgb.hsl(rgb)
		rgba = rgb.concat([1])
	} else if (space === "rgba") {
		let alpha = color.split(",")[3]
		let root_color = color.split(",").slice(0, -1)

		if (!validRGBAColor(color)) {
			return res.status(400).json({
				status: 400,
				message: "Please pass a valid rgba string",
			})
		}

		rgb = root_color
		hex = convert.rgb.hex(root_color)
		hsl = convert.rgb.hsl(root_color)
		rgba = rgb.concat([alpha])
	} else {
		if (!validHSLColor(color)) {
			return res.status(400).json({
				status: 400,
				message: "Please pass a valid hsl string",
			})
		}

		hsl = color.split(",")
		hex = convert.hsl.hex(hsl)
		rgb = convert.hsl.rgb(hsl)
		rgba = rgb.concat([1])
	}

	return {
		hsl,
		hex,
		rgb,
		rgba,
	}
}

export default getColors
