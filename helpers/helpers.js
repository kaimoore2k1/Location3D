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
            console.error("Wrong input value item: " + {item});
            return;
        }
        data[index].reverse();
    });
    return data;
}

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
            console.error("Wrong input value item: " + {item});
            return;
        }
        data[index].push(height);
    });
    return data;
}

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
            console.error("Wrong input value item: " + {item});
            return;
        }
        data[index].pop();
    });
    return data;
}

/**
 * Convert degree to radians
 * @param {Number} degrees 
 * @returns Return radians value
 */
export const convertDegreeToRadians = (degrees) => {
    return degrees * (PI/180);
}

/**
 * Convert radians to degrees
 * @param {Number} radians 
 * @returns Return radians value
 */
export const convertRadiansToDegree = (radians) => {
    return radians * (180/PI);
}

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
    
    let lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) + Math.cos(lat1) * Math.sin(dist) * Math.cos(angle));
    let lon2 = lon1 + Math.atan2(Math.sin(angle) * Math.sin(dist) * Math.cos(lat1), Math.cos(dist) - Math.sin(lat1) * Math.sin(lat2));
    lon2 = ((lon2 + 3 * PI) % (2 * PI)) - PI; // normalize to -180..+180º
    lat2 = convertRadiansToDegree(lat2);
    lon2 = convertRadiansToDegree(lon2);
    
    return {lon2, lat2}
}

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
            console.error("Wrong input value item: " + {item});
            return;
        }
        const {lat2, lon2} = getDestinationPoint(item[0], item[1], meters, angle);
        data[index][0] = lon2;
        data[index][1] = lat2;
    });
    return data
}

export const getDistanceOfTwoPoints = (point1, point2) => {
    const rad = 6371;
    let distance = Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
    distance *= rad;
    return distance * 1000;

}

export const getMiddlePoint = (point1, point2) => {
    const middleX = (point1.x + point2.x) / 2;
    const middleY = (point1.y + point2.y) / 2;
    const middlePoint = {x: middleX, y: middleY};
    return middlePoint;

}

const objectRotation = (data, angle) => {
    data.forEach((item, index) => {
        let maxDistance = 0;
        data.forEach((item2, index2) => {
            let distance = getDistanceOfTwoPoints(item, item2);
            if ( distance > maxDistance) {
                maxDistance = distance;
            }
        })
    });
}

const myFunction = (data) => {
    const theFirstElement = data[3];
    const theSecondElement = data[2];
    const theThird = getDestinationPoint(theSecondElement[0], theSecondElement[1], 14.4729635533, 250);
    const theThirdElement = [];
    theThirdElement.push(theThird.lon2);
    theThirdElement.push(theThird.lat2);
    const theFourth = getDestinationPoint(theFirstElement[0], theFirstElement[1], 9, 320);
    const theFourthElement = [];
    theFourthElement.push(theFourth.lon2);
    theFourthElement.push(theFourth.lat2);
    const newData = [];
    newData.push(theFirstElement);
    newData.push(theSecondElement);
    newData.push(theThirdElement);
    newData.push(theFourthElement);
    return newData;
}