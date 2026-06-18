# Cesium For Unity

## Convert WGS84 to Earth Centered Earth Fixed

```csharp
  var longitude = 121d;
  var latitude = 37d;
  var height = 0d;
  double3 d3 = GameObject.Find("CesiumGeoreference").GetComponent<CesiumGeoreference>().TransformEarthCenteredEarthFixedPositionToUnity(CesiumWgs84Ellipsoid.LongitudeLatitudeHeightToEarthCenteredEarthFixed(new double3(longitude, latitude, height)));
  Vector3 position = new Vector3((float)d3.x, (float)d3.y, (float)d3.z);
```
