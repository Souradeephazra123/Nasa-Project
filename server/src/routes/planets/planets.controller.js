import { planets } from "../../models/planets.model.js";


function getAllPlanets(req,res){
    //here return statement is use to stop unexpected error or unexpected infinite execution
    return res.status(200).json(planets);
}


export {getAllPlanets}