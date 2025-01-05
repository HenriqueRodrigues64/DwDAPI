const express = require('express')
const router = express.Router();
const connection = require('../database')

export default function handler(req, res) {
    // Handle POST request to CheckComputer endpoint
    if (req.method === "POST" && req.url.includes("CheckComputer")) {
      // Example logic for responding with a mock ID
      const computerID = req.body?.ComputerID || "Unknown";
      res.status(200).json({ result: `ComputerID received: ${computerID}` });
    } else {
      // Default 404 for undefined routes
      res.status(404).json({ message: "Endpoint not found" });
    }
  }
  
router.get("/GetParts/:ComputerID/minigame/:minigameID" ,(req,res)=>{
    var computerID = req.params.ComputerID;
    var minigameID = req.params.minigameID;
    connection.execute("select * from players where UserID = ?",
        [computerID],
        function(err,results,fields){
            if (err){
                console.log(err)
                res.status(500).send({
                    "log": err
                });
                return
            }else if (results.length > 0){
                var playerID = results.UserID
                connection.execute('select parts.ID from player_part_collected INNER JOIN parts on player_part_collected.part_ID where player_ID = ? and parts.minigameID = ?',
                    [playerID,minigameID],
                    function(err,results,fields){
                        if (err){
                            console.log(err)
                            res.status(500).send({
                                "log": err
                            });
                            return
                        }else if (results.length > 1){
                            console.log("Necessary Parts Collected")
                            res.status(200).send({
                                "log": "Necessary Parts Collected",
                                "results": results,
                            });
                            return;
                        }else{
                            console.log("Not all parts collected")
                            res.status(200).send({
                                "log": "Not all parts collected",
                                "results": results
                            });
                        }
                    })
                return;
            }else{
                res.status(200).send({
                    "log": "Player doesn't exist",
                });
            }            
        })
        
})
router.post("/CheckComputer" ,(req,res)=>{
    var computerID = req.body.ComputerID;
    connection.execute("select * from players where UserID = ?",
        [computerID],
        function(err,results,fields){
            if (err){
                console.log(err)
                res.status(500).send({
                    "log": err
                });
                return
            }else if (results.length > 0){
                console.log("ComputerID exists")
                res.status(200).send({
                    "log": "ComputerID exists",
                    "playerID": results.UserID,
                    "computer": computerID
                });
                return;
            }else{
                console.log("ComputerID doesn't exist")
                res.status(400).send({
                    "log": "ComputerID doesn't exist",
                    "computer": computerID
                });
            }
        })
})
router.get("/CheckMinigame/:computerID/minigame/:minigameID" ,(req,res)=>{
    var computerID = req.params.computerID;
    var minigameID = req.params.minigameID;
    connection.execute("select * from players where UserID = ?",
        [computerID],
        function(err,results,fields){
            if (err){
                console.log(err)
                res.status(500).send({
                    "log": err
                });
                return
            }else if (results.length > 0){
                var playerID = results.length;
                connection.execute('select * from player_minigame_completed where player_ID = ? and minigame_ID = ?',
                    [playerID,minigameID],
                    function(err,results,fields){
                        if (err){
                            console.log(err)
                            res.status(500).send({
                                "log": err
                            });
                            return
                        }else if (results.length > 0){
                            console.log("Minigame Completed")
                            res.status(200).send({
                                "log": "Minigame Completed",
                                "completed": "true",
                                "results": results,
                            });
                            return;
                        }else{
                            console.log("Minigame Not Completed")
                            res.status(200).send({
                                "log": "Minigame Not Completed",
                                "completed": "false",
                                "results": results
                            });
                        }
                    })
            }else{
                console.log("Creating Player")
                console.log(computerID)
                CreateAccount()
            }
        })
})

router.post("/CheckingComputerID",(req,res)=>{
    var computerID = req.body.computer;
    if (!computerID){
        console.log("Missing ComputerID")
        res.status(400).send({
            "log": "Missing ComputerID"
        });
        return;
    }
    function CheckIfAccountExists(){
        connection.execute("select * from players where UserID = ?",
        [computerID],
        function(err,results,fields){
            if (err){
                console.log(err)
                res.status(500).send({
                    "log": err
                });
                return
            }else if (results.length > 0){
                console.log("ComputerID already exist")
                res.status(200).send({
                    "log": "ComputerID already logging in",
                    "playerID": results.UserID,
                    "computer": computerID
                });
                return;
            }else{
                console.log("Creating Player")
                console.log(computerID)
                CreateAccount()
            }
        })
    }
    function CreateAccount(){
        connection.execute('INSERT INTO players (UserID) VALUES (?)',
        [computerID],
        function(err,results,fields){
            if (err) {
                console.log(err)
                res.status(500).send({
                    "log": err
                });
            }else{
                console.log("Account created successfully")
                res.status(200).send({
                    "log": "Account created successfully",
                    "computer": computerID
                });
            }
        })
    }
    CheckIfAccountExists()
})

router.post("/LevelCompleted",(req,res)=>{
    var computerID = req.body.computerID;
    var parts = req.body.PartIDTab;
    parts = JSON.parse(parts)
    console.log(parts)
    console.log(parts.array[1])
    if (!parts || !computerID){
        console.log("Missing computerID or Parts")
        res.status(400).send({
            "log": "Missing computerID or Parts"
        });
        return;
    }
    connection.execute("select * from players where UserID = ?",
        [computerID],
        function(err,results,fields){
            if (err){
                console.log(err)
                res.status(500).send({
                    "log": err
                });
                return
            }else if (results.length > 0){
                var playerID = results.length;
                for (let i = 0; i < parts.array.length; i++) {
                    connection.execute("select * from player_part_collected where player_ID = ? And part_ID = ?",
                        [playerID,parts.array[i]],
                        function(err1,results,fields){
                            if (err1){
                                console.log(err1)
                                res.status(500).send({
                                    "log": err1
                                });
                                return
                            }else if (results.length > 0){
                                console.log("Part already collected")
                                res.status(200).send({
                                    "log": "Part already collected",
                                    "playerID": playerID
                                });
                                return;
                            }else{
                                connection.execute('INSERT INTO player_part_collected (player_ID,part_ID) VALUES (?,?)',
                                [playerID,parts.array[i]],
                                function (err, results, fields) {
                                    if (err){
                                        res.status(400).send({"log": "Error: "+ err});
                                        return
                                    }else{
                                        
                                    }
                                }
                                )
                            }
                        })
                }
                res.status(200).send({"log": "Part Obtained",})
                return;
            }else{
                console.log("ComputerID already exist")
                res.status(500).send({
                    "log": "ComputerID doesn't exist",
                });
                return; 
            }
    })
})

router.post("/MinigameFinish",(req,res)=>{
    var playerID = req.body.playerID;
    var mGame = req.body.minigameID
    if (!mGame || !playerID){
        console.log("Missing playerID or Minigame")
        res.status(400).send({
            "log": "Missing playerID or Minigame"
        });
        return;
    }
    connection.execute("select * from player_minigame_completed where player_ID = ? And minigame_ID = ?",
        [playerID,mGame],
        function(err1,results,fields){
            if (err1){
                console.log(err1)
                res.status(500).send({
                    "log": err1
                });
                return
            }else if (results.length > 0){
                console.log("Minigame already completed")
                res.status(200).send({
                    "log": "Minigame already completed",
                    "playerID": playerID
                });
                return;
            }else{
                connection.execute('INSERT INTO player_minigame_completed (player_ID,minigame_ID) VALUES (?,?)',
                [playerID,mGame],
                function (err, results, fields) {
                    if (err){
                        response.status(400).send({"log": "Error: "+ err});
                        return
                    }else{
                        response.status(200).send({"log": "Minigame Completed",})
                        return
                    }
                }
                )
            }
        })
})
module.exports = router
