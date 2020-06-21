//Number of mountains
//const mountainNum = 0;
//Random map size of 30 to 50
//const mapSize = Math.floor(Math.random() * 20) + 10;
//const mapSize = 10;
//vision distance
const visionDistance = 1;
//For keeping track of which player has vision on which tile
var visionContainer = [];
//Keeping track of which tile is owned by players
var unitContainer = [];
//Keeping track of which city states are owned by players
var cityContainer = [];
//Temporary map
var tmpMap = [];

function gameSettings(readyNum, gameParameters){
    const mapSize = gameParameters.mapSize;
    const mountainNum = mapSize * mapSize * gameParameters.mountain / 100;
    const cityNum = gameParameters.city;
    const visionDistance = 1;
    //For keeping track of which player has vision on which tile
    var visionContainer = [];
    //Keeping track of which tile is owned by players
    var unitContainer = [];
    //Keeping track of which city states are owned by players
    var cityContainer = [];
    //Temporary map
    var tmpMap = [];
    //Creates an array of mapSize x mapSize
    var map = [];
    for (var i = 0; i < mapSize; i++){
        var tmpArray = [];
        var tmpArray2 = [];
        for (var j = 0; j < mapSize; j++){
            tmpArray.push( {'terrain' : 3, 'owner' : -1, 'troop' : 0, 'vision' : []} );
            tmpArray2.push( {'terrain' : 3, 'owner' : -1, 'troop' : 0, 'vision' : []} );
        }
        map.push(tmpArray);
        tmpMap.push(tmpArray2);
    }
    //setting locations of mountains
    for (var i = 0; i < mountainNum; i++){
        var mountain_x = Math.floor(Math.random() * mapSize);
        var mountain_y = Math.floor(Math.random() * mapSize);
        while (map[mountain_x][mountain_y].terrain == 1){
            mountain_x = Math.floor(Math.random() * mapSize);
            mountain_y = Math.floor(Math.random() * mapSize);
        }
        map[mountain_x][mountain_y] = {'terrain' : 1, 'owner' : -1, 'troop' : 0, 'vision' : []};
        tmpMap[mountain_x][mountain_y] = {'terrain' : 1, 'owner' : -1, 'troop' : 0, 'vision' : []};
    }
    //setting the locations of players
    for (var i = 0; i < readyNum; i++){
        visionContainer.push([]);
        //Random position of player in an object
        var player_x = Math.floor(Math.random() * mapSize);
        var player_y = Math.floor(Math.random() * mapSize);
        while (map[player_x][player_y].terrain == 1 || map[player_x][player_y].terrain == 4){
            player_x = Math.floor(Math.random() * mapSize);
            player_y = Math.floor(Math.random() * mapSize);
        }
        for (var x = -visionDistance; x < visionDistance + 1; x++){
            for (var y = -visionDistance; y < visionDistance + 1; y++){
                if (x == 0 && y == 0){
                    map[player_x][player_y] = {'terrain' : 4, 'owner' : i, 'troop' : 1, 'vision' : [i]};
                    unitContainer.push({'x' : player_x, 'y' : player_y});
                    visionContainer[i].push({ 'x' : player_x, 'y' : player_y, 'count' : 1});
                }
                else {
                    //Checks if position is not out of bounds
                    if (player_x + x >= 0 && player_x + x < mapSize && player_y + y >= 0 && player_y + y < mapSize){
                        map[player_x + x][player_y + y].vision.push(i);
                        visionContainer[i].push({ 'x' : player_x + x, 'y' : player_y + y, 'count' : 1});
                    }
                }
            }
        }

    }
    result = {'tmpMap': tmpMap, 'map': map, 'visionContainer': visionContainer, 'unitContainer': unitContainer};
    return result;
}

module.exports = gameSettings;