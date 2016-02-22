import {Component} from "angular2/core";
import {ResultsData} from "./ResultsData";
import {ResultDataService} from "../services/result-data.service";

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
    currentRank: number;

    constructor(private _resultDataService: ResultDataService){}

    ngOnInit(){
        this.refreshData();
    }

    refreshData(){
        this.getResultsData();
        this.getRecentResults();
        this.getRankAndGameNumber();
    }

    getResultsData(){
        this._resultDataService.getResults(this.gameMode)
            .subscribe(data => {
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
                },
                err => console.log("getResultsData() error: " + err),
                () => console.log('Retrieved Data')
            );
    }

    getRecentResults(){
        this._resultDataService.getRecentResults(this.gameMode)
            .subscribe(
                data =>this.recentResults = data,
                err => console.log("getRecentResults() error: " + err),
                () => console.log('Retrieved recent results')
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
        console.log("won " + this.gameMode);
    }

    lostGame(){
        var resultData = {
            gameMode: this.gameMode,
            result: 'L',
            rank: this.currentRank,
            gameNumber: this.nextGameNumber
        };
        this.postData(resultData);
        console.log("lost " + this.gameMode);
    }

    rankUp(){
        this.currentRank++;
    }

    rankDown(){
        this.currentRank--;
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
                        this.currentRank = 0;
                    }else{
                        if(!data.gameNumber){
                            this.nextGameNumber = 1;
                        }else{
                            this.nextGameNumber = data.gameNumber + 1;
                        }
                        if(!data.rank){
                            this.currentRank = 0;
                            console.log("first");
                        }else{
                            this.currentRank = data.rank;
                            console.log("second");
                        }
                    }
                    console.log(JSON.stringify(data));
                },
                err => console.log("getRankAndGameNumber() error: " + err)
            )
    }
}