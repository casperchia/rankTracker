/**
 * Created by Casper on 05/03/2016.
 */
import {Pipe} from "angular2/core";
import {PipeTransform} from "angular2/core";
import {Rank} from "../components/Rank";

@Pipe({
    name: 'divisionDisplay'
})

export class DivisionDisplayPipe implements PipeTransform {

    DIVISIONS = ['-', 'I', 'II', 'III','IV', 'V'];

    transform(rank: Rank) {
        var division;
        if(rank.tier == 0){
            division = this.DIVISIONS[0];
        }else{
            division = this.DIVISIONS[rank.division]
        }
        return division;
    }
}
