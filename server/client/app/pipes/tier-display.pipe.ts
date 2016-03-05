/**
 * Created by Casper on 05/03/2016.
 */
import {Pipe} from "angular2/core";
import {PipeTransform} from "angular2/core";
import {Rank} from "../components/Rank";

@Pipe({
    name: 'tierDisplay'
})

export class TierDisplayPipe implements PipeTransform {

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

    transform(rank: Rank) {
        return this.TIERS[rank.tier];
    }
}
