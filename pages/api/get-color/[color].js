import getColors from "../../../components/sanitize"

// Return all variations of a color
export default (req, res) => {
	const { color, space = "hex" } = req.query

	const { hex, hsl, rgb, rgba } = getColors(color, space)

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
			css: `rgba(${rgba.join(",")})`,
			raw: rgba,
		},
	})
}
