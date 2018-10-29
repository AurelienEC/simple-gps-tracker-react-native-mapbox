import React, { Component } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import API_TOKEN from './Helpers/token.js'
Mapbox.setAccessToken(API_TOKEN);


export default class App extends Component<{}> {

  constructor() {
    super();
    this.state = {
        track : false,
        btnTitle : "Start Tracking",
        longitude: null,
        error: null,
        //route
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

                  ]
                }
              }
            ]
          }
      }
  }
  setRoute(){
    return (
      <Mapbox.ShapeSource id='line1' shape={this.state.route}>
        <Mapbox.LineLayer id='linelayer1' style={{lineColor:'red'}} />
      </Mapbox.ShapeSource>
    )
  }

  componentDidMount() {
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        console.log(this.state)
        if(this.state.track)
        {
            let road = this.state.route;
            console.log(road);
            road.features[0].geometry.coordinates.push([position.coords.longitude, position.coords.latitude]);
            this.setState({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              error: null,
              route: road,
              btnTitle : "Stop Tracking"
            });
        }else{
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
            btnTitle : "Start Tracking"
          });
        }

      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
    );
  }
  componentWillUpdate() {
    console.log("UPDATE");
  }
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }
  startTracking(){
    let tracker  =  false
    let btnTitle =   "";
    if(!this.state.track)
    {
      tracker = true;
      title = "Stop Tracking"
    }else{
      tracker = false
      title = "Start Tracking"
    }
    this.setState({
      track : tracker,
      btnTitle : title
    })
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
      "name" : "Eiffel Tower",
      "lat" : 48.858053,
      "lng" : 2.294289
    }
    let place2 = {
      "name" : "Mitad del Mundo",
      "lat" : -78.453498186,
      "lng" : -0.001166662
    }
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
            {this.state.route.features[0].geometry.coordinates.length > 1 ? this.setRoute() : null}
        </Mapbox.MapView>
        <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Latitude: {this.state.latitude}</Text>
        <Text>Longitude: {this.state.longitude}</Text>
        <Button
        onPress={this.startTracking.bind(this)}
        title={this.state.btnTitle}
        />
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
