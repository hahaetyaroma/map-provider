import { Component, ReactNode, createContext, useContext } from "react"
import { LeafletMouseEvent, Map } from "leaflet"

export type MapType = {
	map: Map | null
	setMap: (map: Map | null) => void
	getMapClickPosition: () => { latitude: number; longitude: number } | null
}

const MapContext = createContext<MapType>({
	map: null,
	setMap: () => {},
	getMapClickPosition: () => null,
})

type MapProviderProps = {
	children: ReactNode
}

interface MapProviderState {
	map: Map | null
	position: { latitude: number; longitude: number } | null
}

class MapProvider extends Component<MapProviderProps, MapProviderState> {
	state = { map: null, position: null }

	public setMap = (map: Map | null) => {
		this.setState({ map })

		if (map) {
			map.on("click", (event) => this.setMapClickPosition(event))
		}
	}

	public getMapClickPosition = () => this.state.position

	private setMapClickPosition = (event: LeafletMouseEvent) =>
		this.setState({ position: { latitude: event.latlng.lat, longitude: event.latlng.lng } })

	render() {
		const { children } = this.props

		return (
			<MapContext.Provider
				value={{ map: this.state.map, setMap: this.setMap, getMapClickPosition: this.getMapClickPosition }}
			>
				{children}
			</MapContext.Provider>
		)
	}
}

const useMapContext = () => useContext(MapContext)

export { MapProvider, MapContext, useMapContext }
