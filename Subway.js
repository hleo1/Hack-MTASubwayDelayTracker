const axios = require('axios');
let current_delays = new Set();

const delay_start = new Map();
const total_delay = new Map();
total_time = 1;

function setsAreEqual(a, b) {
    if (a.size !== b.size) {
        return false;
      }
    
      return Array.from(a).every(element => {
        return b.has(element);
      });
}

function setsAMinusB(a, b) {
    result = new Set();
    a.forEach(el => {
        if(!b.has(el)) {
            result.add(el);
        }
    });
    return result;
}

async function checkDelay() {
    const currently_delayed = new Set();
    try {
        const response = await axios.get('https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts.json', {
            headers: {
                'x-api-key' : "pRzJ4zkf352aFKsVCT5kG822nilyLGUJ70OpGZWW"
            }
        });
        data = response.data.entity;
        time = response.data.header.timestamp;
        // console.log(data);

        //still contains delays. this is alert dashboard
        const filtered = data.filter(data => data.alert["transit_realtime.mercury_alert"].alert_type == "Delays" && (data.alert.active_period[0].end == undefined || time < data.alert.active_period[0].end));
        // console.log(filtered);
        filtered.forEach(element => {
            entities = element.alert.informed_entity;
            entities.forEach(el => {
                if(el.route_id) {
                    // console.log(el.route_id);
                    currently_delayed.add(el.route_id);
                }
            })
        });
        return currently_delayed;
    } catch (error) {
        console.log(error);
        return current_delays;
    }
    
}

async function checkUpdates() {
    const new_delays = await checkDelay();
    // new_delays.forEach((value) => {
    //     console.log(value);
    // });
    if(!setsAreEqual(new_delays, current_delays)) {
        //compare set with current delays
        /*things that 
        current_delays - new_delays = just finished repairing!
        new_delays - current_delays = just added to repair list! 
        */
        const repair_finish = setsAMinusB(current_delays, new_delays);
        const under_repair = setsAMinusB(new_delays, current_delays);

        const today = new Date();
 
        repair_finish.forEach(el => {
            start = delay_start.get(el);
            delay_start.delete(el);
            total_delay_time = total_time - start;
            prev_delay_time = (total_delay.has(el)) ? total_delay.get(el) : 0;
            total_delay.set(el, total_delay_time + prev_delay_time);
            console.log("Line " + el + " is now recovered!" + " " + today);
        })

        under_repair.forEach(el => {
            delay_start.set(el, total_time);
            console.log("Line " + el + " is experiencing delays"+ " " + today);
        })
        //set 'set' with current delays
        current_delays = new_delays;
    }
}

checkUpdates();
setInterval(async () => {
    total_time++;
    await checkUpdates();
}, 30000);


const express = require('express');
const app = express()
const port = 3001;

function validLineNum(line_num) {
    return ['A', 'C', 'E', 'B', 'D', 'F', 'M', 'G', 'J', 'Z', 'N', 'Q', 'R', 'W', 'L', 
            '1', '2', '3', '4', '5', '6', '7', 'SI'].indexOf(line_num) >= 0;
}


app.get('/status/:id', (req, res) => {
    const line_num = req.params.id;
    if(!validLineNum(line_num)) {
        res.status(403).send("Invalid line identifier! View list of valid route id's: https://api.mta.info/#/subwayRealTimeFeeds. Note SIR id is just SI")
    }

    if(current_delays.has(line_num)) {
        res.send("Line " + line_num + " is experiencing delays!");
    } else {
        res.send("Line " + line_num + " is not experiencing delays!");
    }
});

app.get('/uptime/:id', (req, res) => {
    const line_num = req.params.id;

    if(!validLineNum(line_num)) {
        res.status(403).send("Invalid line identifier! View list of valid route id's: https://api.mta.info/#/subwayRealTimeFeeds. Note SIR id is just SI")
    }
    //get past delay times
    past_delays = (total_delay.has(line_num)) ? total_delay.get(line_num) : 0;
    //check if currently delayed, add that into consideration too!
    current_delay = (delay_start.has(line_num)) ? (total_time - delay_start.get(line_num)) : 0;
    total_time_delayed = past_delays + current_delay;

    uptime = 1 - (total_time_delayed / total_time);
    res.send("Line " + line_num + " has an uptime of : " + uptime.toFixed(3));
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});