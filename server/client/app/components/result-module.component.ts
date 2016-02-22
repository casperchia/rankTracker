import {Component} from "angular2/core";
import {StatsComponent} from "./stats.component";
import {GraphComponent} from "./graph.component";

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
}