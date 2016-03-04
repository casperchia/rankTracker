/**
 * Created by Casper on 29/02/2016.
 */

import {Component} from "angular2/core";
import {OnChanges} from "angular2/core";
import {Input} from "angular2/core";
import {ResultDataService} from "../services/result-data.service";
import {OnInit} from "angular2/core";
import {ResultsData} from "./ResultsData";

@Component({
    selector: 'general-stats',
    templateUrl: 'app/components/general-stats.component.html',
    styleUrls: ['app/components/general-stats.component.css'],
    directives: [],
    providers: [],
})


export class GeneralStatsComponent implements OnChanges, OnInit{
    @Input() trigger: {};
    gamesPlayedToday: number = 0;
    resultsData: ResultsData[];
    winCount: number;
    lossCount: number;
    winPercentage: string;

    constructor(private _resultDataService: ResultDataService){}

    ngOnInit(){
        this.refreshData();
    }

    ngOnChanges(changes:{}){
        this.refreshData();
    }

    refreshData(){
        this.getAllResults();
        this.getGamesPlayedToday();
    }

    getAllResults(){
        this._resultDataService.getAllResults()
            .subscribe(
                data => {
                    this.resultsData = data;
                    this.winCount = 0;
                    this.lossCount = 0;
                    for(let x in this.resultsData){
                        if(this.resultsData[x].result === 'W'){
                            this.winCount++;
                        }
                        if(this.resultsData[x].result === 'L'){
                            this.lossCount++;
                        }
                    }
                    var winPercent = this.winCount / (this.winCount + this.lossCount) * 100;
                    this.winPercentage = this.numberToDecimal(winPercent);
                },
                err => console.error("getAllResultsData() error: " + err)
            );
    }

    getGamesPlayedToday(){
        this._resultDataService.getGamesPlayedToday('all')
            .subscribe(
                count => this.gamesPlayedToday = count,
                err => console.error("GeneralStatsComponent getGamesPlayedToday() error: " + err)
            )
    }

    numberToDecimal(num: number){
        return (Math.round(num * 10) / 10).toFixed(1);
    }
}
