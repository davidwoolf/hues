import getColors from "../../../components/sanitize"

// const sanitizeColors = (colors) =>
// 	colors.split(",").map((c) => (c.includes("#") ? c.trim() : `#${c.trim()}`))

// returns a linear gradient between two colors
export default (req, res) => {
	// const { colors, space = "hex" } = req.query

	const body = JSON.parse(req.body)
	const space = "space" in body ? body.space : "hex"
	const colors = body.colors.map((color) => getColors(color, space))

	// const sanitized_colors = colors.split('sanitizeColors(req.query.colors)

	res.status(200).json({
		type: "linear",
		colors: colors,
	})
}
