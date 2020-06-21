const scoreTemplate = document.querySelector('#score-template').innerHTML
const leaderboard = document.querySelector('#table')

export function updateLeaderboard(socket, leaderboardStat){

    for (var i = 0; i < leaderboardStat.length; i++){
        const score = Mustache.render(scoreTemplate, {
            username: leaderboardStat[i][0],
            unit: leaderboardStat[i][1],
            territory: leaderboardStat[i][2]
        })
        leaderboard.insertAdjacentHTML('beforeend', score);
    }

    socket.on("updateLeaderBoard", result => {

        var leaderboard_tbody = leaderboard.getElementsByTagName('tbody');
        var tbody_length = leaderboard_tbody.length;

        for (var i = 1; i < tbody_length; i++){

            leaderboard_tbody[1].remove();
        }
        for (var i = 0; i < result.length; i++){
            const score = Mustache.render(scoreTemplate, {
                username: result[i][0],
                unit: result[i][1],
                territory: result[i][2]
            })
            leaderboard.insertAdjacentHTML('beforeend', score);
        }
    })
}