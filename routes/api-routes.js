const Workout = require("../models/WorkoutModel");
const Mongoose  = require("mongoose");
const Range = function findRange(workouts) {
    workoutRange = []
    const emptyWorkout = {
        exercises : [],
        totalDuration: 0
    }
    var dayOfWeek = new Date(Date.now()).getDay()
    
    for (i=0; i<= dayOfWeek; i++) {
        if (workouts[i]) {
            workoutRange.unshift(workouts[i])
        }
        else {
            workoutRange.unshift(emptyWorkout)
        }
    }

    return workoutRange
}

module.exports = function (app) {
    console.log('Engaging api-routes.js');

    app.get("/api/workouts", async (req, res) => {
        var workouts = await Workout.find();
        for (const workout of workouts) {
            await workout.setTotalDuration()
        }
        res.json(workouts);
    });

    app.post("/api/workouts", (req, res) => {
        Workout.create(req.body).then(data => {
            res.json(data)
        })
    });

    app.put("/api/workouts/:id", async (req, res) => {
        var workoutId = req.params.id
        Workout.findOneAndUpdate({ _id: Mongoose.Types.ObjectId(workoutId) }, {
            $push: {
                exercises: req.body
            }
        }).then(data => {
            res.json(data)
        })
        
    });

    app.get("/api/workouts/range", async (req, res) => {
        console.log('Engaging workouts/range api route.');
        Workout.find().then(data => {
            res.json(data);
        }).catch(err => alert(err))
    });
}

