export const PI = Math.PI;

/**
 * Convert longitude and latitude
 * @param {[Number[]]} data
 * Data structure to convert:
 * Input: data = [[x1, y1], [x2, y2], [x3, y3],...]
 * Output: data = [[y1, x1], [y2, x2], [x3, y3],...]
 */
export const convertLongitudeAndLatitude = (data) => {
  data.forEach((item, index) => {
    if (item.length != 2) {
      console.error("Wrong input value item: " + { item });
      return;
    }
    data[index].reverse();
  });
  return data;
};

/**
 * Add amount of height to the object
 * @param {[Number[]]} data
 * @param {Number} height
 * Data structure to convert:
 * Input: data = [[x1, y1], [x2, y2], [x3, y3],...]
 * Output: data = [[x1, y1, z1], [x2, y2, z2], [x3, y3, z3],...]
 * @returns Return a new data with height
 */
export const addHeightToObject = (data, height) => {
  data.forEach((item, index) => {
    if (item.length != 2) {
      console.error("Wrong input value item: " + { item });
      return;
    }
    data[index].push(height);
  });
  return data;
};

/**
 * Remove height of the object
 * @param {[Number[]]} data
 * Data structure to convert:
 * Input: data = [[x1, y1, z1], [x2, y2, z2], [x3, y3, z3],...]
 * Output: data = [[x1, y1], [x2, y2], [x3, y3],...]
 * @returns Return a new data with no height
 */
export const removeHeightOfObject = (data) => {
  data.forEach((item, index) => {
    if (item.length != 3) {
      console.error("Wrong input value item: " + { item });
      return;
    }
    data[index].pop();
  });
  return data;
};

/**
 * Convert degree to radians
 * @param {Number} degrees
 * @returns Return radians value
 */
export const convertDegreeToRadians = (degrees) => {
  return degrees * (PI / 180);
};

/**
 * Convert radians to degrees
 * @param {Number} radians
 * @returns Return radians value
 */
export const convertRadiansToDegree = (radians) => {
  return radians * (180 / PI);
};

/**
 * Get a destination point
 * @param {Longitude} lng
 * @param {latitude} lat
 * @param {Distance} meters
 * @param {Angle} angle
 * @returns A destination point
 */
export const getDestinationPoint = (lng, lat, meters, angle) => {
  let dist = meters / 1000; // dist in km
  let rad = 6371; // earths mean radius
  dist = dist / rad; // convert dist to angular distance in radians
  angle = convertDegreeToRadians(angle); // convert to radians
  let lat1 = convertDegreeToRadians(lat);
  let lon1 = convertDegreeToRadians(lng);

  let lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(dist) +
      Math.cos(lat1) * Math.sin(dist) * Math.cos(angle)
  );
  let lon2 =
    lon1 +
    Math.atan2(
      Math.sin(angle) * Math.sin(dist) * Math.cos(lat1),
      Math.cos(dist) - Math.sin(lat1) * Math.sin(lat2)
    );
  lon2 = ((lon2 + 3 * PI) % (2 * PI)) - PI; // normalize to -180..+180º
  lat2 = convertRadiansToDegree(lat2);
  lon2 = convertRadiansToDegree(lon2);

  return { lon2, lat2 };
};

/**
 * Get destination of object
 * @param {[Number[]]} data
 * @param {Number} meters
 * @param {Number} angle
 * @returns {[Number[]]} Return a new destination object
 * Structure data:
 * Input: data = [[x1, y1, z1], [x2, y2, z2], [x3, y3, z3],...]
 * Output: data = [[x1, y1, z1], [x2, y2, z2], [x3, y3, z3],...]
 */
export const getDestinationObject = (data, meters, angle) => {
  data.forEach((item, index) => {
    if (item.length < 2) {
      console.error("Wrong input value item: " + { item });
      return;
    }
    const { lat2, lon2 } = getDestinationPoint(item[0], item[1], meters, angle);
    data[index][0] = lon2;
    data[index][1] = lat2;
  });
  return data;
};

export const getDistanceOfTwoPoints = (point1, point2) => {
  const rad = 6371;
  let distance = Math.sqrt(
    Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
  );
  distance *= rad;
  return distance * 1000;
};

export const getMiddlePoint = (point1, point2) => {
  const middleX = (point1.x + point2.x) / 2;
  const middleY = (point1.y + point2.y) / 2;
  const middlePoint = { x: middleX, y: middleY };
  return middlePoint;
};

const objectRotation = (data, angle) => {
  data.forEach((item, index) => {
    let maxDistance = 0;
    data.forEach((item2, index2) => {
      let distance = getDistanceOfTwoPoints(item, item2);
      if (distance > maxDistance) {
        maxDistance = distance;
      }
    });
  });
};

const baseStairCoordinates = {
  type: "FeatureCollection",
  generator: "Stairs",
  copyright: "Stairs",
  timestamp: "2021-05-27T09:28:58Z",
  features: [
    {
      type: "Feature",
      properties: {
        "Building name": "Stairs",
        height: 3,
        idb: "7",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [106.80248626372577, 10.869739999999693, 27],
            [106.80248626372618, 10.869731006783633, 27],
            [106.80248214284401, 10.869731006783606, 27],
            [106.80248214284362, 10.869739999999664, 27],
          ],
        ],
      },
      id: "sta01",
    },
  ],
};

const myRenderStairFunction = (data, angle, repeatTimes, height) => {
  const cloneData = { ...data };
  for (let i = 0; i < repeatTimes; i++) {
    const baseCoordinates =
      cloneData.features[cloneData.features.length - 1].geometry.coordinates;
    const rotationCoordinates = [[]];
    baseCoordinates[0][2][2] = 27 + height * i;
    baseCoordinates[0][3][2] = 27 + height * i;
    rotationCoordinates[0].push(baseCoordinates[0][2]);
    rotationCoordinates[0].push(baseCoordinates[0][3]);
    const { lon2, lat2 } = getDestinationPoint(
      rotationCoordinates[0][1][0],
      rotationCoordinates[0][1][1],
      Math.tan(convertDegreeToRadians(angle)),
      270 - i * angle
    );
    rotationCoordinates[0].push([lon2, lat2, 27 + height * i]);
    const rotationFeature = {
      type: "Feature",
      properties: {
        "Building name": "Stairs",
        height: 3,
        idb: `${i + 1}`,
      },
      geometry: {
        type: "Polygon",
        coordinates: rotationCoordinates,
      },
      id: `sta${i + 1}`,
    };
    cloneData.features.push(rotationFeature);
    const newCoordinates = [[]];
    newCoordinates[0].push([
      rotationCoordinates[0][2][0],
      rotationCoordinates[0][2][1],
      27 + height * (i + 1),
    ]);
    newCoordinates[0].push([
      rotationCoordinates[0][0][0],
      rotationCoordinates[0][0][1],
      27 + height * (i + 1),
    ]);
    const thirdElement = getDestinationPoint(
      rotationCoordinates[0][0][0],
      rotationCoordinates[0][0][1],
      0.45,
      270 - i * angle
    );
    const fourthElement = getDestinationPoint(
      rotationCoordinates[0][2][0],
      rotationCoordinates[0][2][1],
      0.45,
      270 - i * angle
    );
    newCoordinates[0].push([
      thirdElement.lon2,
      thirdElement.lat2,
      27 + height * (i + 1),
    ]);
    newCoordinates[0].push([
      fourthElement.lon2,
      fourthElement.lat2,
      27 + height * (i + 1),
    ]);
    const newFeature = {
      type: "Feature",
      properties: {
        "Building name": "Stairs",
        height: 3,
        idb: `${i + 1}`,
      },
      geometry: {
        type: "Polygon",
        coordinates: newCoordinates,
      },
      id: `sta${i + 1}`,
    };
    cloneData.features.push(newFeature);
  }
};
