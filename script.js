const icon_width = 79;
const icon_height = 79;
const num_icons = 9;
const speed_per_icon = 100;
const indexes = [0, 0, 0];
const iconMap = ['banana', 'seven', 'cherry', 'plum', 'orange', 'bell', 'bar','lemon', 'melon'];

// reel - needed reel, offset - set delay between reels
const roll = (reel, offset = 0) => {
    // delta - random number of rolling icons
    const delta = (offset + 2) * num_icons + Math.round(Math.random() * num_icons);

    // get background-position-y and animation of reel
    const style = getComputedStyle(reel);
    const backgroundPositionY = parseFloat(style['background-position-y']);
    // how many icons was rolled
    const targetBackgroundPositionY = backgroundPositionY + delta * icon_height;
    // reset background-position-y to normalized
    const normTargetBackgroundPositionY = targetBackgroundPositionY%(num_icons * icon_height);

    return new Promise((resolve, reject) => {
        //set transition and background-position-y for reel
        reel.style.transition = `background-position-y ${8 + delta * speed_per_icon}ms cubic-bezier(.41,-0.01,.63,1.09)`;
        reel.style.backgroundPositionY = `${targetBackgroundPositionY}px`;

        // wait for rolling - time (8 + delta * speed_per_icon) and resolve delta
        setTimeout(() => {
            // // reset transition
            // reel.style.transition = 'none';
            // // set background-position-y to normalized
            // reel.style.backgroundPositionY = `${normTargetBackgroundPositionY}px`;
            reel.style.transition = `none`;
			reel.style.backgroundPositionY = `${normTargetBackgroundPositionY}px`;
            //which index of icon was rolled
            resolve(delta%num_icons);
        }, 8 + delta * speed_per_icon)
    })
}

function rollAll() {
    // select all reels in slots container 
    const reelsList = document.querySelectorAll('.slots > .reel');

    // listen for rolling of all reels and wait deltas (number of rolled icons for each reel)
    Promise 
        .all([...reelsList].map((reel, i) => roll(reel, i)))
        .then((deltas) => {
            // update indexes
            deltas.forEach((delta, i) => indexes[i] = (indexes[i] + delta) % num_icons);
            indexes.map((index) => console.log(iconMap[index]));

            // check win condition
            if (indexes[0] === indexes[1] || indexes[0] === indexes[1] === indexes[2]) {
                console.log('YOU WIN!');
            }


            setTimeout(() => rollAll(), 3000);
        })
}

rollAll();