import {Component} from "angular2/core";
import {StatsComponent} from "./stats.component";
import {GraphComponent} from "./graph.component";
import {Output} from "angular2/core";
import {EventEmitter} from "angular2/core";

@Component({
    selector: 'result-module',
    templateUrl: 'app/components/result-module.component.html',
    styleUrls: ['app/components/result-module.component.css'],
    directives: [StatsComponent, GraphComponent],
    providers: [],
    inputs: ['gameMode']
})

export class ResultModuleComponent{
    gameMode: string;
    @Output() statUpdate = new EventEmitter();

    onStatUpdate(){
        this.statUpdate.emit("updateEvent");
    }
}