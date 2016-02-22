import {Injectable} from "angular2/core";
import {Http} from "angular2/http";
import {Headers} from "angular2/http";

@Injectable()
export class ResultDataService{

    constructor(private http: Http){}

    getResults(gameMode: string){
        var url = 'results/' + gameMode;
        return this.http.get(url)
            .map(res => res.json())
    }

    getRecentResults(gameMode: string){
        var url = 'recent/' + gameMode;
        return this.http.get(url)
            .map(res => res.json());
    }

    getLastGameData(gameMode: string){
        var url = 'last_game_data/' + gameMode;
        return this.http.get(url)
            .map(res => res.json());
    }

    postResults(gameMode: string, resultData){
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var url = 'results/' + gameMode;
        return this.http.post(url, JSON.stringify(resultData), {
            headers: headers
        });
    }
}