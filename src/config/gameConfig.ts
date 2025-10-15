export const gameConfig = {
    brick: {
        rows: 5,
        cols: 10,
        width: 64,
        height: 25,
        padding: 10,
        offsetTop: 50,
        offsetLeft: 80
    },
    paddle: {
        speed: 300,
        width: 100,
        height: 20,
    },
    ball: {
        speed: 200,
        radius: 10,
    },
    HUD: {
        heart: {
            spacing: 30,
            size: 20,
            y: 20
        },
        text: {
            fontSize: "20px",
            color: "#fff"
        },
        score: {
            x: 20
        },
        level: {
            offset_x: 20
        }
    }
}