import {Component} from "angular2/core";
import {ResultsData} from "./ResultsData";
import {ResultDataService} from "../services/result-data.service";
import {Rank} from "./Rank";
import {Output} from "angular2/core";
import {EventEmitter} from "angular2/core";

@Component({
    selector: 'stats',
    templateUrl: 'app/components/stats.component.html',
    styleUrls: ['app/components/stats.component.css'],
    directives: [],
    providers: [],
    inputs: ['gameMode']
})

export class StatsComponent{
    gameMode: string;
    resultsData: Array<ResultsData>;
    recentResults: Array<ResultsData>;
    winCount: number;
    lossCount: number;
    postResponse;
    nextGameNumber: number;
    currentRank: Rank = new Rank(0,0);
    winPercentage: string;
    recentWinPercentage: string;
    gamesPlayedToday: number;
    @Output() updateData = new EventEmitter();

    constructor(private _resultDataService: ResultDataService){}

    ngOnInit(){
        this.refreshData();
    }

    refreshData(){
        this.getResultsData();
        this.getRecentResults();
        this.getRankAndGameNumber();
        this.getGamesPlayedToday();
        this.updateData.emit("updateEvent");
    }

    getResultsData(){
        this._resultDataService.getResults(this.gameMode)
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
                err => console.error("getResultsData() error: " + err)
            );
    }

    getRecentResults(){
        this._resultDataService.getRecentResults(this.gameMode)
            .subscribe(
                data =>{
                    this.recentResults = data;
                    var winCount = 0;
                    var lossCount = 0;
                    for(let x in this.recentResults){
                        if(this.recentResults[x].result === 'W'){
                            winCount++;
                        }
                        if(this.recentResults[x].result === 'L'){
                            lossCount++;
                        }
                    }
                    var winPercent = winCount / (winCount + lossCount) * 100;
                    this.recentWinPercentage = this.numberToDecimal(winPercent);
                },
                err => console.log("getRecentResults() error: " + err)
            );
    }

    wonGame(){
        var resultData = {
            gameMode: this.gameMode,
            result: 'W',
            rank: this.currentRank,
            gameNumber: this.nextGameNumber
        };
        this.postData(resultData);
        //console.log("won " + this.gameMode);
    }

    lostGame(){
        var resultData = {
            gameMode: this.gameMode,
            result: 'L',
            rank: this.currentRank,
            gameNumber: this.nextGameNumber
        };
        this.postData(resultData);
        //console.log("lost " + this.gameMode);
    }

    rankUp(){
        this.currentRank.rankUp();
    }

    rankDown(){
        this.currentRank.rankDown();
    }

    postData(resultData){
        this._resultDataService.postResults(this.gameMode, resultData)
            .subscribe(
                data => {
                    this.postResponse = data;
                    this.refreshData();
                },
                err => console.log("postData() error: " + err)
            );
    }

    getRankAndGameNumber(){
        this._resultDataService.getLastGameData(this.gameMode)
            .subscribe(
                data => {
                    if(!data){
                        this.nextGameNumber = 1;
                        this.currentRank = new Rank(0, 0);
                    }else{
                        if(!data.gameNumber){
                            this.nextGameNumber = 1;
                        }else{
                            this.nextGameNumber = data.gameNumber + 1;
                        }
                        if(!data.rank || (!data.rank.tier && !data.rank.division)){
                            this.currentRank = new Rank(0, 0);
                        }else{
                            this.currentRank = new Rank(data.rank.tier, data.rank.division);
                        }
                    }
                },
                err => console.error("getRankAndGameNumber() error: " + err)
            )
    }

    numberToDecimal(num: number){
        return (Math.round(num * 10) / 10).toFixed(1);
    }

    undo(){
        console.log("undo()");
        this._resultDataService.deleteLastResult(this.gameMode)
            .subscribe(
                data => {
                    this.refreshData();
                },
                err => console.error("deleteLastResult() error: " + err)
            )
    }

    getGamesPlayedToday(){
        this._resultDataService.getGamesPlayedToday(this.gameMode)
            .subscribe(
                count => this.gamesPlayedToday = count,
                err => console.error("GeneralStatsComponent getGamesPlayedToday() error: " + err)
            )
    }

}