import { planets ,getAllPlanets} from "../../models/planets.model.js";


async function httpGetAllPlanets(req,res){
    //here return statement is use to stop unexpected error or unexpected infinite execution
    return res.status(200).json(await getAllPlanets());
}


export {httpGetAllPlanets}