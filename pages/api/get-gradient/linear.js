const convert = require("color-convert")
import getColors from "../../../components/sanitize"

const getDifference = (first, second) => {
	if (first > second) {
		return first - second
	} else {
		return second - first
	}
}

// returns a linear gradient between two colors
export default (req, res) => {
	const body = req.body
	const space = "space" in body ? body.space : "hex"
	const tone = "tone" in body ? body.tone : "warm"
	const colors = body.colors.map((color) => getColors(color, space))

	let gradient = `linearGradient(${colors.map((c) => c.hex).join(",")})`

	if (colors.length == 2) {
		const first_hue = colors[0].hsl[0]
		const second_hue = colors[1].hsl[0]
		const difference = getDifference(first_hue, second_hue)

		if (difference >= 160 && difference <= 200) {
			let middle_hue = 0

			if (tone == "warm") {
				// stay in >270 && <90
				if (first_hue - difference / 2 <= 0) {
					middle_hue = 360 + (first_hue - difference / 2)
				} else {
					middle_hue = first_hue - difference / 2
				}
			}

			if (tone == "cool") {
				// stay in <270 && >90
				if (first_hue + difference / 2 >= 360) {
					middle_hue = first_hue - difference / 2
				} else {
					middle_hue = first_hue + difference / 2
				}
			}

			const middle_color = [
				middle_hue,
				colors[0].hsl[1] * 0.25,
				colors[0].hsl[2],
			]

			gradient = `linearGradient(${colors[0].hex}, #${convert.hsl.hex(
				middle_color
			)}, ${colors[1].hex})`
		}
	}

	res.status(200).json({
		type: "linear",
		gradient,
		colorStops: colors,
	})
}
