import { Component, ReactNode, createContext, useContext } from "react"
import { LatLng, LeafletMouseEvent, Map } from "leaflet"

export type MapContextType = {
	map: Map | null
	setMap: (map: Map | null) => void
	getRulerPoints: () => Array<LatLng>
	setRulerPoints: (points: Array<LatLng>) => void
	getMapClickPosition: () => { latitude: number; longitude: number } | null
}

const MapContext = createContext<MapContextType>({
	map: null,
	setMap: () => {},
	setRulerPoints: () => {},
	getRulerPoints: () => [],
	getMapClickPosition: () => null,
})

type MapProviderProps = {
	children: ReactNode
}

interface MapProviderState {
	map: Map | null
	rulerPoints: Array<LatLng>
	position: { latitude: number; longitude: number } | null
}

class MapProvider extends Component<MapProviderProps, MapProviderState> {
	state = { map: null, position: null, rulerPoints: [] }

	public setMap = (map: Map | null) => {
		this.setState({ map })

		if (map) {
			map.on("click", (event) => this.setMapClickPosition(event))
		}
	}

	public getMapClickPosition = () => this.state.position
	public getRulerPoints = () => this.state.rulerPoints

	private setRulerPoints = (points: Array<LatLng>) => this.setState({ rulerPoints: points })

	private setMapClickPosition = (event: LeafletMouseEvent) =>
		this.setState({ position: { latitude: event.latlng.lat, longitude: event.latlng.lng } })

	render() {
		const { children } = this.props

		return (
			<MapContext.Provider
				value={{
					map: this.state.map,
					setMap: this.setMap,
					getMapClickPosition: this.getMapClickPosition,
					setRulerPoints: this.setRulerPoints,
					getRulerPoints: this.getRulerPoints,
				}}
			>
				{children}
			</MapContext.Provider>
		)
	}
}

const useMapOutside = (): Omit<MapContextType, "setMap" | "setRulerPoints"> => useContext(MapContext)

export { MapProvider, MapContext, useMapOutside }
