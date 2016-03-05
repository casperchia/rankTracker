/**
 * Created by Casper on 05/03/2016.
 */
import {Pipe} from "angular2/core";
import {PipeTransform} from "angular2/core";
import {Rank} from "../components/Rank";

@Pipe({
    name: 'rankDisplay'
})

export class RankDisplayPipe implements PipeTransform {

    TIERS = [
        'Unranked',
        'Prospect I',
        'Prospect II',
        'Prospect III',
        'Prospect Elite',
        'Challenger I',
        'Challenger II',
        'Challenger III',
        'Challenger Elite',
        'Rising Star',
        'Shooting Star',
        'All-Star',
        'Superstar',
        'Champion',
        'Super Champion',
        'Grand Champion'
    ]

    DIVISIONS = ['I', 'II', 'III','IV', 'V'];

    transform(rank: Rank) {
        var rankToDisplay;
        if(rank && rank.tier && rank.tier >= 0 && rank.tier < this.TIERS.length
            && rank.division && rank.division > 0 && rank.division <= this.DIVISIONS.length){
            if(rank.tier == 0){
                rankToDisplay = this.TIERS[rank.tier];
            }else{
                rankToDisplay = this.TIERS[rank.tier] + ' ' + 'Division ' + this.DIVISIONS[rank.division - 1];
            }
        }else{
            rankToDisplay = this.TIERS[0];
        }

        return rankToDisplay;

    }
}
