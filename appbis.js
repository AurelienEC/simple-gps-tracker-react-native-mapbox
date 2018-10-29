import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Mapbox from '@mapbox/react-native-mapbox-gl';

Mapbox.setAccessToken('sk.eyJ1IjoiYXVyZWxpZW5hbnRvbmlvIiwiYSI6ImNqbmloYTlyMTBiMDgza2xrNHk2N2I0enYifQ.UYfJHL4I6wbsRv96mrpzOg');


export default class App extends Component<{}> {

  constructor() {
    super();
    this.state = {
      route:
        {
          "type": "FeatureCollection",
          "features": [
            {
              "type": "Feature",
              "properties": {},
              "geometry": {
                "type": "LineString",
                "coordinates": [
                  [
                    -79.90219, -2.1293
                  ],
                  [
                    -79.947552,
                    -2.159997
                  ]
                ]
              }
            }
          ]
        },
        latitude: null,
        longitude: null,
        error: null,
    }
  }

  componentDidMount() {
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  renderAnnotations (place) {
    return (
      <Mapbox.PointAnnotation
        key={place.name}
        id={place.name}
        coordinate={[place.lng, place.lat]}>

        <View style={styles.annotationContainer}>
          <View style={styles.annotationFill} />
        </View>
        <Mapbox.Callout title={place.name} />
      </Mapbox.PointAnnotation>
    )
  }

  render() {
    let place1 = {
      "name" : "Oficina Ceibos JW2019",
      "lat" : -2.159997,
      "lng" : -79.947552
    }
    let place2 = {
      "name" : "Oficina Urdenor 2 JW2019",
      "lat" : -2.1501751,
      "lng" : -79.9076713
    }
    let route = this.state.route

    return (
      <View style={styles.container}>
        <Mapbox.MapView
            styleURL={Mapbox.StyleURL.Dark}
            zoomLevel={15}
            centerCoordinate={[-79.90219, -2.1293]}
            style={styles.map}
            showUserLocation={true}>
            {this.renderAnnotations(place1)}
            {this.renderAnnotations(place2)}
            <Mapbox.ShapeSource id='line1' shape={this.state.route}>
              <Mapbox.LineLayer id='linelayer1' style={{lineColor:'red'}} />
            </Mapbox.ShapeSource>
        </Mapbox.MapView>
        <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Latitude: {this.state.latitude}</Text>
        <Text>Longitude: {this.state.longitude}</Text>
        {this.state.error ? <Text>Error: {this.state.error}</Text> : null}
      </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 11,
  },
  annotationContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
  },
  annotationFill: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'orange',
    transform: [{ scale: 0.6 }],
  },
});
