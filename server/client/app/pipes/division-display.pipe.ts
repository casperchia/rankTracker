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

    DIVISIONS = ['I', 'II', 'III','IV', 'V'];

    transform(value: number) {
        var division = '-';
        if(value && value > 0 && value <= this.DIVISIONS.length){
            division = this.DIVISIONS[value - 1]
        }
        return division;
    }
}
